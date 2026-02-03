import { getFormattedPrice } from '@src/utils';
import Badge from '../Badge/Badge';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';
import FieldLabel from '../FieldLabel/FieldLabel';
import './CheckboxField.scss';

export type CheckboxFieldProps = {
    checked: "yes" | "no";
    checkedValue?: string;
    description?: string;
    onChange: (value: string) => void;
    label: string;
    /**
     * Optional price that applies when the checkbox is checked.
     */
    price?: number;
    required?: boolean;
    className?: string;
    /**
     * Whether the field has an error.
     */
    error?: boolean;
    /**
     * Error message to display when error is true.
     */
    errorMessage?: string;
};

const CheckboxField = ({
    checked,
    checkedValue,
    onChange,
    label,
    price,
    required,
    className,
    description,
    error,
    errorMessage,
}: CheckboxFieldProps) => {

    const rootClassName = [
        'stachesepl-checkbox-field',
        required ? 'stachesepl-checkbox-field-required' : '',
        checked === 'yes' ? 'stachesepl-checkbox-field-checked' : '',
        error ? 'stachesepl-checkbox-field-error' : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    const handleChange = () => {
        // If checkedValue is set and not empty, use it when checked, empty string when unchecked
        // Otherwise, fallback to "yes"/"no"
        if (checkedValue && checkedValue.trim() !== '') {
            onChange(checked === 'yes' ? '' : checkedValue);
        } else {
            onChange(checked === 'yes' ? 'no' : 'yes');
        }
    };

    const showPriceBadge =
        checked === 'yes' &&
        price !== undefined &&
        price !== null;


    return (
        <div className={rootClassName}>
            <div className="stachesepl-checkbox-field-wrapper" onClick={handleChange}>
                <span
                    className="stachesepl-checkbox-field-box"
                    aria-hidden="true"
                />
                <FieldLabel
                    label={label}
                    required={required || false} />
                {showPriceBadge && (
                    <Badge
                        ariaHidden
                        tone="success"
                        html={`+${getFormattedPrice(price)}`}
                    />
                )}
                {description && <span className="stachesepl-option-description">
                    {description}
                </span>}
            </div>
            {error && errorMessage && (
                <FieldErrorMessage message={errorMessage} />
            )}
        </div>
    );
};

export default CheckboxField;


