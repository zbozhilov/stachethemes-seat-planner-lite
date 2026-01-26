import { SeatOrderData } from '@src/front/AddToCart/ajax/fetchSeatOrderData';
import CircLoader from '@src/front/AddToCart/components/CircLoader/CircLoader';
import { __ } from '@src/utils';
import NoDataMessage from './components/NoDataMessage/NoDataMessage';
import OrderDetails from './components/OrderDetails/OrderDetails';
import './SeatReservationDetails.scss';

type SeatReservationDetailsProps = {
    isLoading: boolean;
    seatOrderData: SeatOrderData | null;
    onClose: () => void;
};

const SeatReservationDetails: React.FC<SeatReservationDetailsProps> = ({
    isLoading,
    seatOrderData,
    onClose,
}) => {
    return (
        <div className='stachesepl-modal-message stachesepl-seat-order-modal' onMouseDown={e => e.stopPropagation()}>
            {isLoading && <CircLoader text={__('LOADING')} />}
            {!isLoading && seatOrderData && <OrderDetails seatOrderData={seatOrderData} />}
            {!isLoading && !seatOrderData && <NoDataMessage />}
            <button onClick={onClose}>{__('CLOSE')}</button>
        </div>
    );
};

export default SeatReservationDetails;

