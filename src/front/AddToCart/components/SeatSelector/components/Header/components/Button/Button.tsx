import React from 'react'
import './Button.scss';

const Button = React.forwardRef((props: {
    className?: string,
    onClick?: () => void,
    children: React.ReactNode
}, ref: React.ForwardedRef<HTMLButtonElement>) => {
    return (
        <button ref={ref as React.RefObject<HTMLButtonElement>} className={`stachesepl-seat-planner-header-button ${props.className || ''}`} onClick={props.onClick}>{props.children}</button>
    )
});

Button.displayName = 'Button';

export default Button