import React from 'react'
import './Button.scss'

const Button = (props: {
    onClick: () => void
    children: React.ReactNode
}) => {
    return (
        <div className='stachesepl-discount-page-button' onClick={props.onClick}>
            {props.children}
        </div>
    )
}

export default Button