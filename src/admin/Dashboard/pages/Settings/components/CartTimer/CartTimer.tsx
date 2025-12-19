import ColorPicker from '@src/admin/Dashboard/layout/ColorPicker'
import Container from '../../../../layout/Container/Container'
import Toggle from '@src/admin/Dashboard/layout/Toggle'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import { useSettings } from '../../SettingsContext'
import Preview from './Preview'
import { __ } from '@src/utils'

const CartTimer = () => {
    const { settings, updateSetting } = useSettings()

    return (
        <Container>
            <Toggle
                label={__('ENABLE_CART_TIMER')}
                description={__('ENABLE_CART_TIMER_DESC')}
                checked={settings.stachesepl_cart_timer_enabled === 'yes'}
                onChange={(e) => updateSetting('stachesepl_cart_timer_enabled', e.target.checked ? 'yes' : 'no')}
            />

            <Divider />

            <ColorPicker
                label={__('CART_TIMER_BACKGROUND_COLOR')}
                description={__('CART_TIMER_BACKGROUND_COLOR_DESC')}
                value={settings.stachesepl_cart_timer_bg_color}
                onChange={(color) => updateSetting('stachesepl_cart_timer_bg_color', color)}
            />

            <Divider />

            <ColorPicker
                label={__('CART_TIMER_TEXT_COLOR')}
                description={__('CART_TIMER_TEXT_COLOR_DESC')}
                value={settings.stachesepl_cart_timer_text_color}
                onChange={(color) => updateSetting('stachesepl_cart_timer_text_color', color)}
            />

            <Divider />

            <ColorPicker
                label={__('CART_TIMER_TIME_COLOR')}
                description={__('CART_TIMER_TIME_COLOR_DESC')}
                value={settings.stachesepl_cart_timer_time_color}
                onChange={(color) => updateSetting('stachesepl_cart_timer_time_color', color)}
            />

            <Divider />

            <ColorPicker
                label={__('CART_TIMER_CRITICAL_TIME_COLOR')}
                description={__('CART_TIMER_CRITICAL_TIME_COLOR_DESC')}
                value={settings.stachesepl_cart_timer_time_color_critical}
                onChange={(color) => updateSetting('stachesepl_cart_timer_time_color_critical', color)}
            />

            <Divider />

            <Preview settings={settings} />

        </Container>
    )
}

export default CartTimer
