import { Close as Delete } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useState } from 'react';
import { fieldsData } from '../../types';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import './MutualExclusivity.scss';

interface MutualExclusivityProps {
    field: fieldsData;
    fieldIndex: number;
    allFields: fieldsData[];
    exclusiveFieldUids: string[];
    onAddExclusiveField: (fieldIndex: number, exclusiveFieldUid: string) => void;
    onRemoveExclusiveField: (fieldIndex: number, exclusiveFieldUid: string) => void;
}

const MutualExclusivity = ({
    field,
    fieldIndex,
    allFields,
    exclusiveFieldUids,
    onAddExclusiveField,
    onRemoveExclusiveField,
}: MutualExclusivityProps) => {
    const [selectedFieldUid, setSelectedFieldUid] = useState<string>('');

    // Get available fields for mutual exclusivity (exclude current field and meta fields)
    const availableFields = allFields
        .filter(f => f.uid !== field.uid && f.type !== 'meta');

    // Filter out fields that are already in the exclusive list
    const availableFieldsToAdd = availableFields.filter(
        f => !exclusiveFieldUids.includes(f.uid)
    );

    const handleAddField = () => {
        if (selectedFieldUid && availableFieldsToAdd.some(f => f.uid === selectedFieldUid)) {
            onAddExclusiveField(fieldIndex, selectedFieldUid);
            setSelectedFieldUid('');
        }
    };

    if (availableFields.length === 0) {
        return null;
    }

    return (
        <div className="stachesepl-seat-planner-custom-fields-mutual-exclusivity">
            <div className="stachesepl-seat-planner-custom-fields-mutual-exclusivity-header">
                <div className="stachesepl-seat-planner-custom-fields-mutual-exclusivity-title">
                    <span>{__('MUTUAL_EXCLUSIVITY')}</span>
                    <p className="stachesepl-seat-planner-custom-fields-mutual-exclusivity-description">
                        {__('MUTUAL_EXCLUSIVITY_DESC')}
                    </p>
                </div>
            </div>
            {availableFieldsToAdd.length > 0 && (
                <div className="stachesepl-seat-planner-custom-fields-mutual-exclusivity-add">
                    <label>
                        <span>{__('SELECT_FIELD')}</span>
                        <select
                            value={selectedFieldUid}
                            onChange={(e) => setSelectedFieldUid(e.target.value)}
                        >
                            <option value="">{__('SELECT_FIELD_TO_ADD')}</option>
                            {availableFieldsToAdd.map((f) => (
                                <option key={f.uid} value={f.uid}>
                                    {f.label || __('FIELD_NAME_BLANK')}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Button 
                        onClick={handleAddField}
                        disabled={!selectedFieldUid}
                    >
                        {__('ADD_EXCLUSIVE_FIELD')}
                    </Button>
                </div>
            )}
            {exclusiveFieldUids.length === 0 ? (
                <p className="stachesepl-seat-planner-custom-fields-no-exclusive-fields">
                    {__('NO_EXCLUSIVE_FIELDS_ADDED')}
                </p>
            ) : (
                <div className="stachesepl-seat-planner-custom-fields-exclusive-fields-list">
                    {exclusiveFieldUids.map((exclusiveFieldUid) => {
                        const exclusiveField = allFields.find(f => f.uid === exclusiveFieldUid);
                        const exclusiveFieldLabel = exclusiveField?.label || __('UNKNOWN_FIELD');

                        return (
                            <div
                                key={exclusiveFieldUid}
                                className="stachesepl-seat-planner-custom-fields-exclusive-field-item"
                            >
                                <div className="stachesepl-seat-planner-custom-fields-exclusive-field-content">
                                    <span className="stachesepl-seat-planner-custom-fields-exclusive-field-label">
                                        {exclusiveFieldLabel}
                                    </span>
                                </div>
                                <Delete
                                    className='stachesepl-seat-planner-custom-fields-delete'
                                    onClick={() => onRemoveExclusiveField(fieldIndex, exclusiveFieldUid)}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MutualExclusivity;
