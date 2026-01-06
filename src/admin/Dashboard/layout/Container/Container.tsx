import React from 'react'
import './Container.scss'

type ContainerProps = {
    title?: string
    children: React.ReactNode
    className?: string
}

const Container = (props: ContainerProps) => {
    const className = props.className 
        ? `stachesepl-container ${props.className}` 
        : 'stachesepl-container'
    
    return (
        <div className={className}>
            {props.title && <h2 className="stachesepl-container-title">{props.title}</h2>}
            {props.children}
        </div>
    )
}

export default Container
