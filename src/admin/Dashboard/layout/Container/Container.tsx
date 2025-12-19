import React from 'react'
import './Container.scss'

type ContainerProps = {
    children: React.ReactNode
    className?: string
}

const Container = (props: ContainerProps) => {
    const className = props.className 
        ? `stachesepl-container ${props.className}` 
        : 'stachesepl-container'
    
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}

export default Container
