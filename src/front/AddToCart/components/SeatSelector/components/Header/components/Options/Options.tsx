import { useCustomFields, useDiscounts, useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { FrontWorkflowObject } from '@src/front/AddToCart/types';
import { __ } from '@src/utils';
import { useCallback, useMemo, useState } from 'react';
import { getMutuallyExclusiveGroup, hasValidValue, isFieldVisible } from './components/CustomFields/utils';
import Footer from './components/Footer/Footer';
import SeatOptions from './components/SeatOptions/SeatOptions';
import './Options.scss';

export type ValidationErrors = {
    [seatId: string]: {
        [fieldUid: string]: boolean; // true means this field has an error
    };
};

const OptionsContainer = () => {

    const { seatPlanData } = useSeatPlanData();
    const { selectedSeats } = useSelectedSeats();
    const { hasDiscounts } = useDiscounts();
    const { hasCustomFields, customFields } = useCustomFields();
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [showErrors, setShowErrors] = useState(false);

    // Create a Map for O(1) seat lookups instead of O(n) find operations
    const seatMap = useMemo(() => {
        if (!seatPlanData?.objects) {
            return new Map<string, FrontWorkflowObject>();
        }
        const map = new Map<string, FrontWorkflowObject>();
        seatPlanData.objects.forEach((object) => {
            if (object.type === 'seat' && object.seatId) {
                map.set(object.seatId, object);
            }
        });
        return map;
    }, [seatPlanData]);

    const getValidationErrors = useCallback((): ValidationErrors => {
        if (!hasCustomFields || !seatPlanData?.objects) {
            return {};
        }

        const errors: ValidationErrors = {};

        selectedSeats.forEach((seatId) => {
            const seatData = seatMap.get(seatId);
            
            if (!seatData) {
                return;
            }

            const seatCustomFields = seatData.customFields || {};
            const seatErrors: { [fieldUid: string]: boolean } = {};
            const validatedMutualGroups = new Set<string>(); // Track which mutual groups we've already validated

            customFields.forEach((field, index) => {
                if (!field.required) {
                    return;
                }

                // Skip validation if field is not visible due to display conditions
                if (!isFieldVisible(index, customFields, seatCustomFields)) {
                    return;
                }

                const fieldValue = seatCustomFields[field.uid];
                const isValid = hasValidValue(field, fieldValue);

                // Check if this field is part of a mutual exclusivity group
                const hasMutualExclusivity = field.mutuallyExclusiveWith && field.mutuallyExclusiveWith.length > 0;
                const isMutuallyExclusiveTarget = customFields.some(
                    (f) => f.uid !== field.uid && f.mutuallyExclusiveWith?.includes(field.uid)
                );

                if (hasMutualExclusivity || isMutuallyExclusiveTarget) {
                    // Get the full mutual exclusivity group
                    const mutualGroup = getMutuallyExclusiveGroup(index, customFields);
                    const groupKey = Array.from(mutualGroup).sort((a, b) => a - b).join(',');
                    
                    // Only validate this group once
                    if (!validatedMutualGroups.has(groupKey)) {
                        validatedMutualGroups.add(groupKey);
                        
                        // Get all required fields in this mutual group that are visible
                        const requiredFieldsInGroup: { index: number; uid: string; hasValue: boolean }[] = [];
                        
                        for (const groupIndex of mutualGroup) {
                            const groupField = customFields[groupIndex];
                            if (groupField?.required && isFieldVisible(groupIndex, customFields, seatCustomFields)) {
                                const groupFieldValue = seatCustomFields[groupField.uid];
                                requiredFieldsInGroup.push({
                                    index: groupIndex,
                                    uid: groupField.uid,
                                    hasValue: hasValidValue(groupField, groupFieldValue)
                                });
                            }
                        }
                        
                        // If at least one required field in the mutual group has a value, all are satisfied
                        const anyHasValue = requiredFieldsInGroup.some(f => f.hasValue);
                        
                        if (!anyHasValue && requiredFieldsInGroup.length > 0) {
                            // None have values - mark all visible required fields in the group as errors
                            for (const fieldInfo of requiredFieldsInGroup) {
                                seatErrors[fieldInfo.uid] = true;
                            }
                        }
                        // If at least one has a value, no errors for this group
                    }
                } else {
                    // Not part of any mutual exclusivity - validate normally
                    if (!isValid) {
                        seatErrors[field.uid] = true;
                    }
                }
            });

            if (Object.keys(seatErrors).length > 0) {
                errors[seatId] = seatErrors;
            }
        });

        return errors;
    }, [hasCustomFields, seatPlanData, selectedSeats, customFields, seatMap]);

    const validateFields = useCallback((shouldShowErrors: boolean = false): boolean => {
        const errors = getValidationErrors();
        setValidationErrors(errors);
        if (shouldShowErrors) {
            setShowErrors(true);
        }
        return Object.keys(errors).length === 0;
    }, [getValidationErrors]);

    const clearErrors = useCallback(() => {
        setValidationErrors({});
        setShowErrors(false);
    }, []);

    if (!selectedSeats.length || !seatPlanData?.objects || (!hasDiscounts && !hasCustomFields)) {
        return null;
    }

    return (
        <div className='stachesepl-options-container-outer'>

            <div className='stachesepl-options-container'>
                <h2 className='stachesepl-options-container-title'>{__('OPTIONS_TITLE')}</h2>
                <p className='stachesepl-options-container-subtitle'>{__('OPTIONS_SUBTITLE')}</p>

                <div className='stachesepl-options-container-seats'>
                    {
                        selectedSeats.map(seat => {

                            const theSeatData = seatMap.get(seat);

                            if (!theSeatData) {
                                return null;
                            }

                            return <SeatOptions
                                key={`seat-options-${seat}`}
                                seatId={seat}
                                validationErrors={showErrors ? validationErrors[seat] : undefined}
                                onFieldChange={clearErrors}
                            />

                        })
                    }
                </div>

                <Footer onValidate={validateFields} onValidateAndShowErrors={() => validateFields(true)} />

            </div>

        </div>
    )
}

export default OptionsContainer
