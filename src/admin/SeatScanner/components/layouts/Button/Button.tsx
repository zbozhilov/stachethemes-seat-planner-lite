import React from 'react'
import './Button.scss'

const Button = (props: {
    onClick?: () => void
    children: React.ReactNode
}) => {
    return (
        <button type="button" className='stachesepl-button' onClick={props.onClick}>{
            props.children
        }</button>
    )
}

export default Button