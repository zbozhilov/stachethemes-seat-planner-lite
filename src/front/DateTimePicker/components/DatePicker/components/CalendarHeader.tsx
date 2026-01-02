import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { __ } from '@src/utils';

interface CalendarHeaderProps {
    currentMonth: { year: number; month: number };
    monthNames: string[];
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

const CalendarHeader = ({
    currentMonth,
    monthNames,
    onPrevMonth,
    onNextMonth,
}: CalendarHeaderProps) => {
    return (
        <div className='stachesepl-datepicker__header'>
            <div
                className='stachesepl-datepicker__nav-btn'
                onClick={onPrevMonth}
                aria-label={__('PREVIOUS_MONTH')}
            >
                <ChevronLeft fontSize='small' />
            </div>
            <div className='stachesepl-datepicker__month-year'>
                {monthNames[currentMonth.month]} {currentMonth.year}
            </div>
            <div
                className='stachesepl-datepicker__nav-btn'
                onClick={onNextMonth}
                aria-label={__('NEXT_MONTH')}
            >
                <ChevronRight fontSize='small' />
            </div>
        </div>
    );
};

export default CalendarHeader;

