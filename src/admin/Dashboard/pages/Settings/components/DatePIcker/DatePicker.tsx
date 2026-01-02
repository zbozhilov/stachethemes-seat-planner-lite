import ColorPicker from '@src/admin/Dashboard/layout/ColorPicker'
import Container from '../../../../layout/Container/Container'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import { useSettings } from '../../SettingsContext'
import Preview from './Preview'
import { __ } from '@src/utils'

const DatePicker = () => {
    const { settings, updateSetting } = useSettings()

    return (
        <Container>

            <ColorPicker
                label={__('DATEPICKER_ACCENT_COLOR')}
                description={__('DATEPICKER_ACCENT_COLOR_DESC')}
                value={settings.stachesepl_datepicker_accent_color}
                onChange={(color) => updateSetting('stachesepl_datepicker_accent_color', color)}
            />
            
            <Divider />

            <Preview settings={settings} />

        </Container>
    )
}

export default DatePicker
