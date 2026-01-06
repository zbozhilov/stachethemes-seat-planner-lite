import { useProductId, useSeatPlanData, useSelectedDate, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import Modal from '@src/front/AddToCart/components/Modal/Modal';
import React from 'react';
import { FrontWorkflowObject } from 'src/front/AddToCart/types';
import SeatObject from './components/SeatObject/SeatObject';
import SeatReservationDetails from './components/SeatReservationDetails/SeatReservationDetails';
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
            
            // Add the new seat
            setSelectedSeats([...selectedSeats, seatId]);
        }

    }

    const disablePanning = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    switch (props.data.type) {

        case 'screen': {

            const { backgroundColor, borderRadius, ...baseStyle } = style;

            const classNameArray = ['stachesepl-object', 'stachesepl-object-type-screen'];

            if (props.data.extraClass) {
                classNameArray.push(props.data.extraClass);
            }

            return (
                <div className={classNameArray.join(' ')} style={baseStyle}>
                    <div className="stachesepl-object-type-screen-label">{props.data.label}</div>
                    <div className="stachesepl-screen-persepective">
                        <div className="stachesepl-screen-vis" style={{
                            backgroundColor: backgroundColor,
                            borderRadius: borderRadius ? `${borderRadius}` : undefined
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
                        <SeatReservationDetails
                            isLoading={isLoading}
                            seatOrderData={seatOrderData}
                            onClose={handleOrderModalClose}
                        />
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

            if (props.data.extraClass) {
                classNameArray.push(props.data.extraClass);
            }

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

            if (props.data.extraClass) {
                classNameArray.push(props.data.extraClass);
            }

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