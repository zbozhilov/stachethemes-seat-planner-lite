import type { QuickAction } from './types'

type ActionCardProps = {
    action: QuickAction
}

const ActionCard = ({ action }: ActionCardProps) => {
    return (
        <a
            href={action.href}
            className="stachesepl-overview-action-card"
            {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
            <div className="stachesepl-overview-action-card-icon">
                {action.icon}
            </div>
            <div className="stachesepl-overview-action-card-content">
                <h3 className="stachesepl-overview-action-card-title">{action.title}</h3>
                <p className="stachesepl-overview-action-card-description">{action.description}</p>
            </div>
            <div className="stachesepl-overview-action-card-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        </a>
    )
}

export default ActionCard
