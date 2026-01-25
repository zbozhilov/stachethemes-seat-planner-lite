import { Accessible } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useCallback } from 'react';
import OnSiteModal from './components/OnSiteModal/OnSiteModal';
import SeatTooltip from './components/SeatTooltip/SeatTooltip';
import { useOnSiteModal, useTooltip } from './hooks';
import './SeatObject.scss';
import { FrontSeatObject, SeatObjectComponentProps, isSeatObject } from './types';
import { getSeatClassNames, getSeatStatus } from './utils';

const SeatObject = ({
    data,
    selectedSeats,
    style,
    handleSeatSelectToggle,
    handleSeatTakenCheck,
    canViewSeatOrders,
}: SeatObjectComponentProps) => {
    const isSeat = isSeatObject(data);
    
    // Cast to seat type for hook usage (safe because we check isSeat before rendering)
    const seatData = data as FrontSeatObject;
    
    const {
        seatRef,
        visible: tooltipVisible,
        position: tooltipPosition,
        handleMouseEnter,
        handleMouseLeave,
    } = useTooltip();

    const { modalMessage, isOpen: isModalOpen, showModal, hideModal } = useOnSiteModal();

    // Compute status (returns safe defaults if not a seat)
    const seatStatus = isSeat 
        ? getSeatStatus(seatData, selectedSeats, canViewSeatOrders)
        : { isTaken: false, isUnavailable: true, onSiteOnly: false, isClickable: false, isSelected: false };
    
    const { isTaken, isUnavailable, onSiteOnly, isSelected } = seatStatus;

    const handleClick = useCallback(() => {

        if (!isSeat) {
            return;
        }

        if (isTaken && canViewSeatOrders) {
            handleSeatTakenCheck(seatData.seatId);
        }

        if (isUnavailable || isTaken) {
            return;
        }

        if (onSiteOnly) {
            showModal(__('THIS_SEAT_IS_ONLY_AVAILABLE_ON_SITE'));
            return;
        }

        if (!seatData.seatId) {
            return;
        }

        handleSeatSelectToggle(seatData.seatId);
    }, [
        isSeat,
        isUnavailable,
        onSiteOnly,
        seatData.seatId,
        isTaken,
        canViewSeatOrders,
        showModal,
        handleSeatTakenCheck,
        handleSeatSelectToggle,
    ]);

    // Early return after all hooks
    if (!isSeat) {
        return null;
    }

    const className = getSeatClassNames(seatStatus, data.extraClass).join(' ');
    

    return (
        <>
            {onSiteOnly && (
                <OnSiteModal
                    open={isModalOpen}
                    message={modalMessage}
                    onClose={hideModal}
                />
            )}

            <div
                ref={seatRef}
                className={className}
                style={style}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {seatData.isHandicap ? <Accessible /> : seatData.label}
            </div>

            <SeatTooltip
                visible={tooltipVisible}
                position={tooltipPosition}
                seatId={seatData.seatId}
                isTaken={isTaken}
                isSelected={isSelected}
                isUnavailable={isUnavailable}
                onSiteOnly={onSiteOnly}
                backgroundColor={seatData.backgroundColor}
                price={seatData.price}
            />
        </>
    );
};

export default SeatObject;
