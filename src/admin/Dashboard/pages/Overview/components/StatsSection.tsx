import { __ } from '@src/utils'
import { useOverviewStats } from '../../../hooks/useOverviewStats'
import StatCard from './StatCard'
import type { StatCard as StatCardType } from './types'
import type { OverviewStats } from './types'
import AppsIcon from '@mui/icons-material/Apps'
import EventSeatIcon from '@mui/icons-material/EventSeat'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

const getStatCards = (stats: OverviewStats | null): StatCardType[] => {

    const iconFontSize = 24;

    return [
        {
            id: 'products',
            label: __('OVERVIEW_STAT_PRODUCTS'),
            value: stats?.total_products ?? '-',
            icon: <AppsIcon sx={{ fontSize: iconFontSize }} />,
            color: 'primary',
        },
        {
            id: 'orders',
            label: __('OVERVIEW_STAT_SEATS'),
            value: stats?.total_seats ?? '-',
            icon: <EventSeatIcon sx={{ fontSize: iconFontSize }} />,
            color: 'success',
        },
        {
            id: 'revenue',
            label: __('OVERVIEW_STAT_REVENUE'),
            value: stats?.total_revenue ?? '-',
            isHtml: true,
            icon: <AttachMoneyIcon  sx={{ fontSize: iconFontSize }} />,
            color: 'warning',
        }
    ]
}

const StatsSection = () => {
    const { stats, loading } = useOverviewStats()
    const statCards = getStatCards(stats)

    return (
        <section className="stachesepl-overview-section">
            <h2 className="stachesepl-overview-section-title">{__('OVERVIEW_STATS_TITLE')}</h2>
            <div className={`stachesepl-overview-stats`}>
                {statCards.map((stat) => (
                    <StatCard key={stat.id} stat={stat} loading={loading} />
                ))}
            </div>
        </section>
    )
}

export default StatsSection
