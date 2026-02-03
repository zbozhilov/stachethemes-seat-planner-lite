import { __ } from '@src/utils';
import { CheckboxFieldData } from '../../../types';

interface CheckboxFieldInputsProps {
    field: CheckboxFieldData;
    index: number;
    onCheckedValueChange: (index: number, value: string) => void;
    onPriceChange: (index: number, value: string) => void;
}

const CheckboxFieldInputs = ({
    field,
    index,
    onCheckedValueChange,
    onPriceChange,
}: CheckboxFieldInputsProps) => {
    return (
        <>
            <label className="stachesepl-seat-planner-custom-fields-fw">
                <span>{__('CHECKBOX_CHECKED_VALUE')}</span>
                <input
                    type="text"
                    value={field.checkedValue ?? ''}
                    onChange={(e) => onCheckedValueChange(index, e.target.value)}
                    placeholder={__('CHECKBOX_CHECKED_VALUE')}
                />
            </label>
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

export default CheckboxFieldInputs;

