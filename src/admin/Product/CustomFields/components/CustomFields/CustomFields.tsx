import { Add } from '@mui/icons-material';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import EmptyState from '@src/admin/Product/CommonUI/EmptyState/EmptyState';
import { __ } from '@src/utils';
import './CustomFields.scss';
import toast from 'react-hot-toast';

const CustomFields = () => {

    const handleAddField = () => {
        toast.error(__('CUSTOM_FIELDS_NOT_SUPPORTED_IN_LITE'));
    };

    return (
        <Container label={__('MANAGE_CUSTOM_FIELDS')} description={__('MANAGE_CUSTOM_FIELDS_DESC')} className='stachesepl-seat-planner-custom-fields'>

            <div className="stachesepl-seat-planner-custom-fields-list">
                <EmptyState>{__('NO_CUSTOM_FIELDS_ADDED')}</EmptyState>
            </div>

            <Button onClick={handleAddField} className="stachesepl-add-custom-field-button">
                <Add />
                {__('ADD_CUSTOM_FIELD')}
            </Button>
        </Container>
    );
};

export default CustomFields;

