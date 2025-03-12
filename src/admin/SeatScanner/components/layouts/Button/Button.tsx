import React from 'react'
import './Button.scss'

const Button = (props: {
    onClick?: () => void
    children: React.ReactNode
}) => {
    return (
        <button type="button" className='stsp-button' onClick={props.onClick}>{
            props.children
        }</button>
    )
}

export default Button