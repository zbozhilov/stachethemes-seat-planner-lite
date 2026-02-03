import Button from '../../../../../layout/Button/Button'
import { __ } from '@src/utils'
import { useEditOrderItemContext } from '../context/EditOrderItemContext'

const OrderActions = () => {
    const { hasChanges, isSaving, onSave } = useEditOrderItemContext()
    return (
        <div className="stachesepl-eoi-actions">
            <Button onClick={onSave} disabled={!hasChanges || isSaving}>
                {isSaving ? __('SAVING') : __('EDIT_ORDER_SAVE_CHANGES')}
            </Button>
        </div>
    )
}

export default OrderActions
