import React from 'react'
import './Select.scss'

type SelectOption = {
    value: string | number
    label: string
    disabled?: boolean
}

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
    label?: string
    description?: string
    error?: string
    options: SelectOption[]
    placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
    const { label, description, error, options, placeholder, className, disabled, ...selectProps } = props;
    const selectClassName = className 
        ? `stachesepl-select ${className}` 
        : 'stachesepl-select';
    
    const wrapperClasses = [
        'stachesepl-select-wrapper',
        error && 'stachesepl-select-wrapper--error',
        disabled && 'stachesepl-select-wrapper--disabled'
    ].filter(Boolean).join(' ');
    
    return (
        <div className={wrapperClasses}>
            {label && (
                <label className="stachesepl-select-label">
                    {label}
                </label>
            )}
            {description && (
                <p className="stachesepl-select-description">
                    {description}
                </p>
            )}
            <div className="stachesepl-select-container">
                <select
                    ref={ref}
                    className={selectClassName}
                    disabled={disabled}
                    {...selectProps}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <span className="stachesepl-select-error" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                </span>
            )}
        </div>
    )
})

Select.displayName = 'Select'

export default Select
