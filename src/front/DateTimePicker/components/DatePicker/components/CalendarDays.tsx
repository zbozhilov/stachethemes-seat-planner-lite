import DayCell from './DayCell';

interface DayInfo {
    day: number;
    dateString: string;
    isAvailable: boolean;
    isAdjacentMonth?: boolean;
}

interface CalendarDaysProps {
    days: (DayInfo | null)[];
    selectedDate: string;
    onDateClick: (dateString: string, isAvailable: boolean) => void;
    variant: 'current' | 'prev';
    animationDirection?: 'left' | 'right' | null;
    onAnimationEnd?: () => void;
    monthKey: string;
}

const CalendarDays = ({
    days,
    selectedDate,
    onDateClick,
    variant,
    animationDirection,
    onAnimationEnd,
    monthKey,
}: CalendarDaysProps) => {
    const baseClass = 'stachesepl-datepicker__days';
    const variantClass = variant === 'current' 
        ? 'stachesepl-datepicker__days--current'
        : 'stachesepl-datepicker__days--prev';
    
    const animationClass = variant === 'prev' && animationDirection
        ? (animationDirection === 'left' 
            ? 'stachesepl-datepicker__days--exit-left'
            : 'stachesepl-datepicker__days--exit-right')
        : variant === 'current' && animationDirection
        ? (animationDirection === 'left'
            ? 'stachesepl-datepicker__days--enter-left'
            : 'stachesepl-datepicker__days--enter-right')
        : '';

    return (
        <div
            key={monthKey}
            className={`${baseClass} ${variantClass} ${animationClass}`.trim()}
            onAnimationEnd={onAnimationEnd}
        >
            {days.map((dayInfo, index) => {
                if (dayInfo === null) {
                    return (
                        <div 
                            key={index} 
                            className='stachesepl-datepicker__day stachesepl-datepicker__day--empty'
                        />
                    );
                }

                const { day, dateString, isAvailable, isAdjacentMonth } = dayInfo;
                const isSelected = selectedDate === dateString;

                return (
                    <DayCell
                        key={dateString}
                        day={day}
                        dateString={dateString}
                        isAvailable={isAvailable}
                        isSelected={isSelected}
                        isAdjacentMonth={isAdjacentMonth || false}
                        onClick={onDateClick}
                    />
                );
            })}
        </div>
    );
};

export default CalendarDays;

