import React from 'react'
import './Toggle.scss'

type ToggleProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: string
    description?: string
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
    const { label, description, className, id, ...toggleProps } = props
    const toggleId = id ?? `toggle-${crypto.randomUUID()}`
    
    return (
        <div className="stachesepl-toggle-wrapper">
            <div className="stachesepl-toggle-header">
                <label className="stachesepl-toggle-control" htmlFor={toggleId}>
                    <input
                        ref={ref}
                        id={toggleId}
                        type="checkbox"
                        className="stachesepl-toggle-input"
                        {...toggleProps}
                    />
                    <span className="stachesepl-toggle-track">
                        <span className="stachesepl-toggle-thumb" />
                    </span>
                </label>
                {label && (
                    <label className="stachesepl-toggle-label" htmlFor={toggleId}>
                        {label}
                    </label>
                )}
            </div>
            {description && (
                <span className="stachesepl-toggle-description">
                    {description}
                </span>
            )}
        </div>
    )
})

Toggle.displayName = 'Toggle'

export default Toggle