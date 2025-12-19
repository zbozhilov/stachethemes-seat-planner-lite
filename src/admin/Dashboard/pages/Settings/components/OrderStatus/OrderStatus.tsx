import Toggle from '@src/admin/Dashboard/layout/Toggle'
import Container from '../../../../layout/Container/Container'
import { useSettings } from '../../SettingsContext'
import { __ } from '@src/utils'

const OrderStatus = () => {
    const { settings, updateSetting } = useSettings()

    return (
        <Container>
            <Toggle
                label={__('AUTO_COMPLETE_ORDERS')}
                description={__('AUTO_COMPLETE_ORDERS_DESC')}
                checked={settings.stachesepl_auto_confirm_paid_orders === 'yes'}
                onChange={(e) => updateSetting('stachesepl_auto_confirm_paid_orders', e.target.checked ? 'yes' : 'no')}
            />
        </Container>
    )
}

export default OrderStatus
