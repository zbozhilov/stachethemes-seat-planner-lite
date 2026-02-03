import { __ } from '@src/utils';
import { TextFieldData, TextareaFieldData } from '../../../types';

interface TextFieldInputsProps {
    field: TextFieldData | TextareaFieldData;
    index: number;
    onPlaceholderChange: (index: number, value: string) => void;
}

const TextFieldInputs = ({
    field,
    index,
    onPlaceholderChange,
}: TextFieldInputsProps) => {
    return (
        <label className="stachesepl-seat-planner-custom-fields-fw">
            <span>{__('FIELD_PLACEHOLDER')}</span>
            <input
                type="text"
                value={field.placeholder ?? ''}
                onChange={(e) => onPlaceholderChange(index, e.target.value)}
                placeholder={__('FIELD_PLACEHOLDER')}
            />
        </label>
    );
};

export default TextFieldInputs;

