import Container from '../../../../layout/Container/Container'
import Notes from '../../../../layout/Notes/Notes'
import { __ } from '@src/utils'
import { useEditOrderItem } from './hooks'
import { EditOrderItemProvider } from './context/EditOrderItemContext'
import {
    OrderSearchForm,
    OrderHeader,
    OrderItemCard,
    OrderTotal,
    OrderMessages,
    OrderActions,
} from './components'
import './EditOrderItem.scss'

const EditOrderItem = () => {
    const {
        orderId,
        handleOrderIdChange,
        handleKeyDown,
        fetchOrderItems,
        isLoading,
        isSaving,
        error,
        successMessage,
        orderData,
        getItemValue,
        getCustomFieldValueForField,
        getItemDiscountName,
        getVisibleCustomFieldsForItem,
        handleItemChange,
        handleCustomFieldChange,
        handleDiscountChange,
        formatDateForInput,
        hasChanges,
        saveChanges,
    } = useEditOrderItem()

    return (
        <Container>
            <div className="stachesepl-eoi">
                <OrderSearchForm
                    orderId={orderId}
                    onOrderIdChange={handleOrderIdChange}
                    onKeyDown={handleKeyDown}
                    onSearch={fetchOrderItems}
                    isLoading={isLoading}
                    error={!orderData ? error : ''}
                />

                {orderData && (
                    <EditOrderItemProvider
                        value={{
                            orderData,
                            error,
                            successMessage,
                            getItemValue,
                            getCustomFieldValueForField,
                            getItemDiscountName,
                            getVisibleCustomFieldsForItem,
                            onItemChange: handleItemChange,
                            onCustomFieldChange: handleCustomFieldChange,
                            onDiscountChange: handleDiscountChange,
                            formatDateForInput,
                            hasChanges,
                            isSaving,
                            onSave: saveChanges,
                        }}
                    >
                        <div className="stachesepl-eoi-order">
                            <OrderHeader />

                            <div className="stachesepl-eoi-items">
                                {orderData.items.map((item) => (
                                    <OrderItemCard key={item.item_id} item={item} />
                                ))}
                            </div>

                            <OrderTotal />
                            <OrderMessages />
                            <OrderActions />
                        </div>
                    </EditOrderItemProvider>
                )}

                <Notes title={__('EDIT_ORDER_NOTES_TITLE')}>
                    <li>{__('EDIT_ORDER_NOTE_1')}</li>
                    <li>{__('EDIT_ORDER_NOTE_2')}</li>
                    <li>{__('EDIT_ORDER_NOTE_3')}</li>
                    <li>{__('EDIT_ORDER_NOTE_4')}</li>
                </Notes>
            </div>
        </Container>
    )
}

export default EditOrderItem
