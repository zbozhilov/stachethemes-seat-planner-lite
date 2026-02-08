import { Add } from '@mui/icons-material';
import { __ } from '@src/utils';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import EmptyState from '@src/admin/Product/CommonUI/EmptyState/EmptyState';
import './Discounts.scss';
import toast from 'react-hot-toast';

const Discounts = () => {

    const handleAddDiscount = () => {
        toast.error(__('DISCOUNTS_NOT_SUPPORTED_IN_LITE'));
    };

    return (
        <Container label={__('MANAGE_DISCOUNTS')} description={__('DISCOUNTS_SUBTITLE')} className='stachesepl-seat-planner-discounts'>

            <div className="stachesepl-seat-planner-discounts-list">
                <EmptyState>{__('NO_DISCOUNTS_ADDED')}</EmptyState>
            </div>

            <Button onClick={handleAddDiscount} className="stachesepl-add-discount-button">
                <Add />
                {__('ADD_DISCOUNT')}
            </Button>

        </Container>
    );
};

export default Discounts