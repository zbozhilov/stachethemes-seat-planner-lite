import { OpenInNew, Person } from '@mui/icons-material';
import { __, getFormattedPrice } from '@src/utils';
import { useEditSeatOrderContext } from '../../context/EditSeatOrderContext';

const OrderInfoGrid = () => {
    const { orderDetails, visibleCustomFields } = useEditSeatOrderContext();

    // Use saved custom fields for display so order info updates only after save
    const savedCustomFields = orderDetails.seat_data?.customFields ?? {};
    const editableLabels = new Set(visibleCustomFields.map((f) => f.label));
    const metaCustomFields = Object.entries(savedCustomFields).filter(
        ([label]) => !editableLabels.has(label)
    );

    // Ensure seat_price is a valid number
    const seatPrice = typeof orderDetails.seat_price === 'number' 
        ? orderDetails.seat_price 
        : parseFloat(String(orderDetails.seat_price || 0));

    return (
        <div className="stachesepl-manager-edit-seat-order-info">
            <div className="stachesepl-manager-edit-seat-order-info-item">
                <span className="stachesepl-manager-edit-seat-order-info-label">
                    {__('ORDER_ID')}
                </span>
                <span className="stachesepl-manager-edit-seat-order-info-value">
                    <a
                        href={orderDetails.order_edit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="stachesepl-manager-edit-seat-order-link"
                    >
                        #{orderDetails.order_id}
                        <OpenInNew className="stachesepl-manager-edit-seat-order-link-icon" />
                    </a>
                </span>
            </div>
            <div className="stachesepl-manager-edit-seat-order-info-item">
                <span className="stachesepl-manager-edit-seat-order-info-label">
                    {__('ORDER_STATUS')}
                </span>
                <span
                    className={`stachesepl-manager-edit-seat-order-status stachesepl-manager-edit-seat-order-status--${orderDetails.order_status.toLowerCase().replace(/\s+/g, '-')}`}
                >
                    {orderDetails.order_status}
                </span>
            </div>
            <div className="stachesepl-manager-edit-seat-order-info-item">
                <span className="stachesepl-manager-edit-seat-order-info-label">
                    {__('CUSTOMER')}
                </span>
                <span className="stachesepl-manager-edit-seat-order-info-value stachesepl-manager-edit-seat-order-customer">
                    <Person className="stachesepl-manager-edit-seat-order-customer-icon" />
                    <span>{orderDetails.customer_name}</span>
                    <span className="stachesepl-manager-edit-seat-order-customer-email">
                        {orderDetails.customer_email}
                    </span>
                </span>
            </div>
            <div className="stachesepl-manager-edit-seat-order-info-item">
                <span className="stachesepl-manager-edit-seat-order-info-label">
                    {__('ORDER_DATE')}
                </span>
                <span className="stachesepl-manager-edit-seat-order-info-value">
                    {orderDetails.order_date}
                </span>
            </div>
            <div className="stachesepl-manager-edit-seat-order-info-item">
                <span className="stachesepl-manager-edit-seat-order-info-label">
                    {__('SEAT_ID')}
                </span>
                <span className="stachesepl-manager-edit-seat-order-info-value">
                    {orderDetails.seat_id}
                </span>
            </div>
            {orderDetails.seat_discount &&
                typeof orderDetails.seat_discount === 'object' &&
                orderDetails.seat_discount.name && (
                    <div className="stachesepl-manager-edit-seat-order-info-item">
                        <span className="stachesepl-manager-edit-seat-order-info-label">
                            {__('DISCOUNT')}
                        </span>
                        <span className="stachesepl-manager-edit-seat-order-info-value">
                            {orderDetails.seat_discount.type === 'percentage'
                                ? `${orderDetails.seat_discount.name} (${orderDetails.seat_discount.value}%)`
                                : `${orderDetails.seat_discount.name} (${orderDetails.seat_discount.value})`}
                        </span>
                    </div>
                )}
            {visibleCustomFields.map((field) => {
                const value = savedCustomFields[field.label];
                if (value === undefined || value === null || String(value).trim() === '') return null;
                const displayValue =
                    field.type === 'checkbox'
                        ? value
                            ? (field.checkedValue || __('YES'))
                            : __('NO')
                        : String(value);
                return (
                    <div
                        key={field.uid ?? field.label}
                        className="stachesepl-manager-edit-seat-order-info-item"
                    >
                        <span className="stachesepl-manager-edit-seat-order-info-label">
                            {field.label}
                        </span>
                        <span className="stachesepl-manager-edit-seat-order-info-value">
                            {displayValue}
                        </span>
                    </div>
                );
            })}
            {metaCustomFields.map(([label, value]) => {
                if (value === undefined || value === null || String(value).trim() === '') return null;
                return (
                    <div
                        key={label}
                        className="stachesepl-manager-edit-seat-order-info-item"
                    >
                        <span className="stachesepl-manager-edit-seat-order-info-label">
                            {label}
                        </span>
                        <span className="stachesepl-manager-edit-seat-order-info-value">
                            {String(value)}
                        </span>
                    </div>
                );
            })}
            {!isNaN(seatPrice) && seatPrice > 0 && (
                <div className="stachesepl-manager-edit-seat-order-info-item stachesepl-manager-edit-seat-order-info-item--total">
                    <span className="stachesepl-manager-edit-seat-order-info-label">
                        {__('SEAT_TOTAL')}
                    </span>
                    <span
                        className="stachesepl-manager-edit-seat-order-info-value stachesepl-manager-edit-seat-order-info-value--total"
                        dangerouslySetInnerHTML={{
                            // seat_price from the backend is already discounted
                            __html: getFormattedPrice(seatPrice),
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default OrderInfoGrid;
