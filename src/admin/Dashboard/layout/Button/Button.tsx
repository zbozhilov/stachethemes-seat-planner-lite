import React from 'react'
import './Button.scss'

type ButtonProps = {
    onClick?: () => void
    children: React.ReactNode
    variant?: 'primary' | 'secondary'
    disabled?: boolean
}

const Button = (props: ButtonProps) => {
    const { onClick, children, variant = 'primary', disabled = false } = props;

    const classNames = [
        'stachesepl-dashboard-button',
        `stachesepl-dashboard-button--${variant}`,
        disabled && 'stachesepl-dashboard-button--disabled'
    ].filter(Boolean).join(' ');
    
    return (
        <button 
            type="button" 
            className={classNames} 
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
