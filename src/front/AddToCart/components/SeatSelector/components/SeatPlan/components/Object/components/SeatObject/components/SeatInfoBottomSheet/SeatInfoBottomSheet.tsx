import { Close } from '@mui/icons-material';
import { createPortal } from 'react-dom';
import { __, getFormattedPrice } from '@src/utils';
import { useEffect, useRef } from 'react';
import './SeatInfoBottomSheet.scss';

export interface SeatInfoBottomSheetProps {
    open: boolean;
    seatId: string;
    isTaken: boolean;
    isSelected: boolean;
    isUnavailable: boolean;
    onSiteOnly: boolean;
    backgroundColor: string;
    price: string | number;
    canViewSeatOrders: boolean;
    onClose: () => void;
    onSelect: () => void;
    onViewOrder: () => void;
}

const SeatInfoBottomSheet = ({
    open,
    seatId,
    isTaken,
    isSelected,
    isUnavailable,
    onSiteOnly,
    backgroundColor,
    price,
    canViewSeatOrders,
    onClose,
    onSelect,
    onViewOrder,
}: SeatInfoBottomSheetProps) => {
    const sheetRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            // Prevent body scroll when bottom sheet is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                open &&
                backdropRef.current &&
                event.target === backdropRef.current
            ) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (open && event.key === 'Escape') {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const getTagComponent = () => {
        if (isTaken) {
            return (
                <span className="stachesepl-seat-info-bottom-sheet-tag stachesepl-seat-info-bottom-sheet-sold-out">
                    {__('SOLD_OUT')}
                </span>
            );
        }

        if (isUnavailable) {
            return (
                <span className="stachesepl-seat-info-bottom-sheet-tag stachesepl-seat-info-bottom-sheet-unavailable">
                    {__('UNAVAILABLE')}
                </span>
            );
        }

        if (onSiteOnly) {
            return (
                <span className="stachesepl-seat-info-bottom-sheet-tag stachesepl-seat-info-bottom-sheet-onsite">
                    {__('PURCHASABLE_ON_SITE')}
                </span>
            );
        }

        if (isSelected) {
            return (
                <span className="stachesepl-seat-info-bottom-sheet-tag stachesepl-seat-info-bottom-sheet-selected">
                    {__('SEAT_SELECTED')}
                </span>
            );
        }

        return null;
    };

    const getIndicatorColor = () => {
        if (isTaken) {
            return 'var(--stachesepl-object-seat-taken-bg-color, #ff6c5f)';
        }

        if (onSiteOnly) {
            return 'var(--stachesepl-object-seat-onsite-bg-color, #f9a852)';
        }

        return backgroundColor;
    };

    const canSelect = !isTaken && !isUnavailable && !onSiteOnly;
    const buttonText = isSelected ? `${__('REMOVE')}` : __('SELECT_SEAT');

    const handleViewOrder = () => {
        onViewOrder();
    };

    return createPortal(
        <>
            <div
                ref={backdropRef}
                className="stachesepl-seat-info-bottom-sheet-backdrop"
            />
            <div
                ref={sheetRef}
                className="stachesepl-seat-info-bottom-sheet"
            >
                <div className="stachesepl-seat-info-bottom-sheet-handle" />

                <button
                    className="stachesepl-seat-info-bottom-sheet-close"
                    onClick={onClose}
                    aria-label={__('CLOSE')}
                >
                    <Close />
                </button>

                <div className="stachesepl-seat-info-bottom-sheet-content">
                    <div className="stachesepl-seat-info-bottom-sheet-header">
                        <span className="stachesepl-seat-info-bottom-sheet-id">
                            <span
                                className="stachesepl-seat-info-bottom-sheet-id-indicator"
                                style={{
                                    background: getIndicatorColor(),
                                }}
                            />
                            <span className="stachesepl-seat-info-bottom-sheet-id-text">
                                {__('SEAT')}: {seatId}
                            </span>
                        </span>
                        {getTagComponent()}
                    </div>

                    {isTaken && (
                        <>
                            <div className="stachesepl-seat-info-bottom-sheet-message stachesepl-seat-info-bottom-sheet-sold-out-message">
                                {__('THIS_SEAT_IS_TAKEN')}
                            </div>
                            {canViewSeatOrders && (

                                <button
                                    className="stachesepl-seat-info-bottom-sheet-button secondary"
                                    onClick={handleViewOrder}
                                >
                                    {__('VIEW_DETAILS')}
                                </button>
                            )}
                        </>
                    )}

                    {isUnavailable && !isTaken && (
                        <div className="stachesepl-seat-info-bottom-sheet-message stachesepl-seat-info-bottom-sheet-unavailable-message">
                            {__('THIS_SEAT_IS_UNAVAILABLE')}
                        </div>
                    )}

                    {onSiteOnly && (
                        <div className="stachesepl-seat-info-bottom-sheet-message stachesepl-seat-info-bottom-sheet-onsite-message">
                            {__('THIS_SEAT_IS_ONLY_AVAILABLE_ON_SITE')}
                        </div>
                    )}

                    {canSelect && (
                        <div className="stachesepl-seat-info-bottom-sheet-price">
                            <span className="stachesepl-seat-info-bottom-sheet-price-label">
                                {__('PRICE')}:
                            </span>
                            <span
                                className="stachesepl-seat-info-bottom-sheet-price-value"
                                dangerouslySetInnerHTML={{
                                    __html: getFormattedPrice(Number(price) || 0),
                                }}
                            />
                        </div>
                    )}

                    {canSelect && (
                        <button
                            className="stachesepl-seat-info-bottom-sheet-button"
                            onClick={onSelect}
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};

export default SeatInfoBottomSheet;
