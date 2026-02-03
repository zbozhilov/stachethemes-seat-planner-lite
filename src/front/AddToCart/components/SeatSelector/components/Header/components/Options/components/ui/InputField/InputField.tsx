import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import './InputField.scss';
import FieldLabel from '../FieldLabel/FieldLabel';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';

export type InputFieldProps = {
    id?: string;
    value: string;
    onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    helperText?: ReactNode;
    error?: boolean;
    errorMessage?: string;
    name?: string;
    type?: InputHTMLAttributes<HTMLInputElement>['type'];
    className?: string;
};

const InputField = ({
    id,
    value,
    onChange,
    label,
    description,
    placeholder,
    required,
    type = 'text',
    className,
    error,
    errorMessage,
}: InputFieldProps) => {

    const rootClassName = [
        'stachesepl-input-field',
        required ? 'stachesepl-input-field-required' : '',
        error ? 'stachesepl-input-field-error' : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    const displayErrorMessage = error && errorMessage ? errorMessage : '';

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value, event);
    };

    return (
        <div className={rootClassName}>
            {label && (
                <FieldLabel
                    label={label}
                    description={description}
                    required={required || false}
                />
            )}
            <input
                className="stachesepl-input-field-input"
                type={type}
                id={id}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
            />
            {displayErrorMessage && (
               <FieldErrorMessage message={displayErrorMessage} />
            )}
        </div>
    );
};

export default InputField;


