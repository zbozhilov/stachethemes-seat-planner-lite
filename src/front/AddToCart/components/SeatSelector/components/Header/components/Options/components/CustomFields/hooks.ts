import { useCallback, useEffect, useMemo } from 'react';
import { useCustomFields, useSeatPlanData } from '@src/front/AddToCart/components/context/hooks';
import { FrontCustomFieldData } from '@src/front/AddToCart/types';
import { isFieldVisible, isValueEmpty } from './utils';

type UseCustomFieldsHookArgs = {
    seatId: string;
};

export const useCustomFieldsHook = ({ seatId }: UseCustomFieldsHookArgs) => {
    const { seatPlanData, setSeatPlanData } = useSeatPlanData();
    const { customFields } = useCustomFields();

    const theSeatData = useMemo(() => {
        if (!seatPlanData?.objects) return undefined;

        return seatPlanData.objects.find(
            (object) => object.type === 'seat' && object.seatId === seatId,
        );
    }, [seatPlanData, seatId]);

    const customFieldsValues = useMemo(() => {
        return theSeatData?.customFields || {};
    }, [theSeatData?.customFields]);

    /**
     * Ensure that number fields with a positive min have an initial value stored in state.
     * The UI renders "min" as the visible count when unset, so we align the persisted value
     * to avoid mismatched totals / submissions until the user interacts.
     */
    useEffect(() => {
        if (!seatPlanData?.objects) return;

        let didChange = false;

        const objects = seatPlanData.objects.map((obj) => {
            if (obj.type !== 'seat' || obj.seatId !== seatId) return obj;

            const existing = obj.customFields || {};
            const ordered: Record<string, string | number | boolean> = {};

            customFields.forEach((field) => {
                const key = field.uid;
                const current = existing[key];

                if (field.type === 'number') {
                    const min = field.min;
                    const max = field.max;
                    const hasPositiveMin = min !== undefined && min !== null && Number.isFinite(min) && min > 0;
                    const isUnset =
                        current === undefined ||
                        current === null ||
                        (typeof current === 'string' && current.trim() === '');

                    if (hasPositiveMin && isUnset) {
                        let next: number = min;
                        if (max !== undefined && max !== null && Number.isFinite(max)) {
                            next = Math.min(next, max);
                        }
                        ordered[key] = next;
                        didChange = true;
                        return;
                    }
                }

                ordered[key] = current as any;
            });

            // Append any extra legacy fields (by uid)
            Object.keys(existing).forEach((key) => {
                if (!(key in ordered)) {
                    // Only keep if it's a valid uid from customFields
                    const isValidUid = customFields.some(f => f.uid === key);
                    if (isValidUid) {
                        ordered[key] = existing[key] as any;
                    }
                }
            });

            return didChange ? { ...obj, customFields: ordered } : obj;
        });

        if (!didChange) return;
        setSeatPlanData({ ...seatPlanData, objects });
    }, [seatId, seatPlanData, setSeatPlanData, customFields]);

    const handleFieldChange = useCallback(
        (fieldUid: string, value: string | number | boolean) => {
            if (!seatPlanData?.objects) return;

            // Find the field being changed
            const changedField = customFields.find((field) => field.uid === fieldUid);
            if (!changedField) return;

            // Check if the new value is "empty" (field is being cleared)
            const isEmpty = isValueEmpty(value, changedField);

            // Collect uids of fields that should be cleared due to mutual exclusivity
            const fieldUidsToClear = new Set<string>();
            
            if (!isEmpty) {
                // If the changed field has a value, clear fields that are mutually exclusive with it
                // Case 1: Fields listed in this field's mutuallyExclusiveWith array
                // (If field A has B in its mutuallyExclusiveWith, and A gets a value, clear B)
                if (changedField.mutuallyExclusiveWith) {
                    changedField.mutuallyExclusiveWith.forEach((exclusiveUid) => {
                        fieldUidsToClear.add(exclusiveUid);
                    });
                }
                
                // Case 2: Fields that have this field in their mutuallyExclusiveWith array
                // (If field B has A in its mutuallyExclusiveWith, and A gets a value, clear B so A can be visible)
                customFields.forEach((field) => {
                    if (field.uid !== changedField.uid && field.mutuallyExclusiveWith?.includes(changedField.uid)) {
                        fieldUidsToClear.add(field.uid);
                    }
                });
            }

            const objects = seatPlanData.objects.map((obj) => {
                if (obj.type !== 'seat' || obj.seatId !== seatId) return obj;

                const existing = obj.customFields || {};
                const ordered: Record<string, string | number | boolean> = {};

                // Preserve order from customFields definition
                customFields.forEach((field) => {
                    const key = field.uid;
                    
                    if (key === fieldUid) {
                        // Set the new value for the changed field
                        ordered[key] = value;
                    } else if (fieldUidsToClear.has(field.uid)) {
                        // Clear mutually exclusive fields - don't include them in ordered
                        // They will be removed from the object
                    } else {
                        // Keep existing value
                        ordered[key] = existing[key];
                    }
                });

                // Append any extra legacy fields (but exclude cleared mutually exclusive fields)
                Object.keys(existing).forEach((key) => {
                    if (!(key in ordered)) {
                        // Check if this key belongs to a field that should be cleared
                        const shouldClear = customFields.some((field) => {
                            return field.uid === key && fieldUidsToClear.has(field.uid);
                        });
                        
                        if (!shouldClear) {
                            ordered[key] = existing[key];
                        }
                    }
                });

                return { ...obj, customFields: ordered };
            });

            setSeatPlanData({ ...seatPlanData, objects });
        },
        [seatId, seatPlanData, setSeatPlanData, customFields]
    );

    const getFieldValue = useCallback(
        (field: FrontCustomFieldData): string | number | boolean => {
            const key = field.uid;
            const value = customFieldsValues[key];

            if (field.type !== 'checkbox') {
                return value !== undefined ? String(value) : '';
            }

            if (value === undefined) return 'no';

            const checkedValue = field.checkedValue?.trim() || '';
            if (checkedValue) {
                return value === checkedValue ? 'yes' : 'no';
            }

            return value === true || value === 'yes' ? 'yes' : 'no';
        },
        [customFieldsValues]
    );


    /**
     * Filters custom fields based on display conditions.
     * A field is shown only if all its conditions are met (or if it has no conditions).
     * Also ensures that all target fields in conditions are visible (cascading visibility).
     */
    const visibleCustomFields = useMemo(() => {
        if (!customFields || customFields.length === 0) {
            return [];
        }

        return customFields.filter((field, index) => {
            return isFieldVisible(index, customFields, customFieldsValues);
        });
    }, [customFields, customFieldsValues]);

    return {
        customFields: visibleCustomFields,
        customFieldsValues,
        handleFieldChange,
        getFieldValue,
    };
};

