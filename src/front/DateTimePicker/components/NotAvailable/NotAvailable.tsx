import { __ } from "@src/utils";
import { EventBusy } from '@mui/icons-material';
import './NotAvailable.scss';

const NotAvailable = () => {
    return (
        <div className='stachesepl-date-time-picker-unavailable'>
            <div className='stachesepl-date-time-picker-unavailable__container'>
                <div className='stachesepl-date-time-picker-unavailable__icon'>
                    <EventBusy />
                </div>
                <p className='stachesepl-date-time-picker-unavailable__label'>
                    {__('DATEPICKER_NOT_SEATS_AVAILABLE_TITLE')}
                </p>
                <p className='stachesepl-date-time-picker-unavailable__description'>
                    {__('DATEPICKER_NOT_SEATS_AVAILABLE_DESCRIPTION')}
                </p>
            </div>
        </div>
    )
}

export default NotAvailable;