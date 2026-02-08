import React, { useState, useId } from 'react'
import './Input.scss'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    description?: string
    error?: string
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    fullWidth?: boolean
    showClear?: boolean
    onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
        label,
        description,
        error,
        prefix,
        suffix,
        fullWidth,
        showClear,
        onClear,
        className,
        value,
        defaultValue,
        onChange,
        disabled,
        ...inputProps
    } = props

    const generatedId = useId();
    const inputId = props.id || generatedId;

    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue !== '' && currentValue !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        'stachesepl-input-wrapper',
        error && 'stachesepl-input-wrapper--error',
        fullWidth && 'stachesepl-input-wrapper--full-width',
        disabled && 'stachesepl-input-wrapper--disabled'
    ].filter(Boolean).join(' ');

    const inputContainerClasses = [
        'stachesepl-input-container',
        prefix && 'stachesepl-input-container--has-prefix',
        (suffix || showClear) && 'stachesepl-input-container--has-suffix'
    ].filter(Boolean).join(' ');

    const inputClasses = [
        'stachesepl-input',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {label && (
                <label className="stachesepl-input-label" htmlFor={inputId}>
                    {label}
                </label>
            )}
            {description && (
                <span className="stachesepl-input-description">
                    {description}
                </span>
            )}
            <div className={inputContainerClasses}>
                {prefix && (
                    <span className="stachesepl-input-prefix">
                        {prefix}
                    </span>
                )}
                <div className='stachesepl-input-container-inner'>
                    <input
                        ref={ref}
                        id={inputId}
                        type="text"
                        className={inputClasses}
                        value={currentValue}
                        onChange={handleChange}
                        disabled={disabled}
                        autoComplete="off"
                        {...inputProps}
                    />
                    {showClear && hasValue && !disabled && (
                        <button
                            type="button"
                            className="stachesepl-input-clear"
                            onClick={handleClear}
                            tabIndex={-1}
                            aria-label="Clear input"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>
                {suffix && (
                    <span className="stachesepl-input-suffix">
                        {suffix}
                    </span>
                )}
            </div>
            {error && (
                <span className="stachesepl-input-error" role="alert">
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

Input.displayName = 'Input';

export default Input;
