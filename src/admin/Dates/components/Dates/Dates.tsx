import { Close as Delete } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import './Dates.scss';
import { dateData } from './types';

const Dates = (props: {
    datesData: dateData[],
}) => {

    const [dates, setDates] = useState<dateData[]>(props.datesData);

    const handleAddDate = () => {
        // Set default to current date/time or tomorrow at 10:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const hours = String(tomorrow.getHours()).padStart(2, '0');
        const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
        
        const newDate: dateData = `${year}-${month}-${day}T${hours}:${minutes}`;
        setDates([...dates, newDate]);
    }

    const handleRemoveDate = (index: number) => {
        const newDates = dates.filter((_, i) => i !== index);
        setDates(newDates);
    }

    const formatDateForInput = (dateString: string): string => {
        // Ensure the format is correct for datetime-local input (YYYY-MM-DDTHH:mm)
        if (!dateString) return '';
        return dateString;
    }

    useEffect(() => {
        const inputData = document.getElementById('stachesepl-seat-planner-dates-data') as HTMLInputElement;
        inputData.value = JSON.stringify(dates);
    }, [dates]);

    return (
        <div className='stachesepl-seat-planner-dates'>

            <h4 className='stachesepl-seat-planner-dates-head'>{__('MANAGE_DATES_AND_TIMES')}</h4>
            <p className='stachesepl-seat-planner-dates-subtitle'>{__('MANAGE_DATES_AND_TIMES_DESC')}</p>

            <ul>
                {dates.map((date, index) => (
                    <li key={index}>

                        <label>
                            <span>{__('DATE_AND_TIME')}</span>
                            <input
                                type="datetime-local"
                                value={formatDateForInput(date)}
                                onChange={(e) => {
                                    const newDates = [...dates];
                                    newDates[index] = e.target.value;
                                    setDates(newDates);
                                }}
                                step="60"
                            />
                        </label>

                        <Delete onClick={() => handleRemoveDate(index)} />
                    </li>
                ))}
            </ul>

            <Button onClick={handleAddDate}>
                {__('ADD_DATE_AND_TIME')}
            </Button>

        </div >
    )
}

export default Dates

