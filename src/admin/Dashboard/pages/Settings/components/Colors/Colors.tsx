import ColorPicker from '@src/admin/Dashboard/layout/ColorPicker'
import Container from '@src/admin/Dashboard/layout/Container/Container'
import { __ } from '@src/utils'
import { useSettings } from '../../SettingsContext'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import DatePickerPreview from './components/Preview/DatePickerPreview'
import ButtonsPreview from './components/Preview/ButtonsPreview'
import CartTimerPreview from './components/Preview/CartTimerPreview'
import LabelPreview from '../LabelPreview/LabelPreview'
import './Colors.scss'

const Colors = () => {

    const { settings, updateSetting } = useSettings()

    return (
        <Container title={__('TAB_COLORS')}>

            <ColorPicker
                label={__('ACCENT_COLOR')}
                description={__('ACCENT_COLOR_DESC')}
                value={settings.stachesepl_accent_color}
                onChange={(color) => updateSetting('stachesepl_accent_color', color)}
            />

            <Divider />

            <LabelPreview text={__('COLOR_PREVIEW_LABEL')} />

            <Divider />

            <DatePickerPreview />

            <div className='stachesepl-colors-preview-buttons-flex'>
                <ButtonsPreview />
                <CartTimerPreview />
            </div>

        </Container >
    )
}

export default Colors