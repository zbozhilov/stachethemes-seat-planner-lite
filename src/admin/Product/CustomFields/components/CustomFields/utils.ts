import { generateUniqueId } from '@src/utils';
import { fieldsData, CustomFieldType, SelectOption, DisplayCondition } from './types';

const STORAGE_KEY = 'stachesepl-custom-fields-expand-all';

/**
 * Load expand all preference from localStorage
 */
export const loadExpandAllPreference = (): boolean => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            return JSON.parse(stored) === true;
        }
    } catch (e) {
        // Ignore errors, use default
    }
    return true; // Default to expanded
};

/**
 * Save expand all preference to localStorage
 */
export const saveExpandAllPreference = (expandAll: boolean) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expandAll));
    } catch (e) {
        // Ignore errors
    }
};

/**
 * Normalize a field to handle backward compatibility
 * Adds uid if missing
 */
export const normalizeField = (field: fieldsData): fieldsData => {
    let normalized = { ...field };
    
    // Add uid if missing
    if (!normalized.uid) {
        normalized.uid = generateUniqueId();
    }
    
    return normalized;
};

/**
 * Migrate display conditions from fieldIndex to fieldUid
 */
const migrateDisplayConditions = (
    conditions: any[] | undefined,
    uidMap: Map<number, string>
): DisplayCondition[] | undefined => {
    if (!conditions || conditions.length === 0) {
        return undefined;
    }

    return conditions.map(condition => {
        // If already using fieldUid, keep it
        if (condition.fieldUid !== undefined) {
            return condition;
        }
        
        // Migrate from fieldIndex to fieldUid
        const fieldIndex = condition.fieldIndex;
        const fieldUid = uidMap.get(fieldIndex);
        
        if (fieldUid === undefined) {
            // If we can't find the uid, keep the condition as-is (might be cleaned up later)
            return condition;
        }
        
        const { fieldIndex: _, ...rest } = condition;
        return {
            ...rest,
            fieldUid,
        };
    });
};

/**
 * Migrate mutuallyExclusiveWith from indices to uids
 */
const migrateMutualExclusivity = (
    indices: any[] | undefined,
    uidMap: Map<number, string>
): string[] | undefined => {
    if (!indices || indices.length === 0) {
        return undefined;
    }

    // Check if already migrated (contains strings)
    if (typeof indices[0] === 'string') {
        return indices as string[];
    }

    // Migrate from indices to uids
    return indices
        .map(index => uidMap.get(index))
        .filter((uid): uid is string => uid !== undefined);
};

/**
 * Normalize an array of fields
 * Handles backward compatibility including migration from index-based to uid-based references
 */
export const normalizeFields = (fields: fieldsData[]): fieldsData[] => {
    if (!fields || fields.length === 0) {
        return [];
    }

    // First pass: normalize fields and ensure all have uids
    const normalizedFields = fields.map(normalizeField);
    
    // Build a map from old index to new uid for migration
    const uidMap = new Map<number, string>();
    normalizedFields.forEach((field, index) => {
        uidMap.set(index, field.uid);
    });
    
    // Second pass: migrate displayConditions and mutuallyExclusiveWith
    return normalizedFields.map(field => {
        const migratedConditions = migrateDisplayConditions(field.displayConditions as any, uidMap);
        const migratedExclusivity = migrateMutualExclusivity(field.mutuallyExclusiveWith as any, uidMap);
        
        return {
            ...field,
            displayConditions: migratedConditions,
            mutuallyExclusiveWith: migratedExclusivity,
        };
    });
};

/**
 * Create a new field with the appropriate structure for the given type
 * Preserves the uid from the current field
 */
export const createFieldForType = (currentField: fieldsData, type: CustomFieldType): fieldsData => {
    const description = currentField.description;
    const uid = currentField.uid;

    switch (type) {
        case 'text':
            return {
                uid,
                label: currentField.label,
                type: 'text',
                description,
                required: currentField.required,
                visible: currentField.visible,
                placeholder: (currentField.type === 'text' || currentField.type === 'textarea')
                    ? currentField.placeholder
                    : undefined,
            };
        case 'textarea':
            return {
                uid,
                label: currentField.label,
                type: 'textarea',
                description,
                required: currentField.required,
                visible: currentField.visible,
                placeholder: (currentField.type === 'text' || currentField.type === 'textarea')
                    ? currentField.placeholder
                    : undefined,
            };
        case 'checkbox':
            return {
                uid,
                label: currentField.label,
                type: 'checkbox',
                description,
                required: currentField.required,
                visible: currentField.visible,
                checkedValue: currentField.type === 'checkbox'
                    ? currentField.checkedValue
                    : undefined,
                price: (currentField.type === 'checkbox' || currentField.type === 'number')
                    ? currentField.price
                    : undefined,
            };
        case 'select':
            return {
                uid,
                label: currentField.label,
                type: 'select',
                description,
                required: currentField.required,
                visible: currentField.visible,
                options: currentField.type === 'select' ? currentField.options : [],
            };
        case 'number':
            return {
                uid,
                label: currentField.label,
                type: 'number',
                description,
                required: currentField.required,
                visible: currentField.visible,
                min: currentField.type === 'number' ? currentField.min : undefined,
                max: currentField.type === 'number' ? currentField.max : undefined,
                placeholder: (currentField.type === 'text' || currentField.type === 'textarea' || currentField.type === 'number')
                    ? currentField.type === 'number' ? currentField.placeholder : currentField.placeholder
                    : undefined,
                price: (currentField.type === 'checkbox' || currentField.type === 'number')
                    ? currentField.price
                    : undefined,
            };
        case 'info':
            return {
                uid,
                label: currentField.label,
                type: 'info',
                description,
                required: currentField.required,
                visible: currentField.visible,
                displayConditions: currentField.displayConditions,
                mutuallyExclusiveWith: currentField.mutuallyExclusiveWith,
            };
        case 'meta':
            return {
                uid,
                label: currentField.label,
                type: 'meta',
                visible: currentField.visible,
                value: currentField.type === 'meta' ? currentField.value : undefined,
            };
    }
};

/**
 * Serialize fields to JSON format for form submission
 */
export const serializeFields = (fields: fieldsData[]): string => {
    return JSON.stringify(
        fields.map(field => {
            const base = {
                uid: field.uid,
                label: field.label ?? '',
                description: field.description ?? '',
                type: field.type,
                required: !!field.required,
                visible: !!field.visible,
                displayConditions: field.displayConditions || undefined,
                mutuallyExclusiveWith: field.mutuallyExclusiveWith || undefined,
            };

            if (field.type === 'text' || field.type === 'textarea') {
                return {
                    ...base,
                    placeholder: field.placeholder ?? '',
                };
            }

            if (field.type === 'checkbox') {
                return {
                    ...base,
                    checkedValue: field.checkedValue ?? '',
                    price: field.price,
                };
            }

            if (field.type === 'select') {
                // Handle backward compatibility: convert legacy string[] to SelectOption[]
                let options: SelectOption[] = [];

                if (field.options && field.options.length > 0) {
                    // New format: already SelectOption[]
                    options = field.options;
                }

                return {
                    ...base,
                    options,
                };
            }

            if (field.type === 'number') {
                return {
                    ...base,
                    min: field.min,
                    max: field.max,
                    placeholder: field.placeholder ?? '',
                    price: field.price,
                };
            }

            if (field.type === 'info') {
                return {
                    ...base,
                };
            }

            if (field.type === 'meta') {
                return {
                    uid: field.uid,
                    label: field.label ?? '',
                    type: field.type,
                    visible: !!field.visible,
                    value: field.value ?? '',
                };
            }

            return base;
        })
    );
};
