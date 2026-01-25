import './DatePicker.scss';
import CalendarDays from './components/CalendarDays';
import CalendarHeader from './components/CalendarHeader';
import WeekdaysRow from './components/WeekdaysRow';
import {
    useCalendarDays,
    useMonthNames,
    useMonthNavigation,
    useSwipe,
    useWeekDays,
    useWeekStart,
} from './hooks';

const DatePicker = (props: {
    datesList: string[];
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    initialMonthDate?: string;
    showAdjacentMonths?: boolean;
}) => {
    const { datesList, selectedDate, setSelectedDate, initialMonthDate, showAdjacentMonths = false } = props;

    const weekStart = useWeekStart();
    const monthNames = useMonthNames();
    const weekDays = useWeekDays(weekStart);

    const {
        currentMonth,
        prevMonth,
        animationDirection,
        handlePrevMonth,
        handleNextMonth,
        handleAnimationEnd,
    } = useMonthNavigation(initialMonthDate);

    const { currentDays, prevDays } = useCalendarDays(
        currentMonth,
        prevMonth,
        datesList,
        weekStart,
        showAdjacentMonths
    );

    const { touchHandlers } = useSwipe({
        onSwipeLeft: handleNextMonth,
        onSwipeRight: handlePrevMonth,
    });

    const handleDateClick = (dateString: string, isAvailable: boolean) => {
        if (isAvailable) {
            setSelectedDate(dateString);
        }
    };

    return (
        <div
            className='stachesepl-datepicker'
            {...touchHandlers}
        >
            <CalendarHeader
                currentMonth={currentMonth}
                monthNames={monthNames}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
            />

            <WeekdaysRow weekDays={weekDays} />

            <div className='stachesepl-datepicker__days-wrapper'>
                {prevDays && prevMonth && animationDirection && (
                    <CalendarDays
                        days={prevDays}
                        selectedDate={selectedDate}
                        onDateClick={handleDateClick}
                        variant='prev'
                        animationDirection={animationDirection}
                        onAnimationEnd={handleAnimationEnd}
                        monthKey={`prev-${prevMonth.year}-${prevMonth.month}`}
                    />
                )}
                <CalendarDays
                    days={currentDays}
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                    variant='current'
                    animationDirection={animationDirection}
                    monthKey={`current-${currentMonth.year}-${currentMonth.month}`}
                />
            </div>
        </div>
    );
}

export default DatePicker;
