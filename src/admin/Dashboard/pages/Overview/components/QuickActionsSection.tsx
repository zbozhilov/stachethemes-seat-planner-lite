import { __ } from '@src/utils'
import { QrCodeScanner, Build, Settings, ShoppingBag } from '@mui/icons-material'
import ActionCard from './ActionCard'
import type { QuickAction } from './types'

const getQuickActions = (): QuickAction[] => {
    const adminUrl = window.stachesepl_admin_url.admin_url

    return [
        {
            id: 'scanner',
            icon: <QrCodeScanner />,
            title: __('OVERVIEW_ACTION_SCANNER'),
            description: __('OVERVIEW_ACTION_SCANNER_DESC'),
            href: '#scanner',
        },
        {
            id: 'tools',
            icon: <Build />,
            title: __('OVERVIEW_ACTION_TOOLS'),
            description: __('OVERVIEW_ACTION_TOOLS_DESC'),
            href: '#tools',
        },
        {
            id: 'settings',
            icon: <Settings />,
            title: __('OVERVIEW_ACTION_SETTINGS'),
            description: __('OVERVIEW_ACTION_SETTINGS_DESC'),
            href: '#settings',
        },
        {
            id: 'orders',
            icon: <ShoppingBag />,
            title: __('OVERVIEW_ACTION_ORDERS'),
            description: __('OVERVIEW_ACTION_ORDERS_DESC'),
            href: `${adminUrl}edit.php?post_type=shop_order`,
            external: true,
        },
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
