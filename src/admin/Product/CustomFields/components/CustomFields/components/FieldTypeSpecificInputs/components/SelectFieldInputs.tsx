import { Close as Delete } from '@mui/icons-material';
import { __ } from '@src/utils';
import { SelectFieldData } from '../../../types';
import Button from '@src/admin/Product/CommonUI/Button/Button';

interface SelectFieldInputsProps {
    field: SelectFieldData;
    index: number;
    onAddSelectOption: (index: number) => void;
    onRemoveSelectOption: (index: number, optionIndex: number) => void;
    onUpdateSelectOptionLabel: (index: number, optionIndex: number, label: string) => void;
    onUpdateSelectOptionPrice: (index: number, optionIndex: number, price: string) => void;
}

const SelectFieldInputs = ({
    field,
    index,
    onAddSelectOption,
    onRemoveSelectOption,
    onUpdateSelectOptionLabel,
    onUpdateSelectOptionPrice,
}: SelectFieldInputsProps) => {
    
    const options = field.options || [];

    return (
        <div className="stachesepl-seat-planner-custom-fields-select-options">
            <div className="stachesepl-seat-planner-custom-fields-select-options-header">
                <span>{__('FIELD_OPTIONS')}</span>
                <Button onClick={() => onAddSelectOption(index)}>
                    {__('ADD_OPTION')}
                </Button>
            </div>
            {options.length === 0 ? (
                <p className="stachesepl-seat-planner-custom-fields-no-options">
                    {__('NO_OPTIONS_ADDED')}
                </p>
            ) : (
                <div className="stachesepl-seat-planner-custom-fields-options-list">
                    {options.map((option, optionIndex) => (
                        <div
                            key={optionIndex}
                            className="stachesepl-seat-planner-custom-fields-option-item"
                        >
                            <div className="stachesepl-seat-planner-custom-fields-option-inputs">
                                <label className="stachesepl-seat-planner-custom-fields-fw">
                                    <span>{__('OPTION_LABEL')}</span>
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) =>
                                            onUpdateSelectOptionLabel(index, optionIndex, e.target.value)
                                        }
                                        placeholder={__('OPTION_LABEL')}
                                    />
                                </label>
                                <label className="stachesepl-seat-planner-custom-fields-fw">
                                    <span>{__('FIELD_PRICE')} ({__('OPTIONAL')})</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={option.price ?? ''}
                                        onChange={(e) =>
                                            onUpdateSelectOptionPrice(index, optionIndex, e.target.value)
                                        }
                                        placeholder={__('FIELD_PRICE')}
                                    />
                                </label>
                            </div>
                            <Delete
                                className='stachesepl-seat-planner-custom-fields-delete'
                                onClick={() => onRemoveSelectOption(index, optionIndex)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectFieldInputs;

