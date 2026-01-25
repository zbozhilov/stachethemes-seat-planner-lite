import DateTimePicker from "@src/front/DateTimePicker/DateTimePicker";
import { useSettings } from "../../../../SettingsContext";

const DatePickerPreview = () => {

    const { settings } = useSettings();

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
        <div>
            <DateTimePicker
                showAdjacentMonths={settings.stachesepl_dt_adjacent_months === 'yes'}
                dummyDates={genericDates}
                productId={1}
                accentColor={settings.stachesepl_accent_color}
            />
        </div>
    )
}

export default DatePickerPreview