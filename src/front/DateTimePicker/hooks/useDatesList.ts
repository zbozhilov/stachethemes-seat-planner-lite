import { useMemo } from 'react';

const useDatesList = (props: {
    selectedDate: string;
    availableDates: string[];
    dataReady: boolean;
}) => {

    const { selectedDate, availableDates, dataReady } = props;

    const datesList = useMemo(() => {
        if (!dataReady) {
            return [];
        }

        return availableDates.map(dateTime => dateTime.split('T')[0]);
    }, [dataReady, availableDates]);

    const initialMonthDate = useMemo(() => {
        return selectedDate ? selectedDate : datesList.length > 0 ? datesList[0] : undefined;
    }, [selectedDate, datesList]);

    return {
        datesList,
        initialMonthDate,
    }
}

export default useDatesList;