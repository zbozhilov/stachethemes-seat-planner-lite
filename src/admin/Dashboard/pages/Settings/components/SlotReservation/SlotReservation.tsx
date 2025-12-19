import Input from '@src/admin/Dashboard/layout/Input'
import Container from '../../../../layout/Container/Container'
import { useSettings } from '../../SettingsContext'
import { __ } from '@src/utils'

const SlotReservation = () => {
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
        </Container>
    )
}

export default SlotReservation
