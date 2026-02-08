import { Edit, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import type { SeatAvailabilityStatus, SeatObject } from '../types';
import { __, getFormattedPrice } from '@src/utils';
import './SeatsGrid.scss';

type SeatsGridProps = {
    seats: SeatObject[];
    paginatedSeats: SeatObject[];
    getSeatAvailabilityStatus: (seat: SeatObject) => SeatAvailabilityStatus;
    handleEditSeat: (seatId: string) => void;
    isSelectionMode?: boolean;
    selectedSeats?: Set<string>;
    onToggleSeatSelection?: (seatId: string) => void;
};

const SeatsGrid = ({
    seats,
    paginatedSeats,
    getSeatAvailabilityStatus,
    handleEditSeat,
    isSelectionMode = false,
    selectedSeats = new Set(),
    onToggleSeatSelection,
}: SeatsGridProps) => {
    if (seats.length === 0) {
        return (
            <div className="stachesepl-manager-availability-no-results">
                <p>{__('NO_SEATS_MATCH_FILTER')}</p>
            </div>
        );
    }

    const handleClick = (seatId: string) => {
        if (isSelectionMode && onToggleSeatSelection) {
            onToggleSeatSelection(seatId);
        } else {
            handleEditSeat(seatId);
        }
    };

    return (
        <div className={`stachesepl-manager-availability-grid ${isSelectionMode ? 'stachesepl-manager-availability-grid--selection-mode' : ''}`}>
            {paginatedSeats.map((seat) => {
                const status = getSeatAvailabilityStatus(seat);
                const price = seat.price || 0;
                const isSelected = selectedSeats.has(seat.seatId);

                return (
                    <button
                        key={seat.seatId}
                        className={`stachesepl-manager-seat-row stachesepl-manager-seat-row--${status} ${isSelected ? 'stachesepl-manager-seat-row--selected' : ''}`}
                        onClick={() => handleClick(seat.seatId)}
                    >
                        {isSelectionMode && (
                            <span className="stachesepl-manager-seat-row-checkbox">
                                {isSelected ? (
                                    <CheckBox className="stachesepl-manager-seat-row-checkbox-icon stachesepl-manager-seat-row-checkbox-icon--checked" />
                                ) : (
                                    <CheckBoxOutlineBlank className="stachesepl-manager-seat-row-checkbox-icon" />
                                )}
                            </span>
                        )}
                        <span className={`stachesepl-manager-seat-row-status stachesepl-manager-seat-row-status--${status}`} />
                        <span className="stachesepl-manager-seat-row-id" title={seat.seatId}>{seat.seatId}</span>
                        {/* {price > 0 && (
                            <span className="stachesepl-manager-seat-row-price">
                                {getFormattedPrice(price)}
                            </span>
                        )} */}
                        {!isSelectionMode && <Edit className="stachesepl-manager-seat-row-edit" />}
                    </button>
                );
            })}
        </div>
    );
};

export default SeatsGrid;

