import { Close as Delete, DragIndicator, ExpandLess, ExpandMore } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useEffect, useState } from 'react';
import { CustomFieldType, fieldsData, DisplayCondition } from '../../types';
import FieldToggle from '../FieldToggle/FieldToggle';
import FieldTypeSpecificInputs from '../FieldTypeSpecificInputs/FieldTypeSpecificInputs';
import DisplayConditions from '../DisplayConditions/DisplayConditions';
import MutualExclusivity from '../MutualExclusivity/MutualExclusivity';
import './FieldItem.scss';

interface FieldItemProps {
    field: fieldsData;
    index: number;
    isExpanded: boolean;
    isDragOver: boolean;
    isDuplicate: boolean;
    allFields: fieldsData[];
    onToggleExpanded: () => void;
    onRemove: (index: number) => void;
    onLabelChange: (index: number, label: string) => void;
    onDescriptionChange: (index: number, description: string) => void;
    onTypeChange: (index: number, type: CustomFieldType) => void;
    onCheckedValueChange: (index: number, value: string) => void;
    onPlaceholderChange: (index: number, value: string) => void;
    onAddSelectOption: (index: number) => void;
    onRemoveSelectOption: (index: number, optionIndex: number) => void;
    onUpdateSelectOptionLabel: (index: number, optionIndex: number, label: string) => void;
    onUpdateSelectOptionPrice: (index: number, optionIndex: number, price: string) => void;
    onMinChange: (index: number, value: string) => void;
    onMaxChange: (index: number, value: string) => void;
    onPriceChange: (index: number, value: string) => void;
    onValueChange: (index: number, value: string) => void;
    onRequiredToggle: (index: number) => void;
    onVisibleToggle: (index: number) => void;
    onDragStart: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
    onDragEnter: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLLIElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLLIElement>) => void;
    onDrop: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
    onDragEnd: () => void;
    onAddDisplayCondition: (index: number) => void;
    onRemoveDisplayCondition: (index: number, conditionIndex: number) => void;
    onUpdateDisplayCondition: (index: number, conditionIndex: number, condition: DisplayCondition) => void;
    onAddMutuallyExclusiveField: (index: number, exclusiveFieldUid: string) => void;
    onRemoveMutuallyExclusiveField: (index: number, exclusiveFieldUid: string) => void;
}

const FieldItem = ({
    field,
    index,
    isExpanded,
    isDragOver,
    isDuplicate,
    allFields,
    onToggleExpanded,
    onRemove,
    onLabelChange,
    onDescriptionChange,
    onTypeChange,
    onCheckedValueChange,
    onPlaceholderChange,
    onAddSelectOption,
    onRemoveSelectOption,
    onUpdateSelectOptionLabel,
    onUpdateSelectOptionPrice,
    onMinChange,
    onMaxChange,
    onPriceChange,
    onValueChange,
    onRequiredToggle,
    onVisibleToggle,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    onAddDisplayCondition,
    onRemoveDisplayCondition,
    onUpdateDisplayCondition,
    onAddMutuallyExclusiveField,
    onRemoveMutuallyExclusiveField,
}: FieldItemProps) => {
    const [isDragEnabled, setIsDragEnabled] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');

    useEffect(() => {
        const disable = () => setIsDragEnabled(false);
        window.addEventListener('mouseup', disable);
        window.addEventListener('touchend', disable);
        window.addEventListener('touchcancel', disable);
        return () => {
            window.removeEventListener('mouseup', disable);
            window.removeEventListener('touchend', disable);
            window.removeEventListener('touchcancel', disable);
        };
    }, []);

    // Reset to general tab if advanced tab is not available
    useEffect(() => {
        const hasAdvancedTab = allFields.length > 1 && field.type !== 'meta';
        if (activeTab === 'advanced' && !hasAdvancedTab) {
            setActiveTab('general');
        }
    }, [allFields.length, field.type, activeTab]);

    return (
        <li
            draggable={isDragEnabled}
            onDragStart={(e) => {
                // Only allow drag if it started from the drag indicator/handle.
                if (!isDragEnabled) {
                    e.preventDefault();
                    return;
                }
                onDragStart(e, index);
            }}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={() => {
                setIsDragEnabled(false);
                onDragEnd();
            }}
            className={`${isDragOver ? 'drag-over' : ''}${isDuplicate ? ' has-duplicate-name' : ''}`}
        >
            <div className={`stachesepl-seat-planner-custom-fields-item-header ${!isExpanded ? 'stachesepl-seat-planner-custom-fields-item-header-collapsed' : ''}`}>
                <div className='stachesepl-seat-planner-custom-fields-item-header-content'>
                    <DragIndicator
                        className='stachesepl-seat-planner-custom-fields-drag-handle'
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsDragEnabled(true);
                        }}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                            setIsDragEnabled(true);
                        }}
                    />
                    <div className='stachesepl-seat-planner-custom-fields-item-header-title'>
                        {field.label || __('FIELD_NAME_BLANK')}
                    </div>
                </div>
                <div className='stachesepl-seat-planner-custom-fields-item-header-right'>
                    <button
                        type="button"
                        className="stachesepl-seat-planner-custom-fields-toggle"
                        onClick={onToggleExpanded}
                    >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </button>
                    <Delete
                        className='stachesepl-seat-planner-custom-fields-delete'
                        onClick={() => onRemove(index)}
                    />
                </div>
            </div>

            {isExpanded && (
                <div className="stachesepl-seat-planner-custom-fields-item-body">
                    {/* Tab Navigation */}
                    <div className="stachesepl-custom-fields-tabs">
                        <button
                            type="button"
                            className={`stachesepl-custom-fields-tab ${activeTab === 'general' ? 'stachesepl-custom-fields-tab-active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            {__('CF_TAB_GENERAL')}
                        </button>
                        {allFields.length > 1 && field.type !== 'meta' && (
                            <button
                                type="button"
                                className={`stachesepl-custom-fields-tab ${activeTab === 'advanced' ? 'stachesepl-custom-fields-tab-active' : ''}`}
                                onClick={() => setActiveTab('advanced')}
                            >
                                {__('CF_TAB_ADVANCED')}
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'general' && (
                        <div className="stachesepl-custom-fields-tab-content">
                            {/* Basic Information */}
                            <div className="stachesepl-custom-fields-group">
                                <div className="stachesepl-custom-fields-row">
                                    <label className="stachesepl-custom-fields-field-half">
                                        <span>{__('FIELD_NAME')}*</span>
                                        <input
                                            type="text"
                                            value={field.label}
                                            onChange={(e) => onLabelChange(index, e.target.value)}
                                            placeholder={__('FIELD_NAME')}
                                        />
                                    </label>

                                    <label className="stachesepl-custom-fields-field-half">
                                        <span>{__('FIELD_TYPE')}</span>
                                        <select
                                            value={field.type}
                                            onChange={(e) => onTypeChange(index, e.target.value as CustomFieldType)}
                                        >
                                            <option value="text">{__('TEXT_FIELD')}</option>
                                            <option value="textarea">{__('TEXTAREA_FIELD')}</option>
                                            <option value="checkbox">{__('CHECKBOX_FIELD')}</option>
                                            <option value="select">{__('SELECT_FIELD')}</option>
                                            <option value="number">{__('NUMBER_FIELD')}</option>
                                            <option value="info">{__('INFO_FIELD')}</option>
                                            <option value="meta">{__('META_FIELD')}</option>
                                        </select>
                                    </label>
                                </div>

                                {field.type !== 'meta' && (
                                    <label>
                                        <span>{__('FIELD_DESCRIPTION')}</span>
                                        <textarea
                                            value={field.description ?? ''}
                                            onChange={(e) => onDescriptionChange(index, e.target.value)}
                                            placeholder={__('FIELD_DESCRIPTION')}
                                            rows={2}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Field-Specific Settings */}
                            {field.type !== 'info' && (
                                <div className="stachesepl-custom-fields-group">
                                    <FieldTypeSpecificInputs
                                        field={field}
                                        index={index}
                                        onCheckedValueChange={onCheckedValueChange}
                                        onPlaceholderChange={onPlaceholderChange}
                                        onAddSelectOption={onAddSelectOption}
                                        onRemoveSelectOption={onRemoveSelectOption}
                                        onUpdateSelectOptionLabel={onUpdateSelectOptionLabel}
                                        onUpdateSelectOptionPrice={onUpdateSelectOptionPrice}
                                        onMinChange={onMinChange}
                                        onMaxChange={onMaxChange}
                                        onPriceChange={onPriceChange}
                                        onValueChange={onValueChange}
                                    />
                                </div>
                            )}

                            {field.type !== 'info' && (
                                <div className="stachesepl-custom-fields-group">
                                    <div className="stachesepl-custom-fields-toggles">
                                        {field.type !== 'meta' && (
                                            <FieldToggle
                                                checked={!!field.required}
                                                onChange={() => onRequiredToggle(index)}
                                                label={__('FIELD_REQUIRED')}
                                            />
                                        )}

                                        <FieldToggle
                                            checked={!!field.visible}
                                            onChange={() => onVisibleToggle(index)}
                                            label={__('CUSTOM_FIELD_VISIBLE')}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'advanced' && allFields.length > 1 && field.type !== 'meta' && (
                        <div className="stachesepl-custom-fields-tab-content">
                            <div className="stachesepl-custom-fields-group">
                                <DisplayConditions
                                    field={field}
                                    fieldIndex={index}
                                    allFields={allFields}
                                    conditions={field.displayConditions || []}
                                    onAddCondition={onAddDisplayCondition}
                                    onRemoveCondition={onRemoveDisplayCondition}
                                    onUpdateCondition={onUpdateDisplayCondition}
                                />

                                {field.type !== 'info' && (
                                    <MutualExclusivity
                                        field={field}
                                        fieldIndex={index}
                                        allFields={allFields}
                                        exclusiveFieldUids={field.mutuallyExclusiveWith || []}
                                        onAddExclusiveField={onAddMutuallyExclusiveField}
                                        onRemoveExclusiveField={onRemoveMutuallyExclusiveField}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};

export default FieldItem;

