import type { StatCard as StatCardType } from './types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

type StatCardProps = {
    stat: StatCardType
    loading: boolean
}

const StatCard = ({ stat, loading }: StatCardProps) => {

    if (loading) {
        return (
            <Skeleton 
                width={'100%'} 
                height={90} 
                baseColor="var(--stachesepl-bg-muted)"
                highlightColor="var(--stachesepl-bg-page)"
                style={{
                    borderRadius: 'var(--stachesepl-radius-lg)',
                }} 
            />
        )
    }

    return (
        <div className={`stachesepl-overview-stat-card stachesepl-overview-stat-card--${stat.color}`}>
            <div className="stachesepl-overview-stat-card-icon">
                {stat.icon}
            </div>
            <div className="stachesepl-overview-stat-card-content">
                {stat.isHtml ? (
                    <span
                        className="stachesepl-overview-stat-card-value"
                        dangerouslySetInnerHTML={{ __html: stat.value as string }}
                    />
                ) : (
                    <span className="stachesepl-overview-stat-card-value">{stat.value}</span>
                )}
                <span className="stachesepl-overview-stat-card-label">{stat.label}</span>
            </div>
        </div>
    )
}

export default StatCard
