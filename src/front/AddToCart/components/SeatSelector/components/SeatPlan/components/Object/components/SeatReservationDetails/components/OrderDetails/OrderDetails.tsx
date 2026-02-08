import { __, getFormattedDateTime } from '@src/utils';
import { SeatOrderData } from '@src/front/AddToCart/ajax/fetchSeatOrderData';
import OrderInfoRow from '../OrderInfoRow/OrderInfoRow';
import './OrderDetails.scss';

type OrderDetailsProps = {
    seatOrderData: SeatOrderData;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ seatOrderData }) => {
    return (
        <div className='stachesepl-seat-order-details'>
            <h3>{__('SEAT_RESERVATION_DETAILS')}</h3>
            <div className='stachesepl-order-info'>
                <OrderInfoRow
                    label={__('RESERVED_BY')}
                    value={seatOrderData.customer_name}
                    variant='highlight'
                />
                <OrderInfoRow
                    label={__('ORDER_DATE')}
                    value={getFormattedDateTime(seatOrderData.order_date)}
                />
                <OrderInfoRow
                    label={__('ORDER_STATUS')}
                    value={seatOrderData.order_status}
                    variant='status'
                />
                {seatOrderData.date_time && (
                    <OrderInfoRow
                        label={__('EVENT_DATE')}
                        value={getFormattedDateTime(seatOrderData.date_time)}
                    />
                )}
                <OrderInfoRow
                    label={__('ORDER_ID')}
                    value={`#${seatOrderData.order_id}`}
                    variant='link'
                    href={seatOrderData.order_edit_url}
                />
            </div>
        </div>
    );
};

export default OrderDetails;

