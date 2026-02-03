import { __ } from '@src/utils';
import { NumberFieldData } from '../../../types';

interface NumberFieldInputsProps {
    field: NumberFieldData;
    index: number;
    onPlaceholderChange: (index: number, value: string) => void;
    onMinChange: (index: number, value: string) => void;
    onMaxChange: (index: number, value: string) => void;
    onPriceChange: (index: number, value: string) => void;
}

const NumberFieldInputs = ({
    field,
    index,
    onPlaceholderChange,
    onMinChange,
    onMaxChange,
    onPriceChange,
}: NumberFieldInputsProps) => {
    return (
        <>
            <label className="stachesepl-seat-planner-custom-fields-fw">
                <span>{__('FIELD_PLACEHOLDER')}</span>
                <input
                    type="text"
                    value={field.placeholder ?? ''}
                    onChange={(e) => onPlaceholderChange(index, e.target.value)}
                    placeholder={__('FIELD_PLACEHOLDER')}
                />
            </label>
            <div className="stachesepl-seat-planner-custom-fields-number-constraints">
                <label>
                    <span>{__('FIELD_MIN')}</span>
                    <input
                        type="number"
                        min="0"
                        value={field.min ?? 0}
                        onChange={(e) => {
                            const value = e.target.value;
                            const numValue = parseFloat(value);
                            // Ensure value is at least 0, or empty string if clearing the field
                            if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
                                onMinChange(index, value);
                            }
                        }}
                        placeholder={__('FIELD_MIN')}
                    />
                </label>
                <label>
                    <span>{__('FIELD_MAX')}</span>
                    <input
                        type="number"
                        value={field.max ?? ''}
                        onChange={(e) => onMaxChange(index, e.target.value)}
                        placeholder={__('FIELD_MAX')}
                    />
                </label>
            </div>
            <label className="stachesepl-seat-planner-custom-fields-fw">
                <span>{__('FIELD_PRICE')} ({__('OPTIONAL')})</span>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.price ?? ''}
                    onChange={(e) => onPriceChange(index, e.target.value)}
                    placeholder={__('FIELD_PRICE')}
                />
            </label>
        </>
    );
};

export default NumberFieldInputs;

