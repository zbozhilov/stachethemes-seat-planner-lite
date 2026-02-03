import React, { useState, useId } from 'react'
import './Textarea.scss'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
    description?: string
    error?: string
    fullWidth?: boolean
    showClear?: boolean
    onClear?: () => void
    minHeight?: string
    maxHeight?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    const {
        label,
        description,
        error,
        fullWidth,
        showClear,
        onClear,
        minHeight,
        maxHeight,
        className,
        value,
        defaultValue,
        onChange,
        disabled,
        style,
        ...textareaProps
    } = props

    const generatedId = useId();
    const textareaId = props.id || generatedId;

    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue !== '' && currentValue !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (value === undefined) {
            setInternalValue(e.target.value);
        }
        onChange?.(e);
    }

    const handleClear = () => {
        if (value === undefined) {
            setInternalValue('');
        }
        onClear?.();
    }

    const wrapperClasses = [
        'stachesepl-textarea-wrapper',
        error && 'stachesepl-textarea-wrapper--error',
        fullWidth && 'stachesepl-textarea-wrapper--full-width',
        disabled && 'stachesepl-textarea-wrapper--disabled'
    ].filter(Boolean).join(' ');

    const textareaContainerClasses = [
        'stachesepl-textarea-container',
        showClear && hasValue && !disabled && 'stachesepl-textarea-container--has-clear'
    ].filter(Boolean).join(' ');

    const textareaClasses = [
        'stachesepl-textarea',
        className
    ].filter(Boolean).join(' ');

    const textareaStyle = {
        ...style,
        ...(minHeight && { minHeight }),
        ...(maxHeight && { maxHeight })
    };

    return (
        <div className={wrapperClasses}>
            {label && (
                <label className="stachesepl-textarea-label" htmlFor={textareaId}>
                    {label}
                </label>
            )}
            {description && (
                <span className="stachesepl-textarea-description">
                    {description}
                </span>
            )}
            <div className={textareaContainerClasses}>
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={textareaClasses}
                    value={currentValue}
                    onChange={handleChange}
                    disabled={disabled}
                    style={textareaStyle}
                    {...textareaProps}
                />
                {showClear && hasValue && !disabled && (
                    <button
                        type="button"
                        className="stachesepl-textarea-clear"
                        onClick={handleClear}
                        tabIndex={-1}
                        aria-label="Clear textarea"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                )}
            </div>
            {error && (
                <span className="stachesepl-textarea-error" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
})

Textarea.displayName = 'Textarea';

export default Textarea;
