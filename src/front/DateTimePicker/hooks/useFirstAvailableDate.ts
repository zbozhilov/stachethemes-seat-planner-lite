import { useEffect } from "react";

const useFirstAvailableDate = (props: {
    isLoading: boolean;
    availableDates: string[];
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    setSelectedTime: (time: string) => void;
    setTimesList: (times: string[]) => void;
}) => {

    const { isLoading, availableDates, selectedDate, setSelectedDate, setSelectedTime, setTimesList } = props;

    // Auto-select first available date and time when dates are fetched
    useEffect(() => {
        // Only auto-select if dates are ready, there are available dates, and no date is currently selected
        if (isLoading || availableDates.length === 0 || selectedDate) {
            return;
        }

        // Get the first available date-time (sorted to get the earliest)
        const sortedDates = [...availableDates].sort();
        const firstDateTime = sortedDates[0];

        if (!firstDateTime) {
            return;
        }

        const [date, time] = firstDateTime.split('T');

        if (date && time) {
            setSelectedDate(date);
            setSelectedTime(time);

            // Update times list for the selected date
            const availableTimes = availableDates
                .filter(dateTime => dateTime.includes(date))
                .map(dateTime => dateTime.split('T')[1]);
            setTimesList(availableTimes);
        }
    }, [isLoading, availableDates, selectedDate, setSelectedDate, setSelectedTime, setTimesList]);
}

export default useFirstAvailableDate;