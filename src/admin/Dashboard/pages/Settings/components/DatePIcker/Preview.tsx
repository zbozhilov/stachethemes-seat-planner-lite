import DateTimePicker from "@src/front/DateTimePicker/DateTimePicker";
import { __ } from "@src/utils";
import { SettingsState } from "../../SettingsContext";
import './Preview.scss';

const Preview = (props: { settings: SettingsState }) => {

    const getTimes = () => {
        const times = ['09:00', '19:00', '20:00'];
        return times;
    }

    const getGenericDates = () => {

        const dates: string[] = [];

        for (let i = 0; i < 60; i++) {

            const today = new Date();
            today.setDate(today.getDate() + i);

            const dateString = today.toISOString().split('T')[0];

            for (const time of getTimes()) {
                dates.push(dateString + 'T' + time);
            }
        }


        return dates;
    }

    const genericDates = getGenericDates();

    return (
        <>
            <p className='stachesepl-datepicker-label-preview'>{__('DATEPICKER_PREVIEW')}</p>

            <DateTimePicker
                dummyDates={genericDates}
                productId={1}
                accentColor={props.settings.stachesepl_datepicker_accent_color}
            />
        </>
    )
}

export default Preview