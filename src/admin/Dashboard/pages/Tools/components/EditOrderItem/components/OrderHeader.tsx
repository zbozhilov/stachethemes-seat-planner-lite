import { __ } from '@src/utils'
import { useEditOrderItemContext } from '../context/EditOrderItemContext'

const OrderHeader = () => {
    const { orderData } = useEditOrderItemContext()
    return (
        <div className="stachesepl-eoi-order-header">
            <div className="stachesepl-eoi-order-info">
                <h3>
                    {__('EDIT_ORDER_ORDER_NUMBER').replace('%s', orderData.order_id.toString())}
                </h3>
                <span className={`stachesepl-eoi-status stachesepl-eoi-status--${orderData.order_status}`}>
                    {orderData.order_status}
                </span>
            </div>
            <a
                href={`${window.stachesepl_admin_url.admin_url}post.php?post=${orderData.order_id}&action=edit`}
                target="_blank"
                rel="noopener noreferrer"
                className="stachesepl-eoi-order-link"
            >
                {__('VIEW_ORDER')}
            </a>
        </div>
    )
}

export default OrderHeader
