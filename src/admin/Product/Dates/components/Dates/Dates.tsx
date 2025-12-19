import { __ } from '@src/utils';
import './Dates.scss';
import { dateData } from './types';
import { toast } from 'react-hot-toast';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import Button from '@src/admin/Product/CommonUI/Button/Button';

const Dates = (props: {
    datesData: dateData[],
}) => {

    const handleAddDate = () => {
        toast.error(__('DATES_NOT_AVAILABLE_FOR_LITE_VERSION'));
    }

    return (
        <Container
            className='stachesepl-seat-planner-dates'
            label={__('MANAGE_DATES_AND_TIMES')}
            description={__('MANAGE_DATES_AND_TIMES_DESC')}>
            <ul>
            </ul>

            <Button onClick={handleAddDate}>
                {__('ADD_DATE_AND_TIME')}
            </Button>

        </Container>
    )
}

export default Dates

