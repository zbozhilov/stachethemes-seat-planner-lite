import { __ } from '@src/utils'
import { useEditOrderItemContext } from '../context/EditOrderItemContext'

const OrderTotal = () => {
    const { orderData } = useEditOrderItemContext()
    const totalFormatted = orderData.order_total_formatted
    if (!totalFormatted) return null
    return (
        <div className="stachesepl-eoi-order-total-wrap">
            <span className="stachesepl-eoi-order-total">
                <span className="stachesepl-eoi-order-total-label">{__('EDIT_ORDER_ORDER_TOTAL')}:</span>
                <span
                    className="stachesepl-eoi-order-total-value"
                    dangerouslySetInnerHTML={{ __html: totalFormatted }}
                />
            </span>
        </div>
    )
}

export default OrderTotal
