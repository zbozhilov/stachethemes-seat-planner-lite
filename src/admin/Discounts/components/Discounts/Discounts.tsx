import { __ } from '@src/utils';
import Button from '../Button/Button';
import './Discounts.scss';
import { discountData } from './types';
import toast from 'react-hot-toast';

const Discounts = (props: {
    discountsData: discountData[],
}) => {

    const handleAddDiscount = () => {
        toast.error(__('DISCOUNTS_NOT_AVAILABLE_FOR_LITE_VERSION'));
    }

    return (
        <div className='stachesepl-seat-planner-discounts'>

            <h4 className='stachesepl-seat-planner-discounts-head'>{__('MANAGE_DISCOUNTS')}</h4>

            <ul>
            </ul>

            <Button onClick={handleAddDiscount}>
                {__('ADD_DISCOUNT')}
            </Button>

        </div >
    )
}

export default Discounts