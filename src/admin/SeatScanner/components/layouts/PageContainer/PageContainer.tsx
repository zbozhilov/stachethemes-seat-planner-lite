import React from 'react'
import './PageContainer.scss'

const PageContainer = (props: {
    children: React.ReactNode
}) => {
    return (
        <div className='stachesepl-page-container'>
            {props.children}
        </div>
    )
}

export default PageContainer