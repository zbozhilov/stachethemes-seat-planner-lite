import { useCustomFields as useCustomFieldsContext } from '@src/front/AddToCart/components/context/hooks';
import { FrontCustomFieldData } from '@src/front/AddToCart/types';
import { __, getFormattedPrice } from '@src/utils';
import CheckboxField from '../ui/CheckboxField/CheckboxField';
import FieldLabel from '../ui/FieldLabel/FieldLabel';
import InputField from '../ui/InputField/InputField';
import NumberStepperField from '../ui/NumberStepperField/NumberStepperField';
import SelectField, { SelectFieldOption } from '../ui/SelectField/SelectField';
import TextareaField from '../ui/TextareaField/TextareaField';
import './CustomFields.scss';
import { useCustomFieldsHook } from './hooks';

const CustomFields = (props: {
    seatId: string;
    validationErrors?: { [fieldUid: string]: boolean };
    onFieldChange?: () => void;
}) => {

    const { hasCustomFields } = useCustomFieldsContext();
    const { customFields, handleFieldChange, getFieldValue, customFieldsValues } = useCustomFieldsHook({ seatId: props.seatId });

    if (!hasCustomFields) {
        return null;
    }

    const renderField = (field: FrontCustomFieldData, index: number) => {

        const inputId = `stachesepl-custom-field-${props.seatId}-${index}`;
        const isRequired = !!field.required;
        const currentValue = getFieldValue(field);
        const hasError = props.validationErrors?.[field.uid] === true;
        const errorMessage = hasError && isRequired ? __('FIELD_REQUIRED') : undefined;

        const handleChange = (value: string | number | boolean) => {
            handleFieldChange(field.uid, value);
            if (props.onFieldChange) {
                props.onFieldChange();
            }
        };

        switch (field.type) {

            case 'checkbox': {
                // Get the raw stored value to determine checked state
                const rawValue = customFieldsValues[field.uid];

                // Determine if checkbox is checked based on raw value
                // If checkedValue is set, check if rawValue matches it
                // Otherwise, check if rawValue is 'yes' or true
                const hasCheckedValue = field.checkedValue && field.checkedValue.trim() !== '';
                const isChecked = hasCheckedValue
                    ? rawValue === field.checkedValue
                    : rawValue === 'yes' || rawValue === true;

                const checkedValue = isChecked ? 'yes' : 'no';

                return (
                    <CheckboxField
                        label={field.label}
                        description={field.description}
                        required={isRequired}
                        checked={checkedValue}
                        checkedValue={field.checkedValue}
                        price={field.price}
                        onChange={(value) => handleChange(value)}
                        error={hasError}
                        errorMessage={errorMessage}
                    />
                );
            }

            case 'select': {

                const selectOptions: SelectFieldOption[] = (field.options || []).map((option) => ({
                    value: option.label,
                    label: option.label,
                    ...(option.price !== undefined && option.price !== null ? {
                        badge: option.price > 0 ? `+${getFormattedPrice(option.price)}` : `-${getFormattedPrice(option.price)}`
                    } : {}),
                }));

                const currentStringValue = String(currentValue);
                const currentSelectValue = currentStringValue === '' ? null : currentStringValue;

                return (
                    <>
                        <FieldLabel label={field.label} description={field.description} required={isRequired} />
                        <SelectField
                            value={currentSelectValue}
                            onChange={(value) => handleChange(value ?? '')}
                            options={selectOptions}
                            placeholder={__('NO_SELECTION')}
                            allowClear={!isRequired}
                            error={hasError}
                            errorMessage={errorMessage}
                        />
                    </>
                );
            }

            case 'textarea': {

                return (
                    <TextareaField
                        value={String(currentValue)}
                        onChange={(value) => handleChange(value)}
                        label={field.label}
                        description={field.description}
                        required={isRequired}
                        placeholder={field.placeholder || ''}
                        error={hasError}
                        errorMessage={errorMessage}
                    />
                )
            }

            case 'number': {
                const currentStringValue = String(currentValue);
                const trimmed = currentStringValue.trim();
                const parsed = trimmed === '' ? null : Number(trimmed);
                const numericValue = parsed !== null && Number.isFinite(parsed) ? parsed : null;
                const unitPrice = field.price;
                const showPriceBadge =
                    unitPrice !== undefined &&
                    unitPrice !== null &&
                    numericValue !== null &&
                    numericValue > 0;

                return (
                    <NumberStepperField
                        id={inputId}
                        value={numericValue}
                        onChange={(val) => handleChange(val ?? '')}
                        label={field.label}
                        description={field.description}
                        required={isRequired}
                        min={field.min}
                        max={field.max}
                        priceBadge={showPriceBadge ? `+${getFormattedPrice(unitPrice * numericValue)}` : undefined}
                        error={hasError}
                        errorMessage={errorMessage}
                    />
                );
            }

            case 'info': {
                // Info fields are display-only, showing just label and description
                return (
                    <FieldLabel 
                        label={field.label} 
                        description={field.description} 
                        required={false} 
                    />
                );
            }

            default: {
                return <InputField
                    id={inputId}
                    value={String(currentValue)}
                    onChange={(value) => handleChange(value)}
                    label={field.label}
                    description={field.description}
                    required={isRequired}
                    placeholder={field.placeholder || ''}
                    error={hasError}
                    errorMessage={errorMessage}
                />
            }
        }


    };

    return (
        <div className='stachesepl-options-container-custom-fields'>
            {customFields.map((field, index) => (
                <div
                    key={`custom-field-${props.seatId}-${index}`}
                    className='stachesepl-options-container-custom-field'
                >
                    {renderField(field, index)}
                </div>
            ))}
        </div>
    );
}

export default CustomFields;