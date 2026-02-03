import { fieldsData } from '../../types';
import CheckboxFieldInputs from './components/CheckboxFieldInputs';
import TextFieldInputs from './components/TextFieldInputs';
import NumberFieldInputs from './components/NumberFieldInputs';
import SelectFieldInputs from './components/SelectFieldInputs';
import MetaFieldInputs from './components/MetaFieldInputs';
import InfoFieldInputs from './components/InfoFieldInputs';

interface FieldTypeSpecificInputsProps {
    field: fieldsData;
    index: number;
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
}

const FieldTypeSpecificInputs = ({
    field,
    index,
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
}: FieldTypeSpecificInputsProps) => {
    if (field.type === 'checkbox') {
        return (
            <CheckboxFieldInputs
                field={field}
                index={index}
                onCheckedValueChange={onCheckedValueChange}
                onPriceChange={onPriceChange}
            />
        );
    }

    if (field.type === 'text' || field.type === 'textarea') {
        return (
            <TextFieldInputs
                field={field}
                index={index}
                onPlaceholderChange={onPlaceholderChange}
            />
        );
    }

    if (field.type === 'number') {
        return (
            <NumberFieldInputs
                field={field}
                index={index}
                onPlaceholderChange={onPlaceholderChange}
                onMinChange={onMinChange}
                onMaxChange={onMaxChange}
                onPriceChange={onPriceChange}
            />
        );
    }

    if (field.type === 'select') {
        return (
            <SelectFieldInputs
                field={field}
                index={index}
                onAddSelectOption={onAddSelectOption}
                onRemoveSelectOption={onRemoveSelectOption}
                onUpdateSelectOptionLabel={onUpdateSelectOptionLabel}
                onUpdateSelectOptionPrice={onUpdateSelectOptionPrice}
            />
        );
    }

    if (field.type === 'meta') {
        return (
            <MetaFieldInputs
                field={field}
                index={index}
                onValueChange={onValueChange}
            />
        );
    }

    if (field.type === 'info') {
        return (
            <InfoFieldInputs
                field={field}
                index={index}
            />
        );
    }

    return null;
};

export default FieldTypeSpecificInputs;

