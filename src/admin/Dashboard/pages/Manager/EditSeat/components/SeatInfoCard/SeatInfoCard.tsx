import { EventSeat, Warning } from '@mui/icons-material';
import { __, getFormattedPrice } from '@src/utils';
import type { SeatObjectData } from '../../../types';
import './SeatInfoCard.scss';

type SeatInfoCardProps = {
    seatId: string | undefined;
    seatInfo: SeatObjectData | null | undefined;
    dateTime: string | undefined;
    hasOrder: boolean;
    orderCheckComplete: boolean;
    formatDateTimeForDisplay: (dt: string | undefined) => string;
};

const SeatInfoCard = ({
    seatId,
    seatInfo,
    dateTime,
    hasOrder,
    orderCheckComplete,
    formatDateTimeForDisplay,
}: SeatInfoCardProps) => {
    return (
        <div className="stachesepl-manager-edit-seat-info">
            <div className="stachesepl-manager-edit-seat-info-header">
                <EventSeat className="stachesepl-manager-edit-seat-info-icon" />
                <div className="stachesepl-manager-edit-seat-info-details">
                    <h3 className="stachesepl-manager-edit-seat-info-title">{seatId}</h3>
                </div>
                {orderCheckComplete && hasOrder && (
                    <div className="stachesepl-manager-edit-seat-taken-badge">
                        <Warning className="stachesepl-manager-edit-seat-taken-icon" />
                        {__('SEAT_ORDERED')}
                    </div>
                )}
            </div>

            {seatInfo && (
                <div className="stachesepl-manager-edit-seat-info-meta">
                    {seatInfo.price !== undefined && (
                        <div className="stachesepl-manager-edit-seat-info-meta-item">
                            <span className="stachesepl-manager-edit-seat-info-meta-label">
                                {__('PRICE')}:
                            </span>
                            <span className="stachesepl-manager-edit-seat-info-meta-value">
                                {getFormattedPrice(seatInfo.price)}
                            </span>
                        </div>
                    )}
                    {dateTime && (
                        <div className="stachesepl-manager-edit-seat-info-meta-item">
                            <span className="stachesepl-manager-edit-seat-info-meta-label">
                                {__('DATE')}:
                            </span>
                            <span className="stachesepl-manager-edit-seat-info-meta-value">
                                {formatDateTimeForDisplay(dateTime)}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeatInfoCard;
