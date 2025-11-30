import { __ } from '@src/utils';
import Button from '../Button/Button';
import './Dates.scss';
import { dateData } from './types';
import { toast } from 'react-hot-toast';

const Dates = (props: {
    datesData: dateData[],
}) => {

    const handleAddDate = () => {
        toast.error(__('DATES_NOT_AVAILABLE_FOR_LITE_VERSION'));
    }

    return (
        <div className='stachesepl-seat-planner-dates'>

            <h4 className='stachesepl-seat-planner-dates-head'>{__('MANAGE_DATES_AND_TIMES')}</h4>
            <p className='stachesepl-seat-planner-dates-subtitle'>{__('MANAGE_DATES_AND_TIMES_DESC')}</p>

            <ul>
            </ul>

            <Button onClick={handleAddDate}>
                {__('ADD_DATE_AND_TIME')}
            </Button>

        </div >
    )
}

export default Dates

