import { Build, CalendarMonth, QrCodeScanner, Settings } from '@mui/icons-material'
import { __ } from '@src/utils'
import ActionCard from './ActionCard'
import type { QuickAction } from './types'

const getQuickActions = (): QuickAction[] => {

    return [
        {
            id: 'scanner',
            icon: <QrCodeScanner />,
            title: __('OVERVIEW_ACTION_SCANNER'),
            description: __('OVERVIEW_ACTION_SCANNER_DESC'),
            href: '#scanner',
        },
        {
            id: 'manager',
            icon: <CalendarMonth />,
            title: __('OVERVIEW_ACTION_MANAGER'),
            description: __('OVERVIEW_ACTION_MANAGER_DESC'),
            href: '#manager',
        },
        {
            id: 'settings',
            icon: <Settings />,
            title: __('OVERVIEW_ACTION_SETTINGS'),
            description: __('OVERVIEW_ACTION_SETTINGS_DESC'),
            href: '#settings',
        },
        {
            id: 'tools',
            icon: <Build />,
            title: __('OVERVIEW_ACTION_TOOLS'),
            description: __('OVERVIEW_ACTION_TOOLS_DESC'),
            href: '#tools',
        }
    ]
}

const QuickActionsSection = () => {
    const quickActions = getQuickActions()

    return (
        <section className="stachesepl-overview-section">
            <h2 className="stachesepl-overview-section-title">{__('OVERVIEW_ACTIONS_TITLE')}</h2>
            <div className="stachesepl-overview-actions">
                {quickActions.map((action) => (
                    <ActionCard key={action.id} action={action} />
                ))}
            </div>
        </section>
    )
}

export default QuickActionsSection
