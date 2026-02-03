import type { ChangeEvent } from 'react';
import './TextareaField.scss';
import FieldLabel from '../FieldLabel/FieldLabel';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';

export type TextareaFieldProps = {
    value: string;
    onChange: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
    label: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    className?: string;
    error?: boolean;
    errorMessage?: string;
};

const TextareaField = ({
    value,
    onChange,
    label,
    description,
    placeholder,
    required,
    rows = 3,
    className,
    error,
    errorMessage,
}: TextareaFieldProps) => {

    const rootClassName = [
        'stachesepl-textarea-field',
        required ? 'stachesepl-textarea-field-required' : '',
        error ? 'stachesepl-textarea-field-error' : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value, event);
    };

    return (
        <div className={rootClassName}>

            <FieldLabel label={label} description={description} required={required || false} />

            <textarea
                className="stachesepl-textarea-field-textarea"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
            />
            {error && errorMessage && (
                <FieldErrorMessage message={errorMessage} />
            )}
        </div>
    );
};

export default TextareaField;


