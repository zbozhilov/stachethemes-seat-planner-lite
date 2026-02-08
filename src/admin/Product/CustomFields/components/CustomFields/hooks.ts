import { useState, useRef, useEffect, useCallback } from 'react';
import { fieldsData, CustomFieldType, TextFieldData, DisplayCondition } from './types';
import { normalizeFields, createFieldForType, serializeFields, loadExpandAllPreference, saveExpandAllPreference } from './utils';
import { generateUniqueId } from '@src/utils';

/**
 * Hook to manage fields state with backward compatibility
 * ( prior to 1.4.0 custom fields were using fieldIndex instead of fieldUid )
 */
export const useFieldsState = (initialFields: fieldsData[]) => {
    const [fields, setFields] = useState<fieldsData[]>(() => {
        return normalizeFields(initialFields || []);
    });

    return [fields, setFields] as const;
};

/**
 * Hook to manage expanded states for fields
 */
export const useExpandedStates = (fields: fieldsData[]) => {
    const [expandedStates, setExpandedStates] = useState<Map<number, boolean>>(() => {
        const initialStates = new Map<number, boolean>();
        const expandAll = loadExpandAllPreference();
        
        fields.forEach((_, index) => {
            initialStates.set(index, expandAll);
        });
        
        return initialStates;
    });

    // Sync expanded states when fields change (e.g., when fields are added/removed externally)
    useEffect(() => {
        setExpandedStates(prev => {
            const newStates = new Map<number, boolean>();
            const expandAll = loadExpandAllPreference();
            
            fields.forEach((_, index) => {
                // Preserve existing state if index exists, otherwise use preference
                newStates.set(index, prev.has(index) ? prev.get(index)! : expandAll);
            });
            
            return newStates;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.length]);

    const toggleExpanded = useCallback((index: number) => {
        setExpandedStates(prev => {
            const newStates = new Map(prev);
            newStates.set(index, !(prev.get(index) ?? true));
            return newStates;
        });
    }, []);

    const expandCollapseAll = useCallback(() => {
        const allExpanded = fields.every((_, index) => expandedStates.get(index) ?? true);
        const newState = !allExpanded;
        const newExpandedStates = new Map<number, boolean>();
        fields.forEach((_, index) => {
            newExpandedStates.set(index, newState);
        });
        setExpandedStates(newExpandedStates);
        saveExpandAllPreference(newState);
    }, [fields, expandedStates]);

    const addExpandedState = useCallback((index: number) => {
        setExpandedStates(prev => {
            const newStates = new Map(prev);
            newStates.set(index, true);
            return newStates;
        });
    }, []);

    const removeExpandedState = useCallback((index: number) => {
        setExpandedStates(prev => {
            const newStates = new Map<number, boolean>();
            prev.forEach((expanded, i) => {
                if (i < index) {
                    newStates.set(i, expanded);
                } else if (i > index) {
                    newStates.set(i - 1, expanded);
                }
            });
            return newStates;
        });
    }, []);

    const reorderExpandedStates = useCallback((draggedIndex: number, dropIndex: number) => {
        setExpandedStates(prev => {
            const draggedExpanded = prev.get(draggedIndex) ?? true;
            const newExpandedStates = new Map<number, boolean>();
            
            // Rebuild expanded states map for the reordered fields
            for (let i = 0; i < fields.length; i++) {
                if (i === dropIndex) {
                    // The dragged field at its new position
                    newExpandedStates.set(i, draggedExpanded);
                } else if (i < dropIndex && i < draggedIndex) {
                    // Fields before both positions: keep original index
                    newExpandedStates.set(i, prev.get(i) ?? true);
                } else if (i < dropIndex && i >= draggedIndex) {
                    // Fields between dragged and drop (when dragging forward): shift up
                    newExpandedStates.set(i, prev.get(i + 1) ?? true);
                } else if (i > dropIndex && i <= draggedIndex) {
                    // Fields between drop and dragged (when dragging backward): shift down
                    newExpandedStates.set(i, prev.get(i - 1) ?? true);
                } else {
                    // Fields after both positions: keep original index
                    newExpandedStates.set(i, prev.get(i) ?? true);
                }
            }
            
            return newExpandedStates;
        });
    }, [fields.length]);

    return {
        expandedStates,
        toggleExpanded,
        expandCollapseAll,
        addExpandedState,
        removeExpandedState,
        reorderExpandedStates,
    };
};

/**
 * Hook to manage drag and drop state
 */
export const useDragAndDrop = () => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const dragNode = useRef<HTMLLIElement | null>(null);

    const handleDragStart = useCallback((e: React.DragEvent<HTMLLIElement>, index: number) => {
        setDraggedIndex(index);
        dragNode.current = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        // Add dragging class after a small delay to allow the drag image to be captured
        const timeoutId = setTimeout(() => {
            if (dragNode.current) {
                dragNode.current.classList.add('dragging');
            }
        }, 0);
        // Store timeout ID for cleanup
        (dragNode.current as any).__dragTimeoutId = timeoutId;
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLIElement>, index: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    }, [draggedIndex]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLIElement>) => {
        // Only clear if leaving the item entirely
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setDragOverIndex(null);
        }
    }, []);

    const handleDragEnd = useCallback(() => {
        if (dragNode.current) {
            dragNode.current.classList.remove('dragging');
            // Clean up timeout if it exists
            const timeoutId = (dragNode.current as any).__dragTimeoutId;
            if (timeoutId) {
                clearTimeout(timeoutId);
                delete (dragNode.current as any).__dragTimeoutId;
            }
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
        dragNode.current = null;
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (dragNode.current) {
                const timeoutId = (dragNode.current as any).__dragTimeoutId;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            }
        };
    }, []);

    return {
        draggedIndex,
        dragOverIndex,
        handleDragStart,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDragEnd,
    };
};

/**
 * Hook to manage all field handlers
 */
export const useFieldHandlers = (
    fields: fieldsData[],
    setFields: React.Dispatch<React.SetStateAction<fieldsData[]>>,
    expandedStates: { addExpandedState: (index: number) => void; removeExpandedState: (index: number) => void; reorderExpandedStates: (draggedIndex: number, dropIndex: number) => void }
) => {
    const handleAddField = useCallback(() => {
        const newField: TextFieldData = {
            uid: generateUniqueId(),
            label: '',
            type: 'text',
            description: '',
            required: false,
            visible: true,
            placeholder: '',
        };

        setFields(prev => {
            const newIndex = prev.length;
            expandedStates.addExpandedState(newIndex);
            return [...prev, newField];
        });
    }, [setFields, expandedStates]);

    const handleRemoveField = useCallback((index: number) => {
        setFields(prev => {
            if (index < 0 || index >= prev.length) {
                return prev; // Invalid index, return unchanged
            }
            
            const removedFieldUid = prev[index].uid;
            expandedStates.removeExpandedState(index);
            
            // Remove the field and clean up any references to it
            return prev
                .filter((_, i) => i !== index)
                .map(field => {
                    let updated = false;
                    let newField = { ...field };
                    
                    // Remove references from displayConditions
                    if (field.displayConditions && field.displayConditions.length > 0) {
                        const filteredConditions = field.displayConditions.filter(
                            condition => condition.fieldUid !== removedFieldUid
                        );
                        if (filteredConditions.length !== field.displayConditions.length) {
                            newField.displayConditions = filteredConditions.length > 0 ? filteredConditions : undefined;
                            updated = true;
                        }
                    }
                    
                    // Remove references from mutuallyExclusiveWith
                    if (field.mutuallyExclusiveWith && field.mutuallyExclusiveWith.length > 0) {
                        const filteredExclusive = field.mutuallyExclusiveWith.filter(
                            uid => uid !== removedFieldUid
                        );
                        if (filteredExclusive.length !== field.mutuallyExclusiveWith.length) {
                            newField.mutuallyExclusiveWith = filteredExclusive.length > 0 ? filteredExclusive : undefined;
                            updated = true;
                        }
                    }
                    
                    return updated ? newField : field;
                });
        });
    }, [setFields, expandedStates]);

    const handleChangeType = useCallback((index: number, type: CustomFieldType) => {
        setFields(prev => {
            if (index < 0 || index >= prev.length) {
                return prev; // Invalid index, return unchanged
            }
            const newFields = [...prev];
            const currentField = newFields[index];
            newFields[index] = createFieldForType(currentField, type);
            return newFields;
        });
    }, [setFields]);

    const handleChangeLabel = useCallback((index: number, label: string) => {
        setFields(prev => {
            const newFields = [...prev];
            newFields[index] = {
                ...newFields[index],
                label,
            };
            return newFields;
        });
    }, [setFields]);

    const handleChangeDescription = useCallback((index: number, description: string) => {
        setFields(prev => {
            const newFields = [...prev];
            newFields[index] = {
                ...newFields[index],
                description,
            };
            return newFields;
        });
    }, [setFields]);

    const handleAddSelectOption = useCallback((index: number) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'select') {
                const currentOptions = field.options || [];
                newFields[index] = {
                    ...field,
                    options: [...currentOptions, { label: '', price: undefined }],
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleRemoveSelectOption = useCallback((index: number, optionIndex: number) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'select' && field.options) {
                newFields[index] = {
                    ...field,
                    options: field.options.filter((_, i) => i !== optionIndex),
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleUpdateSelectOptionLabel = useCallback((index: number, optionIndex: number, label: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'select' && field.options) {
                const updatedOptions = [...field.options];
                updatedOptions[optionIndex] = {
                    ...updatedOptions[optionIndex],
                    label,
                };
                newFields[index] = {
                    ...field,
                    options: updatedOptions,
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleUpdateSelectOptionPrice = useCallback((index: number, optionIndex: number, price: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'select' && field.options) {
                const updatedOptions = [...field.options];
                updatedOptions[optionIndex] = {
                    ...updatedOptions[optionIndex],
                    price: price === '' ? undefined : Number(price),
                };
                newFields[index] = {
                    ...field,
                    options: updatedOptions,
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleChangePlaceholder = useCallback((index: number, placeholder: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'text' || field.type === 'textarea' || field.type === 'number') {
                newFields[index] = {
                    ...field,
                    placeholder,
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleToggleRequired = useCallback((index: number) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            const currentRequired = !!field.required;
            newFields[index] = {
                ...field,
                required: !currentRequired,
            };
            return newFields;
        });
    }, [setFields]);

    const handleToggleVisible = useCallback((index: number) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            const currentVisible = !!field.visible;
            newFields[index] = {
                ...field,
                visible: !currentVisible,
            };
            return newFields;
        });
    }, [setFields]);

    const handleChangeCheckedValue = useCallback((index: number, checkedValue: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'checkbox') {
                newFields[index] = {
                    ...field,
                    checkedValue,
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleChangeMin = useCallback((index: number, min: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'number') {
                newFields[index] = {
                    ...field,
                    min: min === '' ? undefined : Number(min),
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleChangeMax = useCallback((index: number, max: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'number') {
                newFields[index] = {
                    ...field,
                    max: max === '' ? undefined : Number(max),
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleChangePrice = useCallback((index: number, price: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'checkbox' || field.type === 'number') {
                newFields[index] = {
                    ...field,
                    price: price === '' ? undefined : Number(price),
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleChangeValue = useCallback((index: number, value: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'meta') {
                newFields[index] = {
                    ...field,
                    value,
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleAddDisplayCondition = useCallback((index: number) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'meta') {
                return prev; // Meta fields don't support display conditions
            }

            // Find the first available field to use as default condition target
            const availableField = prev.find((f, idx) => idx !== index && f.type !== 'meta' && f.type !== 'info');
            if (!availableField) {
                return prev; // No available fields
            }

            let newCondition: DisplayCondition;

            // Create condition based on target field type
            if (availableField.type === 'checkbox') {
                newCondition = {
                    fieldUid: availableField.uid,
                    checked: true,
                };
            } else if (availableField.type === 'select') {
                newCondition = {
                    fieldUid: availableField.uid,
                    selectedValues: [],
                };
            } else if (availableField.type === 'text' || availableField.type === 'textarea') {
                newCondition = {
                    fieldUid: availableField.uid,
                    filled: true,
                };
            } else if (availableField.type === 'number') {
                newCondition = {
                    fieldUid: availableField.uid,
                    operator: 'eq',
                    value: 0,
                };
            } else {
                return prev; // Should not happen
            }

            // Create a new field object with updated displayConditions to avoid mutation
            newFields[index] = {
                ...field,
                displayConditions: [...(field.displayConditions || []), newCondition],
            };
            return newFields;
        });
    }, [setFields]);

    const handleRemoveDisplayCondition = useCallback((index: number, conditionIndex: number) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.displayConditions) {
                // Create a new field object with updated displayConditions to avoid mutation
                newFields[index] = {
                    ...field,
                    displayConditions: field.displayConditions.filter((_, i) => i !== conditionIndex),
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleUpdateDisplayCondition = useCallback((index: number, conditionIndex: number, condition: DisplayCondition) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.displayConditions) {
                // Create a new field object with updated displayConditions to avoid mutation
                const updatedConditions = [...field.displayConditions];
                updatedConditions[conditionIndex] = condition;
                newFields[index] = {
                    ...field,
                    displayConditions: updatedConditions,
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleAddMutuallyExclusiveField = useCallback((index: number, exclusiveFieldUid: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.type === 'meta') {
                return prev; // Meta fields don't support mutual exclusivity
            }

            // Find the exclusive field by uid
            const exclusiveField = prev.find(f => f.uid === exclusiveFieldUid);
            if (!exclusiveField || exclusiveField.type === 'meta' || exclusiveField.uid === field.uid) {
                return prev; // Invalid field
            }

            // Check if already in the list
            const currentExclusive = field.mutuallyExclusiveWith || [];
            if (currentExclusive.includes(exclusiveFieldUid)) {
                return prev; // Already added
            }

            // Create a new field object with updated mutuallyExclusiveWith to avoid mutation
            newFields[index] = {
                ...field,
                mutuallyExclusiveWith: [...(field.mutuallyExclusiveWith || []), exclusiveFieldUid],
            };
            return newFields;
        });
    }, [setFields]);

    const handleRemoveMutuallyExclusiveField = useCallback((index: number, exclusiveFieldUid: string) => {
        setFields(prev => {
            const newFields = [...prev];
            const field = newFields[index];
            if (field.mutuallyExclusiveWith) {
                // Create a new field object with updated mutuallyExclusiveWith to avoid mutation
                newFields[index] = {
                    ...field,
                    mutuallyExclusiveWith: field.mutuallyExclusiveWith.filter(
                        uid => uid !== exclusiveFieldUid
                    ),
                };
            }
            return newFields;
        });
    }, [setFields]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLLIElement>, dropIndex: number, draggedIndex: number | null, onDragEnd: () => void) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            setFields(prev => {
                // Validate indices
                if (draggedIndex < 0 || draggedIndex >= prev.length || dropIndex < 0 || dropIndex > prev.length) {
                    return prev; // Invalid indices, return unchanged
                }
                const newFields = [...prev];
                const [draggedField] = newFields.splice(draggedIndex, 1);
                newFields.splice(dropIndex, 0, draggedField);

                // No need to update displayConditions or mutuallyExclusiveWith
                // since they now use UIDs which are stable across reordering
                return newFields;
            });
            
            expandedStates.reorderExpandedStates(draggedIndex, dropIndex);
        }
        onDragEnd();
    }, [setFields, expandedStates]);

    return {
        handleAddField,
        handleRemoveField,
        handleChangeType,
        handleChangeLabel,
        handleChangeDescription,
        handleAddSelectOption,
        handleRemoveSelectOption,
        handleUpdateSelectOptionLabel,
        handleUpdateSelectOptionPrice,
        handleChangePlaceholder,
        handleToggleRequired,
        handleToggleVisible,
        handleChangeCheckedValue,
        handleChangeMin,
        handleChangeMax,
        handleChangePrice,
        handleChangeValue,
        handleAddDisplayCondition,
        handleRemoveDisplayCondition,
        handleUpdateDisplayCondition,
        handleAddMutuallyExclusiveField,
        handleRemoveMutuallyExclusiveField,
        handleDrop,
    };
};

/**
 * Hook to sync fields to hidden input for form submission
 */
export const useFieldsSync = (fields: fieldsData[]) => {
    useEffect(() => {
        const inputData = document.getElementById('stachesepl-seat-planner-custom-fields-data') as HTMLInputElement | null;

        if (!inputData) {
            return;
        }

        inputData.value = serializeFields(fields);
    }, [fields]);
};
