import React from 'react'
import './Button.scss'

const Button = (props: {
    className?: string
    onClick: () => void
    disabled?: boolean
    children: React.ReactNode
}) => {

    const handleClick = () => {
        if (props.disabled) {
            return;
        }
        props.onClick();
    }

    const classNameArray = ['stachesepl-admin-button'];
    if (props.disabled) {
        classNameArray.push('stachesepl-admin-button-disabled');
    }

    if (props.className) {
        classNameArray.push(props.className);
    }

    return (
        <div className={classNameArray.join(' ')} onClick={handleClick}>
            {props.children}
        </div>
    )
}

export default Button

