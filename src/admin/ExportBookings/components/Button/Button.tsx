import React from 'react'
import './Button.scss'

const Button = (props: {
    onClick: () => void
    disabled?: boolean
    children: React.ReactNode
}) => {

    const handleClick = () => {

        if (!props.disabled) {
            props.onClick()
        }

    }
    
    const classNameArray = ['stachesepl-export-bookings-button'];

    if (props.disabled) {
        classNameArray.push('disabled');
    }

    return (
        <div className={classNameArray.join(' ')} onClick={handleClick}>
            {props.children}
        </div>
    )
}

export default Button