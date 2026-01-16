import React from 'react'
import './InfoBox.scss'

type InfoBoxProps = {
    icon: React.ReactNode
    title: string
    description: string
    className?: string
}

const InfoBox = (props: InfoBoxProps) => {
    const className = props.className 
        ? `stachesepl-info-box ${props.className}` 
        : 'stachesepl-info-box'
    
    return (
        <div className={className}>
            {props.icon}
            <div>
                <h3 className="stachesepl-info-box-title">{props.title}</h3>
                <p className="stachesepl-info-box-description">{props.description}</p>
            </div>
        </div>
    )
}

export default InfoBox
