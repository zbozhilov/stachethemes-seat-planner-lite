import Toaster from '@src/admin/SeatPlanner/components/Toaster/Toaster';
import { __ } from '@src/utils';
import toast from 'react-hot-toast';
import Button from '../Button/Button';
import './Discounts.scss';

const Discounts = () => {

    const handleAddDiscount = () => {
        toast.error(__('ADD_DISCOUNT_DISABLED'))
    }

    return (
        <div className='st-seat-planner-discounts'>

            <Toaster />

            <h4 className='st-seat-planner-discounts-head'>{__('MANAGE_DISCOUNTS')}</h4>

            <ul></ul>

            <Button onClick={handleAddDiscount}>
                {__('ADD_DISCOUNT')}
            </Button>
        </div>
    )
}

export default Discounts