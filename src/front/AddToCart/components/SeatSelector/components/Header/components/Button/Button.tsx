import React from 'react'
import './Button.scss';

const Button = (props: {
    className?: string,
    onClick?: () => void,
    children: React.ReactNode,
}) => {
    return (
        <button className={`stsp-seat-planner-header-button ${props.className || ''}`} onClick={props.onClick}>{props.children}</button>
    )
}

export default Button