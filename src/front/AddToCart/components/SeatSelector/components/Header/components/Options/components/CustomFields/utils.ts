import { CustomFieldsEntryData, FrontCustomFieldData } from '@src/front/AddToCart/types';
import { DisplayCondition, NumberConditionOperator } from '@src/admin/Product/CustomFields/components/CustomFields/types';

/**
 * Converts customFields from UID keys to label keys for server submission
 * Filters out empty fields so they are not sent to the server
 */
export const convertCustomFieldsToLabels = (
    customFieldsData: CustomFieldsEntryData | undefined, // The data that will be submitted to the server
    customFields: FrontCustomFieldData[] // The custom fields definition
): CustomFieldsEntryData | undefined => {

    if (!customFieldsData || !customFields.length) {
        return customFieldsData;
    }

    const converted: CustomFieldsEntryData = {};

    // Create maps for quick lookup
    const uidToLabelMap = new Map<string, string>();
    const uidToFieldMap = new Map<string, FrontCustomFieldData>();
    customFields.forEach(field => {
        uidToLabelMap.set(field.uid, field.label);
        uidToFieldMap.set(field.uid, field);
    });

    // Convert UID keys to label keys and filter out empty values
    Object.keys(customFieldsData).forEach((uid) => {
        const value = customFieldsData[uid];
        const field = uidToFieldMap.get(uid);

        // Skip empty values
        if (isValueEmpty(value, field)) {
            return;
        }

        const label = uidToLabelMap.get(uid);
        
        if (label) {
            converted[label] = value;
        }
    });

    // Return undefined if no fields remain after filtering
    return Object.keys(converted).length > 0 ? converted : undefined;
};

/**
 * Checks if a custom field value is empty based on its field type
 */
export const isValueEmpty = (val: string | number | boolean | undefined, field?: FrontCustomFieldData): boolean => {
    if (val === undefined || val === null) return true;
    if (field?.type === 'checkbox') {
        const hasCheckedValue = field.checkedValue && field.checkedValue.trim() !== '';
        if (hasCheckedValue) {
            return val !== field.checkedValue;
        }
        return val !== 'yes' && val !== true;
    }
    if (field?.type === 'number') {
        const num = Number(val);
        return !Number.isFinite(num);
    }
    return String(val).trim() === '';
};

/**
 * Checks if a field has a valid value based on its type
 */
export const hasValidValue = (field: FrontCustomFieldData, fieldValue: string | number | boolean | undefined): boolean => {
    if (field.type === 'checkbox') {
        // Check for custom checkedValue if defined
        const checkedValue = field.checkedValue?.trim() || '';
        if (checkedValue) {
            return fieldValue === checkedValue;
        }
        // Otherwise check for standard checked values ('yes' or true)
        return fieldValue === 'yes' || fieldValue === true;
    }
    if (field.type === 'number') {
        // For required number fields, 0 or less is considered "empty" (no selection)
        const num = Number(fieldValue);
        return Number.isFinite(num) && num > 0;
    }
    return fieldValue !== undefined && String(fieldValue).trim() !== '';
};

/**
 * Gets the label for a field, falling back to a generated label if none exists
 */
export const getFieldLabel = (field: FrontCustomFieldData, index: number): string => {
    return (field.label || `field_${index}`).trim() || `field_${index}`;
};

/**
 * Builds a mutual exclusivity group for a given field index.
 * A group contains all field indices that are mutually exclusive with each other.
 */
export const getMutuallyExclusiveGroup = (fieldIndex: number, customFields: FrontCustomFieldData[]): Set<number> => {
    const group = new Set<number>([fieldIndex]);
    const toProcess = [fieldIndex];

    while (toProcess.length > 0) {
        const currentIndex = toProcess.pop()!;
        const currentField = customFields[currentIndex];

        if (!currentField) {
            continue;
        }

        // Add fields that this field is mutually exclusive with (by uid)
        if (currentField.mutuallyExclusiveWith) {
            for (const exclusiveUid of currentField.mutuallyExclusiveWith) {
                const exclusiveIndex = customFields.findIndex(f => f.uid === exclusiveUid);
                if (exclusiveIndex >= 0 && !group.has(exclusiveIndex)) {
                    group.add(exclusiveIndex);
                    toProcess.push(exclusiveIndex);
                }
            }
        }

        // Add fields that have this field in their mutuallyExclusiveWith array
        customFields.forEach((field, idx) => {
            if (!group.has(idx) && field.mutuallyExclusiveWith?.includes(currentField.uid)) {
                group.add(idx);
                toProcess.push(idx);
            }
        });
    }

    return group;
};

/**
 * Find a field by its uid
 */
const findFieldByUid = (uid: string, allFields: FrontCustomFieldData[]): FrontCustomFieldData | undefined => {
    return allFields.find(f => f.uid === uid);
};

/**
 * Find a field's index by its uid
 */
const findFieldIndexByUid = (uid: string, allFields: FrontCustomFieldData[]): number => {
    return allFields.findIndex(f => f.uid === uid);
};

/**
 * Evaluates a single display condition against the current field values.
 */
const evaluateCondition = (
    condition: DisplayCondition,
    allFields: FrontCustomFieldData[],
    values: Record<string, string | number | boolean>
): boolean => {
    const targetField = findFieldByUid(condition.fieldUid, allFields);
    if (!targetField) {
        return false; // Field doesn't exist, condition fails
    }

    const fieldKey = targetField.uid;
    const fieldValue = values[fieldKey];

    // Check condition type based on target field type
    if (targetField.type === 'checkbox') {
        const checkboxCondition = condition as Extract<DisplayCondition, { checked?: boolean }>;
        const hasCheckedValue = targetField.checkedValue && targetField.checkedValue.trim() !== '';
        const isChecked = hasCheckedValue
            ? fieldValue === targetField.checkedValue
            : fieldValue === 'yes' || fieldValue === true;

        return checkboxCondition.checked === isChecked;
    }

    if (targetField.type === 'select') {
        const selectCondition = condition as Extract<DisplayCondition, { selectedValues?: string[] }>;
        const selectedValues = selectCondition.selectedValues || [];

        // If no values specified in condition, condition is invalid - fail it
        if (selectedValues.length === 0) {
            return false;
        }

        const selectedValue = fieldValue !== undefined ? String(fieldValue) : '';

        // Check if the selected value is in the condition's selectedValues array
        return selectedValue !== '' && selectedValues.includes(selectedValue);
    }

    if (targetField.type === 'text' || targetField.type === 'textarea') {
        const textCondition = condition as Extract<DisplayCondition, { filled?: boolean }>;
        const isFilled = fieldValue !== undefined &&
            fieldValue !== null &&
            String(fieldValue).trim() !== '';

        return textCondition.filled === isFilled;
    }

    if (targetField.type === 'number') {
        const numberCondition = condition as Extract<DisplayCondition, { operator?: NumberConditionOperator; value?: number }>;
        const numericValue = fieldValue !== undefined && fieldValue !== null
            ? Number(fieldValue)
            : null;

        if (numericValue === null || !Number.isFinite(numericValue)) {
            // If field has no valid number, condition fails
            return false;
        }

        const conditionValue = numberCondition.value ?? 0;
        const operator = numberCondition.operator || 'eq';

        switch (operator) {
            case 'eq':
                return numericValue === conditionValue;
            case 'neq':
                return numericValue !== conditionValue;
            case 'gt':
                return numericValue > conditionValue;
            case 'lt':
                return numericValue < conditionValue;
            default:
                return false;
        }
    }

    return false; // Unknown field type, condition fails
};

/**
 * Recursively checks if a field is visible based on its conditions and the visibility of its dependencies.
 * A field is visible if:
 * 1. It has no conditions, OR
 * 2. All its conditions are met AND all target fields in those conditions are also visible
 * 
 * @param fieldIndex - The index of the field to check
 * @param allFields - All custom fields
 * @param values - Current field values
 * @param visited - Set of visited field uids to prevent circular dependencies
 * @returns true if the field is visible, false otherwise
 */
export const isFieldVisible = (
    fieldIndex: number,
    allFields: FrontCustomFieldData[],
    values: Record<string, string | number | boolean>,
    visited: Set<string> = new Set()
): boolean => {
    const field = allFields[fieldIndex];
    if (!field) {
        return false;
    }

    // Prevent infinite recursion in case of circular dependencies
    if (visited.has(field.uid)) {
        return false;
    }
    visited.add(field.uid);

    // If no display conditions, always show
    if (!field.displayConditions || field.displayConditions.length === 0) {
        return true;
    }

    // Check all conditions - share visited set to prevent redundant checks and detect cycles
    return field.displayConditions.every(condition => {
        const targetFieldIndex = findFieldIndexByUid(condition.fieldUid, allFields);

        // First, check if the target field is visible (recursive check)
        // Pass a copy of visited to each recursive call to track the path and prevent cycles
        const targetFieldVisible = isFieldVisible(targetFieldIndex, allFields, values, new Set(visited));
        if (!targetFieldVisible) {
            // If the target field is not visible, this condition fails
            return false;
        }

        // Then, check if the condition itself is met
        return evaluateCondition(condition, allFields, values);
    });
};
