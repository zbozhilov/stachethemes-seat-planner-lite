import { __ } from '@src/utils';
import React from 'react';
import { SeatOrderData } from '@src/front/AddToCart/ajax/fetchSeatOrderData';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import OrderDetails from './components/OrderDetails/OrderDetails';
import NoDataMessage from './components/NoDataMessage/NoDataMessage';
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
            {isLoading && <LoadingSpinner />}
            {!isLoading && seatOrderData && <OrderDetails seatOrderData={seatOrderData} />}
            {!isLoading && !seatOrderData && <NoDataMessage />}
            <button onClick={onClose}>{__('CLOSE')}</button>
        </div>
    );
};

export default SeatReservationDetails;

