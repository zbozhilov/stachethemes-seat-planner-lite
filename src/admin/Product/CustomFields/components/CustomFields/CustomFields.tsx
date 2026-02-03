import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import EmptyState from '@src/admin/Product/CommonUI/EmptyState/EmptyState';
import ExpandCollapseAllButton from '@src/admin/Product/CommonUI/ExpandCollapseAllButton/ExpandCollapseAllButton';
import Note from '@src/admin/Product/CommonUI/Note/Note';
import { __ } from '@src/utils';
import FieldItem from './components/FieldItem/FieldItem';
import './CustomFields.scss';
import { useDragAndDrop, useExpandedStates, useFieldHandlers, useFieldsState, useFieldsSync } from './hooks';
import { fieldsData } from './types';

const CustomFields = (props: {
    fieldsData: fieldsData[],
}) => {
    const [fields, setFields] = useFieldsState(props.fieldsData);
    
    const {
        expandedStates,
        toggleExpanded,
        expandCollapseAll,
        addExpandedState,
        removeExpandedState,
        reorderExpandedStates,
    } = useExpandedStates(fields);

    const {
        draggedIndex,
        dragOverIndex,
        handleDragStart,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDragEnd,
    } = useDragAndDrop();

    const fieldHandlers = useFieldHandlers(fields, setFields, {
        addExpandedState,
        removeExpandedState,
        reorderExpandedStates,
    });

    useFieldsSync(fields);

    // Detect duplicate field names (case-insensitive)
    const getDuplicateFieldIndices = () => {
        const labelCounts = new Map<string, number[]>();
        fields.forEach((field, index) => {
            const normalizedLabel = (field.label || '').trim().toLowerCase();
            if (normalizedLabel) {
                if (!labelCounts.has(normalizedLabel)) {
                    labelCounts.set(normalizedLabel, []);
                }
                labelCounts.get(normalizedLabel)!.push(index);
            }
        });
        
        const duplicateIndices = new Set<number>();
        labelCounts.forEach((indices) => {
            if (indices.length > 1) {
                indices.forEach((index) => duplicateIndices.add(index));
            }
        });
        
        return duplicateIndices;
    };

    const duplicateFieldIndices = getDuplicateFieldIndices();

    return (
        <Container label={__('MANAGE_CUSTOM_FIELDS')} description={__('MANAGE_CUSTOM_FIELDS_DESC')} className='stachesepl-seat-planner-custom-fields'>

            {fields.length > 0 && (
                <div className="stachesepl-custom-fields-controls">
                    <ExpandCollapseAllButton
                        allExpanded={fields.every((_, index) => expandedStates.get(index) ?? true)}
                        onClick={expandCollapseAll}
                    />
                </div>
            )}

            <ul className="stachesepl-seat-planner-custom-fields-list">
                {fields.map((field, index) => (
                    <FieldItem
                        key={index}
                        field={field}
                        index={index}
                        isExpanded={expandedStates.get(index) ?? true}
                        isDragOver={dragOverIndex === index}
                        isDuplicate={duplicateFieldIndices.has(index)}
                        allFields={fields}
                        onToggleExpanded={() => toggleExpanded(index)}
                        onRemove={fieldHandlers.handleRemoveField}
                        onLabelChange={fieldHandlers.handleChangeLabel}
                        onDescriptionChange={fieldHandlers.handleChangeDescription}
                        onTypeChange={fieldHandlers.handleChangeType}
                        onCheckedValueChange={fieldHandlers.handleChangeCheckedValue}
                        onPlaceholderChange={fieldHandlers.handleChangePlaceholder}
                        onAddSelectOption={fieldHandlers.handleAddSelectOption}
                        onRemoveSelectOption={fieldHandlers.handleRemoveSelectOption}
                        onUpdateSelectOptionLabel={fieldHandlers.handleUpdateSelectOptionLabel}
                        onUpdateSelectOptionPrice={fieldHandlers.handleUpdateSelectOptionPrice}
                        onMinChange={fieldHandlers.handleChangeMin}
                        onMaxChange={fieldHandlers.handleChangeMax}
                        onPriceChange={fieldHandlers.handleChangePrice}
                        onValueChange={fieldHandlers.handleChangeValue}
                        onRequiredToggle={fieldHandlers.handleToggleRequired}
                        onVisibleToggle={fieldHandlers.handleToggleVisible}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e, dropIndex) => fieldHandlers.handleDrop(e, dropIndex, draggedIndex, handleDragEnd)}
                        onDragEnd={handleDragEnd}
                        onAddDisplayCondition={fieldHandlers.handleAddDisplayCondition}
                        onRemoveDisplayCondition={fieldHandlers.handleRemoveDisplayCondition}
                        onUpdateDisplayCondition={fieldHandlers.handleUpdateDisplayCondition}
                        onAddMutuallyExclusiveField={fieldHandlers.handleAddMutuallyExclusiveField}
                        onRemoveMutuallyExclusiveField={fieldHandlers.handleRemoveMutuallyExclusiveField}
                    />
                ))}
            </ul>
            
            {fields.length === 0 && <EmptyState>{__('NO_CUSTOM_FIELDS_ADDED')}</EmptyState>}

            {fields.length > 0 && <Note>* {__('FIELD_UNIQUE_NOTE')}</Note>}

            <Button onClick={fieldHandlers.handleAddField}>
                {__('ADD_CUSTOM_FIELD')}
            </Button>
        </Container>
    );
};

export default CustomFields;

