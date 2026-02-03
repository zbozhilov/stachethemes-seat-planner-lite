import type { ManagerCustomFieldData, ManagerDisplayCondition } from '../pages/Manager/types';

/** Field types that can be edited in order/seat forms. */
export const EDITABLE_FIELD_TYPES = ['text', 'textarea', 'number', 'checkbox', 'select'] as const;

/**
 * Values keyed by field uid (used for visibility evaluation).
 */
export type ValuesByUid = Record<string, string | number | boolean>;

const findFieldByUid = (uid: string, allFields: ManagerCustomFieldData[]): ManagerCustomFieldData | undefined =>
    allFields.find(f => (f.uid ?? f.label) === uid);

const findFieldIndexByUid = (uid: string, allFields: ManagerCustomFieldData[]): number =>
    allFields.findIndex(f => (f.uid ?? f.label) === uid);

/**
 * Evaluates a single display condition against current values (keyed by uid).
 */
function evaluateCondition(
    condition: ManagerDisplayCondition,
    allFields: ManagerCustomFieldData[],
    values: ValuesByUid
): boolean {
    const targetField = findFieldByUid(condition.fieldUid, allFields);
    if (!targetField) return false;

    const fieldKey = targetField.uid ?? targetField.label;
    const fieldValue = values[fieldKey];

    if (targetField.type === 'checkbox') {
        const checked = 'checked' in condition ? condition.checked : false;
        const hasCheckedValue = targetField.checkedValue && targetField.checkedValue.trim() !== '';
        const isChecked = hasCheckedValue
            ? fieldValue === targetField.checkedValue
            : fieldValue === 'yes' || fieldValue === true;
        return checked === isChecked;
    }

    if (targetField.type === 'select') {
        const selectedValues = 'selectedValues' in condition ? condition.selectedValues : [];
        if (selectedValues.length === 0) return false;
        const selectedValue = fieldValue !== undefined ? String(fieldValue) : '';
        return selectedValue !== '' && selectedValues.includes(selectedValue);
    }

    if (targetField.type === 'text' || targetField.type === 'textarea') {
        const filled = 'filled' in condition ? condition.filled : false;
        const isFilled = fieldValue !== undefined &&
            fieldValue !== null &&
            String(fieldValue).trim() !== '';
        return filled === isFilled;
    }

    if (targetField.type === 'number') {
        const numericValue = fieldValue !== undefined && fieldValue !== null
            ? Number(fieldValue)
            : null;
        if (numericValue === null || !Number.isFinite(numericValue)) return false;
        const conditionValue = 'value' in condition ? condition.value : 0;
        const operator = 'operator' in condition ? condition.operator : 'eq';
        switch (operator) {
            case 'eq': return numericValue === conditionValue;
            case 'neq': return numericValue !== conditionValue;
            case 'gt': return numericValue > conditionValue;
            case 'lt': return numericValue < conditionValue;
            default: return false;
        }
    }

    return false;
}

/**
 * Recursively checks if a field is visible based on display conditions.
 * A field is visible if it has no conditions, or all conditions are met and target fields are visible.
 */
export function isFieldVisible(
    fieldIndex: number,
    allFields: ManagerCustomFieldData[],
    values: ValuesByUid,
    visited: Set<string> = new Set()
): boolean {
    const field = allFields[fieldIndex];
    if (!field) return false;

    const uid = field.uid ?? field.label;
    if (visited.has(uid)) return false;
    visited.add(uid);

    if (!field.displayConditions || field.displayConditions.length === 0) return true;

    return field.displayConditions.every(condition => {
        const targetFieldIndex = findFieldIndexByUid(condition.fieldUid, allFields);
        if (targetFieldIndex < 0) return false;
        const targetFieldVisible = isFieldVisible(targetFieldIndex, allFields, values, new Set(visited));
        if (!targetFieldVisible) return false;
        return evaluateCondition(condition, allFields, values);
    });
}

/**
 * Returns true if the value is considered empty for the given field type.
 */
export function isValueEmpty(
    val: string | number | boolean | undefined,
    field: ManagerCustomFieldData
): boolean {
    if (val === undefined || val === null) return true;
    if (field.type === 'checkbox') {
        const hasCheckedValue = field.checkedValue && field.checkedValue.trim() !== '';
        if (hasCheckedValue) return val !== field.checkedValue;
        return val !== 'yes' && val !== true;
    }
    if (field.type === 'number') {
        const num = Number(val);
        return !Number.isFinite(num);
    }
    return String(val).trim() === '';
}

/**
 * Returns true if this field should be hidden by mutual exclusivity:
 * another visible field that is mutually exclusive with this one has a value.
 */
export function isHiddenByMutualExclusivity(
    field: ManagerCustomFieldData,
    visibleFields: ManagerCustomFieldData[],
    valuesByLabel: Record<string, string | number | boolean>
): boolean {
    const thisUid = field.uid ?? field.label;
    const thisValue = valuesByLabel[field.label];
    if (!isValueEmpty(thisValue, field)) return false; // this field has a value, don't hide it

    const exclusiveUids = new Set<string>();
    if (field.mutuallyExclusiveWith) {
        field.mutuallyExclusiveWith.forEach(uid => exclusiveUids.add(uid));
    }
    visibleFields.forEach(f => {
        if ((f.uid ?? f.label) === thisUid) return;
        if (f.mutuallyExclusiveWith?.includes(thisUid)) exclusiveUids.add(f.uid ?? f.label);
    });

    for (const uid of exclusiveUids) {
        const other = visibleFields.find(f => (f.uid ?? f.label) === uid);
        if (!other) continue;
        const otherValue = valuesByLabel[other.label];
        if (!isValueEmpty(otherValue, other)) return true; // other has a value, hide this field
    }
    return false;
}

/**
 * Build values keyed by uid from label-keyed values and field list.
 */
export function buildValuesByUid(
    customFieldValues: Record<string, string | number | boolean>,
    fields: ManagerCustomFieldData[]
): ValuesByUid {
    const values: ValuesByUid = {};
    fields.forEach(f => {
        const key = f.uid ?? f.label;
        if (customFieldValues[f.label] !== undefined) {
            values[key] = customFieldValues[f.label];
        }
    });
    return values;
}
