import { __ } from '@src/utils';
import { MetaFieldData } from '../../../types';

interface MetaFieldInputsProps {
    field: MetaFieldData;
    index: number;
    onValueChange: (index: number, value: string) => void;
}

const MetaFieldInputs = ({
    field,
    index,
    onValueChange,
}: MetaFieldInputsProps) => {
    return (
        <label className="stachesepl-seat-planner-custom-fields-fw">
            <span>{__('FIELD_VALUE')}</span>
            <input
                type="text"
                value={field.value ?? ''}
                onChange={(e) => onValueChange(index, e.target.value)}
                placeholder={__('FIELD_VALUE')}
            />
        </label>
    );
};

export default MetaFieldInputs;
