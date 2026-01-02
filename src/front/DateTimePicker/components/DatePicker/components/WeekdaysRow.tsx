interface WeekdaysRowProps {
    weekDays: string[];
}

const WeekdaysRow = ({ weekDays }: WeekdaysRowProps) => {
    return (
        <div className='stachesepl-datepicker__weekdays'>
            {weekDays.map(day => (
                <div key={day} className='stachesepl-datepicker__weekday'>
                    {day}
                </div>
            ))}
        </div>
    );
};

export default WeekdaysRow;

