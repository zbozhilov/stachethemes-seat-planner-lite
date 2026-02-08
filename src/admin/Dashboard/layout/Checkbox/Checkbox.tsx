import React from 'react'
import './Checkbox.scss'

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: string
    description?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const { label, description, className, id, ...checkboxProps } = props
    const checkboxId = id ?? `stachesepl-checkbox-${crypto.randomUUID()}`

    return (
        <div className="stachesepl-checkbox-wrapper">
            <div className="stachesepl-checkbox-header">
                <label className="stachesepl-checkbox-control" htmlFor={checkboxId}>
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        className="stachesepl-checkbox-input"
                        {...checkboxProps}
                    />
                    <span className="stachesepl-checkbox-box">
                        <span className="stachesepl-checkbox-check" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </span>
                </label>
                {label && (
                    <label className="stachesepl-checkbox-label" htmlFor={checkboxId}>
                        {label}
                    </label>
                )}
            </div>
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
