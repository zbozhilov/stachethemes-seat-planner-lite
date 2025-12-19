import { __ } from '@src/utils';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import './Discounts.scss';
import { discountData } from './types';
import toast from 'react-hot-toast';
import Container from '@src/admin/Product/CommonUI/Container/Container';

const Discounts = (props: {
    discountsData: discountData[],
}) => {

    const handleAddDiscount = () => {
        toast.error(__('DISCOUNTS_NOT_AVAILABLE_FOR_LITE_VERSION'));
    }

    return (
        <Container label={__('MANAGE_DISCOUNTS')} description={__('DISCOUNTS_SUBTITLE')} className='stachesepl-seat-planner-discounts'>

            <ul>
            </ul>

            <Button onClick={handleAddDiscount}>
                {__('ADD_DISCOUNT')}
            </Button>

        </Container>
    )
}

export default Discounts