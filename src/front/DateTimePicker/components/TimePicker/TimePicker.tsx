import { __, getFormattedTime } from '@src/utils';
import './TimePicker.scss';

const TimePicker = (props: {
    timesList: string[];
    selectedTime: string;
    setSelectedTime: (time: string) => void;
}) => {
    const { timesList, selectedTime, setSelectedTime } = props;

    // Format time from "HH:MM" to "HH:MM" or display format
    const formatTime = (timeString: string) => {
        return getFormattedTime(timeString);
    };

    const handleTimeClick = (timeString: string) => {
        setSelectedTime(timeString);
    };

    if (timesList.length === 0) {
        return (
            <div className='stachesepl-timepicker'>
                <p className='stachesepl-timepicker__empty'>
                    {__('PLEASE_SELECT_A_DATE_TO_SEE_AVAILABLE_TIMES')}
                </p>
            </div>
        );
    }

    return (
        <div className='stachesepl-timepicker'>
            <div className='stachesepl-timepicker__title'>{__('AVAILABLE_TIMES')}</div>
            <div className='stachesepl-timepicker__list'>
                {timesList.map((timeString) => {
                    const isSelected = selectedTime === timeString;
                    return (
                        <div
                            key={timeString}
                            className={`stachesepl-timepicker__time-btn 
                                ${isSelected ? 'stachesepl-timepicker__time-btn--selected' : ''}`}
                            onClick={() => handleTimeClick(timeString)}
                            aria-label={`${__('SELECT_TIME')} ${formatTime(timeString)}`}
                        >
                            {formatTime(timeString)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TimePicker;
