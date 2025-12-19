import React from 'react'
import './Checkbox.scss'

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: string
    description?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const { label, description, className, ...checkboxProps } = props;
    const checkboxClassName = className 
        ? `stachesepl-checkbox ${className}` 
        : 'stachesepl-checkbox';
    
    return (
        <div className="stachesepl-checkbox-wrapper">
            <label className="stachesepl-checkbox-label">
                <input
                    ref={ref}
                    type="checkbox"
                    className={checkboxClassName}
                    {...checkboxProps}
                />
                {label && (
                    <span className="stachesepl-checkbox-label-text">
                        {label}
                    </span>
                )}
            </label>
            {description && (
                <span className="stachesepl-checkbox-description">
                    {description}
                </span>
            )}
        </div>
    )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
