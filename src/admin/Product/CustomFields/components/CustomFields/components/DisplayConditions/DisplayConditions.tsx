import { Close as Delete } from '@mui/icons-material';
import { __ } from '@src/utils';
import { fieldsData, DisplayCondition, CustomFieldType, NumberConditionOperator } from '../../types';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import './DisplayConditions.scss';

interface DisplayConditionsProps {
    field: fieldsData;
    fieldIndex: number;
    allFields: fieldsData[];
    conditions: DisplayCondition[];
    onAddCondition: (fieldIndex: number) => void;
    onRemoveCondition: (fieldIndex: number, conditionIndex: number) => void;
    onUpdateCondition: (fieldIndex: number, conditionIndex: number, condition: DisplayCondition) => void;
}

const DisplayConditions = ({
    field,
    fieldIndex,
    allFields,
    conditions,
    onAddCondition,
    onRemoveCondition,
    onUpdateCondition,
}: DisplayConditionsProps) => {
    // Get available fields for condition selection (exclude current field, meta fields, and info fields)
    // Info fields can't be used as condition targets since they have no values
    const availableFields = allFields
        .filter(f => f.uid !== field.uid && f.type !== 'meta' && f.type !== 'info');

    const getFieldByUid = (uid: string): fieldsData | undefined => {
        return allFields.find(f => f.uid === uid);
    };

    const getFieldType = (uid: string): CustomFieldType | null => {
        const targetField = getFieldByUid(uid);
        return targetField ? targetField.type : null;
    };

    const renderConditionInputs = (condition: DisplayCondition, conditionIndex: number) => {
        const targetFieldType = getFieldType(condition.fieldUid);
        const targetField = getFieldByUid(condition.fieldUid);

        if (!targetFieldType || !targetField) {
            return null;
        }

        switch (targetFieldType) {
            case 'checkbox': {
                const checkboxCondition = condition as Extract<DisplayCondition, { checked?: boolean }>;
                return (
                    <label>
                        <span>{__('CONDITION_CRITERIA')}</span>
                        <select
                            value={checkboxCondition.checked ? 'checked' : 'not-checked'}
                            onChange={(e) => {
                                const newCondition: DisplayCondition = {
                                    fieldUid: condition.fieldUid,
                                    checked: e.target.value === 'checked',
                                };
                                onUpdateCondition(fieldIndex, conditionIndex, newCondition);
                            }}
                        >
                            <option value="checked">{__('CHECKED')}</option>
                            <option value="not-checked">{__('NOT_CHECKED')}</option>
                        </select>
                    </label>
                );
            }

            case 'select': {
                const selectCondition = condition as Extract<DisplayCondition, { selectedValues?: string[] }>;
                const selectField = targetField as Extract<fieldsData, { type: 'select' }>;
                const options = selectField.options || [];
                const selectedValues = selectCondition.selectedValues || [];

                return (
                    <label>
                        <span>{__('CONDITION_CRITERIA')}</span>
                        <select
                            multiple
                            value={selectedValues}
                            onChange={(e) => {
                                const newSelectedValues = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                                const newCondition: DisplayCondition = {
                                    fieldUid: condition.fieldUid,
                                    selectedValues: newSelectedValues,
                                };
                                onUpdateCondition(fieldIndex, conditionIndex, newCondition);
                            }}
                            style={{ minHeight: '100px' }}
                        >
                            {options.map((option: { label: string; price?: number }, optIdx: number) => (
                                <option key={optIdx} value={option.label}>
                                    {option.label || `Option ${optIdx + 1}`}
                                </option>
                            ))}
                        </select>
                        <small style={{ marginTop: '5px', display: 'block', color: '#50575e' }}>
                            {__('HOLD_CTRL_TO_SELECT_MULTIPLE')}
                        </small>
                    </label>
                );
            }

            case 'text':
            case 'textarea': {
                const textCondition = condition as Extract<DisplayCondition, { filled?: boolean }>;
                return (
                    <label>
                        <span>{__('CONDITION_CRITERIA')}</span>
                        <select
                            value={textCondition.filled ? 'filled' : 'not-filled'}
                            onChange={(e) => {
                                const newCondition: DisplayCondition = {
                                    fieldUid: condition.fieldUid,
                                    filled: e.target.value === 'filled',
                                };
                                onUpdateCondition(fieldIndex, conditionIndex, newCondition);
                            }}
                        >
                            <option value="filled">{__('FILLED')}</option>
                            <option value="not-filled">{__('NOT_FILLED')}</option>
                        </select>
                    </label>
                );
            }

            case 'number': {
                const numberCondition = condition as Extract<DisplayCondition, { operator?: NumberConditionOperator; value?: number }>;
                return (
                    <>
                        <label>
                            <span>{__('CONDITION_OPERATOR')}</span>
                            <select
                                value={numberCondition.operator || 'eq'}
                                onChange={(e) => {
                                    const numberCondition = condition as Extract<DisplayCondition, { operator?: NumberConditionOperator; value?: number }>;
                                    const newCondition: DisplayCondition = {
                                        fieldUid: condition.fieldUid,
                                        operator: e.target.value as NumberConditionOperator,
                                        value: numberCondition.value,
                                    };
                                    onUpdateCondition(fieldIndex, conditionIndex, newCondition);
                                }}
                            >
                                <option value="eq">{__('EQUALS')} (=)</option>
                                <option value="neq">{__('NOT_EQUALS')} (≠)</option>
                                <option value="gt">{__('GREATER_THAN')} (&gt;)</option>
                                <option value="lt">{__('LESS_THAN')} (&lt;)</option>
                            </select>
                        </label>
                        <label>
                            <span>{__('CONDITION_VALUE')}</span>
                            <input
                                type="number"
                                value={numberCondition.value ?? ''}
                                onChange={(e) => {
                                    const numberCondition = condition as Extract<DisplayCondition, { operator?: NumberConditionOperator; value?: number }>;
                                    const newCondition: DisplayCondition = {
                                        fieldUid: condition.fieldUid,
                                        operator: numberCondition.operator || 'eq',
                                        value: e.target.value === '' ? 0 : Number(e.target.value),
                                    };
                                    onUpdateCondition(fieldIndex, conditionIndex, newCondition);
                                }}
                                placeholder={__('ENTER_VALUE')}
                            />
                        </label>
                    </>
                );
            }

            default:
                return null;
        }
    };

    if (availableFields.length === 0) {
        return null;
    }

    return (
        <div className="stachesepl-seat-planner-custom-fields-display-conditions">
            <div className="stachesepl-seat-planner-custom-fields-display-conditions-header">
                <div className="stachesepl-seat-planner-custom-fields-display-conditions-title">
                    <span>{__('DISPLAY_CONDITIONS')}</span>
                    <p className="stachesepl-seat-planner-custom-fields-display-conditions-description">
                        {__('DISPLAY_CONDITIONS_DESC')}
                    </p>
                </div>
                <Button onClick={() => onAddCondition(fieldIndex)}>
                    {__('ADD_CONDITION')}
                </Button>
            </div>
            {conditions.length === 0 ? (
                <p className="stachesepl-seat-planner-custom-fields-no-conditions">
                    {__('NO_CONDITIONS_ADDED')}
                </p>
            ) : (
                <div className="stachesepl-seat-planner-custom-fields-conditions-list">
                    {conditions.map((condition, conditionIndex) => {
                        const targetField = getFieldByUid(condition.fieldUid);
                        const targetFieldLabel = targetField?.label || __('UNKNOWN_FIELD');

                        return (
                            <div
                                key={conditionIndex}
                                className="stachesepl-seat-planner-custom-fields-condition-item"
                            >
                                <div className="stachesepl-seat-planner-custom-fields-condition-content">
                                    <label>
                                        <span>{__('SELECT_FIELD')}</span>
                                        <select
                                            value={condition.fieldUid}
                                            onChange={(e) => {
                                                const newFieldUid = e.target.value;
                                                const newFieldType = getFieldType(newFieldUid);
                                                
                                                if (!newFieldType) {
                                                    return;
                                                }
                                                
                                                // Create new condition based on the selected field type
                                                // Don't spread old condition to avoid mixing condition types
                                                let newCondition: DisplayCondition;
                                                
                                                if (newFieldType === 'checkbox') {
                                                    newCondition = {
                                                        fieldUid: newFieldUid,
                                                        checked: true,
                                                    };
                                                } else if (newFieldType === 'select') {
                                                    newCondition = {
                                                        fieldUid: newFieldUid,
                                                        selectedValues: [],
                                                    };
                                                } else if (newFieldType === 'text' || newFieldType === 'textarea') {
                                                    newCondition = {
                                                        fieldUid: newFieldUid,
                                                        filled: true,
                                                    };
                                                } else if (newFieldType === 'number') {
                                                    newCondition = {
                                                        fieldUid: newFieldUid,
                                                        operator: 'eq',
                                                        value: 0,
                                                    };
                                                } else {
                                                    return; // Should not happen
                                                }
                                                
                                                onUpdateCondition(fieldIndex, conditionIndex, newCondition);
                                            }}
                                        >
                                            {availableFields.map((f) => (
                                                <option key={f.uid} value={f.uid}>
                                                    {f.label || __('FIELD_NAME_BLANK')}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    {renderConditionInputs(condition, conditionIndex)}
                                </div>
                                <Delete
                                    className='stachesepl-seat-planner-custom-fields-delete'
                                    onClick={() => onRemoveCondition(fieldIndex, conditionIndex)}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DisplayConditions;
