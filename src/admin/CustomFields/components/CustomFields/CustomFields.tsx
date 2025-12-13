import Button from '@src/admin/CommonUI/Button/Button';
import Container from '@src/admin/CommonUI/Container/Container';
import { __ } from '@src/utils';
import toast from 'react-hot-toast';
import './CustomFields.scss';

const CustomFields = () => {

    const handleAddField = () => {
        toast.error(__('CUSTOM_FIELDS_NOT_AVAILABLE_FOR_LITE_VERSION'));
    }

    return (
        <Container label={__('MANAGE_CUSTOM_FIELDS')} description={__('MANAGE_CUSTOM_FIELDS_DESC')} className='stachesepl-seat-planner-custom-fields'>

            <ul className="stachesepl-seat-planner-custom-fields-list">
            </ul>

            <Button onClick={handleAddField}>
                {__('ADD_CUSTOM_FIELD')}
            </Button>
        </Container>
    );
};

export default CustomFields;

