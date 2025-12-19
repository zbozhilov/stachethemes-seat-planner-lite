import React from 'react'
import './PageHeader.scss'

type PageHeaderProps = {
    title: string
    description?: string
    actions?: React.ReactNode
}

const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
    return (
        <div className="stachesepl-page-header">
            <div className="stachesepl-page-header-content">
                <h1 className="stachesepl-page-header-title">{title}</h1>
                {description && (
                    <p className="stachesepl-page-header-description">{description}</p>
                )}
            </div>
            {actions && (
                <div className="stachesepl-page-header-actions">
                    {actions}
                </div>
            )}
        </div>
    )
}

export default PageHeader
