import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import { __ } from '@src/utils';
import toast from 'react-hot-toast';
import './Discounts.scss';

const Discounts = () => {

    const handleAddDiscount = () => {
        toast.error(__('DISCOUNTS_NOT_AVAILABLE_FOR_LITE_VERSION'));
    }

    return (
        <Container label={__('MANAGE_DISCOUNTS')} description={__('DISCOUNTS_SUBTITLE')} className='stachesepl-seat-planner-discounts'>

            <p className="stachesepl-seat-planner-discounts-no-discounts">{__('NO_DISCOUNTS_ADDED')}</p>

            <Button onClick={handleAddDiscount}>
                {__('ADD_DISCOUNT')}
            </Button>

        </Container>
    )
}

export default Discounts