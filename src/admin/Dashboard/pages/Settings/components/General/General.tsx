import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import Input from '@src/admin/Dashboard/layout/Input'
import Toggle from '@src/admin/Dashboard/layout/Toggle'
import { __ } from '@src/utils'
import Container from '../../../../layout/Container/Container'
import { useSettings } from '../../SettingsContext'

const General = () => {
    const { settings, updateSetting } = useSettings()

    return (
        <Container>

            <Input
                label={__('SEAT_RESERVATION_TIME')}
                description={__('SEAT_RESERVATION_TIME_DESC')}
                type='number'
                min={1}
                value={settings.stachesepl_reserve_time}
                onChange={(e) => updateSetting('stachesepl_reserve_time', Math.max(1, parseInt(e.target.value) || 1))}
                placeholder={''}
                suffix={__('MINUTES')}
                showClear
                onClear={() => updateSetting('stachesepl_reserve_time', 15)}
            />

            <Divider />

            <Toggle
                label={__('AUTO_COMPLETE_ORDERS')}
                description={__('AUTO_COMPLETE_ORDERS_DESC')}
                checked={settings.stachesepl_auto_confirm_paid_orders === 'yes'}
                onChange={(e) => updateSetting('stachesepl_auto_confirm_paid_orders', e.target.checked ? 'yes' : 'no')}
            />

            <Divider />

            <Toggle
                label={__('ENABLE_IN_LOOP_SELECT_SEAT_BUTTON')}
                description={__('ENABLE_IN_LOOP_SELECT_SEAT_BUTTON_DESC')}
                checked={settings.stachesepl_enable_in_loop_button === 'yes'}
                onChange={(e) => updateSetting('stachesepl_enable_in_loop_button', e.target.checked ? 'yes' : 'no')}
            />
            <Divider />

            <Toggle
                label={__('SHOW_ADJACENT_MONTHS_IN_DATE_PICKER')}
                description={__('SHOW_ADJACENT_MONTHS_IN_DATE_PICKER_DESC')}
                checked={settings.stachesepl_dt_adjacent_months === 'yes'}
                onChange={(e) => updateSetting('stachesepl_dt_adjacent_months', e.target.checked ? 'yes' : 'no')}
            />

            <Divider />

            <Toggle
                label={__('COMPATIBILITY_MODE')}
                description={__('COMPATIBILITY_MODE_DESC')}
                checked={settings.stachesepl_compat_mode === 'yes'}
                onChange={(e) => updateSetting('stachesepl_compat_mode', e.target.checked ? 'yes' : 'no')}
            />

            <Divider />

            <Toggle
                label={__('COMPATIBILITY_CALC_TOTALS')}
                description={__('COMPATIBILITY_CALC_TOTALS_DESC')}
                checked={settings.stachesepl_compat_calc_totals === 'yes'}
                onChange={(e) => updateSetting('stachesepl_compat_calc_totals', e.target.checked ? 'yes' : 'no')}
            />


        </Container>
    )
}

export default General
