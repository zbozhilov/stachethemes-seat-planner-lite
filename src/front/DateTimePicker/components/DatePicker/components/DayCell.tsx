import { __ } from '@src/utils';

interface DayCellProps {
    day: number;
    dateString: string;
    isAvailable: boolean;
    isSelected: boolean;
    isAdjacentMonth?: boolean;
    onClick: (dateString: string, isAvailable: boolean) => void;
}

const DayCell = ({ day, dateString, isAvailable, isSelected, isAdjacentMonth = false, onClick }: DayCellProps) => {
    return (
        <div
            className={`stachesepl-datepicker__day 
                ${isAvailable ? 'stachesepl-datepicker__day--available' : 'stachesepl-datepicker__day--unavailable'}
                ${isSelected ? 'stachesepl-datepicker__day--selected' : ''}
                ${isAdjacentMonth ? 'stachesepl-datepicker__day--adjacent' : ''}`}
            onClick={() => onClick(dateString, isAvailable)}
            aria-label={`${__('SELECT_DATE')} ${dateString}`}
        >
            {day}
        </div>
    );
};

export default DayCell;

