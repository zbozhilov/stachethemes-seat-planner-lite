import Button from '../../../../../layout/Button/Button'
import Checkbox from '../../../../../layout/Checkbox/Checkbox'
import { __ } from '@src/utils'
import { useEditOrderItemContext } from '../context/EditOrderItemContext'

const OrderActions = () => {
    const { hasChanges, isSaving, sendNotifications, onSendNotificationsChange, onSave } = useEditOrderItemContext()
    return (
        <div className="stachesepl-eoi-actions">
            <Checkbox
                label={__('BULK_SEND_NOTIFICATIONS')}
                checked={sendNotifications}
                onChange={onSendNotificationsChange}
                disabled={isSaving}
            />
            <Button onClick={onSave} disabled={!hasChanges || isSaving}>
                {isSaving ? __('SAVING') : __('EDIT_ORDER_SAVE_CHANGES')}
            </Button>
        </div>
    )
}

export default OrderActions
