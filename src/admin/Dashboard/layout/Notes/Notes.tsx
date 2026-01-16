import React from 'react'
import './Notes.scss'

type NotesProps = {
    title: string
    children: React.ReactNode
    className?: string
}

const Notes = (props: NotesProps) => {
    const className = props.className 
        ? `stachesepl-notes ${props.className}` 
        : 'stachesepl-notes'
    
    return (
        <div className={className}>
            <h4>{props.title}</h4>
            <ul>
                {props.children}
            </ul>
        </div>
    )
}

export default Notes
