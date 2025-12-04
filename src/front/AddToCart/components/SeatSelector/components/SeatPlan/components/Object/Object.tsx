import { useProductId, useSeatPlanData, useSelectedDate, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import Modal from '@src/front/AddToCart/components/Modal/Modal';
import { __ } from '@src/utils';
import React from 'react';
import { FrontWorkflowObject } from 'src/front/AddToCart/types';
import SeatObject from './components/SeatObject';
import { useSeatOrderModal } from './hooks';
import './Object.scss';
import { getObjectStyle } from './utils';

const Object = (props: {
    data: FrontWorkflowObject,
}) => {

    const { seatPlanData } = useSeatPlanData();
    const { productId } = useProductId();
    const { selectedDate } = useSelectedDate();
    const maxSeatsRequired = seatPlanData?.maxSeatsPerPurchase || 0;
    const { selectedSeats, setSelectedSeats } = useSelectedSeats();

    const {
        isOpen: orderModalOpen,
        isLoading,
        seatOrderData,
        canViewSeatOrders,
        openModal: handleSeatTakenCheck,
        closeModal: handleOrderModalClose,
    } = useSeatOrderModal({ productId, selectedDate });

    const style = getObjectStyle(props.data);

    const handleSeatSelectToggle = (seatId: string) => {

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
        } else {

            if (maxSeatsRequired > 0 && selectedSeats.length >= maxSeatsRequired) {
                return;
            }
            
            setSelectedSeats([...selectedSeats, seatId]);
        }

    }

    const disablePanning = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    switch (props.data.type) {

        case 'screen': {

            const { backgroundColor, ...baseStyle } = style;

            return (
                <div className="stachesepl-object stachesepl-object-type-screen" style={baseStyle}>
                    <div className="stachesepl-object-type-screen-label">{props.data.label}</div>
                    <div className="stachesepl-screen-persepective">
                        <div className="stachesepl-screen-vis" style={{
                            backgroundColor: backgroundColor
                        }}></div>
                    </div>
                </div>
            );
        }

        case 'seat': {

            return (
                <>
                    <Modal
                        open={orderModalOpen}
                        onClose={handleOrderModalClose}
                        onOutsideClick={handleOrderModalClose}
                    >
                        <div className='stachesepl-modal-message stachesepl-seat-order-modal' onMouseDown={e => e.stopPropagation()}>
                            {isLoading && (
                                <div className='stachesepl-loading-spinner'>
                                    <span>{__('LOADING')}</span>
                                </div>
                            )}
                            {!isLoading && seatOrderData && (
                                <div className='stachesepl-seat-order-details'>
                                    <h3>{__('SEAT_RESERVATION_DETAILS')}</h3>
                                    <div className='stachesepl-order-info'>
                                        <div className='stachesepl-order-row stachesepl-order-row-highlight'>
                                            <span className='stachesepl-order-label'>{__('RESERVED_BY')}</span>
                                            <span className='stachesepl-order-value'>{seatOrderData.customer_name}</span>
                                        </div>
                                        <div className='stachesepl-order-row'>
                                            <span className='stachesepl-order-label'>{__('ORDER_DATE')}</span>
                                            <span className='stachesepl-order-value'>{seatOrderData.order_date}</span>
                                        </div>
                                        <div className='stachesepl-order-row stachesepl-order-row-status'>
                                            <span className='stachesepl-order-label'>{__('ORDER_STATUS')}</span>
                                            <span className='stachesepl-order-value'>{seatOrderData.order_status}</span>
                                        </div>
                                        {seatOrderData.date_time && (
                                            <div className='stachesepl-order-row'>
                                                <span className='stachesepl-order-label'>{__('EVENT_DATE')}</span>
                                                <span className='stachesepl-order-value'>{seatOrderData.date_time}</span>
                                            </div>
                                        )}
                                        <div className='stachesepl-order-row stachesepl-order-row-link'>
                                            <span className='stachesepl-order-label'>{__('ORDER_ID')}</span>
                                            <a 
                                                href={seatOrderData.order_edit_url} 
                                                target='_blank' 
                                                rel='noopener noreferrer'
                                                className='stachesepl-order-value'
                                            >
                                                #{seatOrderData.order_id}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!isLoading && !seatOrderData && (
                                <p className='stachesepl-no-data'>{__('NO_ORDER_DATA_FOUND')}</p>
                            )}
                            <button onClick={handleOrderModalClose}>{__('CLOSE')}</button>
                        </div>
                    </Modal>
                    <SeatObject
                        data={props.data}
                        selectedSeats={selectedSeats}
                        style={style}
                        handleSeatSelectToggle={handleSeatSelectToggle}
                        handleSeatTakenCheck={handleSeatTakenCheck}
                        canViewSeatOrders={canViewSeatOrders}
                    />
                </>
            )

        }

        case 'text': {

            const classNameArray = ['stachesepl-object', 'stachesepl-object-text'];

            return (
                <div
                    className={classNameArray.join(' ')}
                    style={style}
                    onMouseDown={disablePanning}>
                    {props.data.label}
                </div>
            )
        }

        case 'generic': {

            const classNameArray = ['stachesepl-object', 'stachesepl-object-generic'];

            return (
                <div
                    className={classNameArray.join(' ')}
                    style={style}
                    onMouseDown={disablePanning}>
                    {props.data.label}
                </div>
            )
        }

        default: {
            return null;
        }

    }

}

export default Object