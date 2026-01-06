import { createPortal } from 'react-dom';
import { __, getFormattedPrice } from '@src/utils';
import { SeatTooltipProps } from '../../types';

const SeatTooltip = ({
    visible,
    position,
    seatId,
    isTaken,
    isSelected,
    isUnavailable,
    onSiteOnly,
    backgroundColor,
    price,
}: SeatTooltipProps) => {
    if (!visible) {
        return null;
    }

    const getTagComponent = () => {

        if (isTaken) {
            return (
                <span className="stachesepl-seat-tooltip-tag stachesepl-seat-tooltip-sold-out">
                    {__('SOLD_OUT')}
                </span>
            )
        }

        if (isUnavailable) {
            return (
                <span className="stachesepl-seat-tooltip-tag stachesepl-seat-tooltip-unavailable">
                    {__('UNAVAILABLE')}
                </span>
            )
        }

        if (onSiteOnly) {
            return (
                <span className="stachesepl-seat-tooltip-tag stachesepl-seat-tooltip-onsite">
                    {__('PURCHASABLE_ON_SITE')}
                </span>
            )
        }

        if (isSelected) {
            return (
                <span className="stachesepl-seat-tooltip-tag stachesepl-seat-tooltip-selected">
                    {__('SEAT_SELECTED')}
                </span>
            )
        }

        return null;

    }

    const getIndicatorColor = () => {

        if (isTaken) {
            return 'var(--stachesepl-object-seat-taken-bg-color, #ff6c5f)';
        }

        if (onSiteOnly) {
            return 'var(--stachesepl-object-seat-onsite-bg-color, #f9a852)';
        }

        return backgroundColor;
    }

    return createPortal(
        <div
            className={`stachesepl-seat-tooltip visible ${position.showBelow ? 'below' : ''}`}
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            <span className="stachesepl-seat-tooltip-id">
                <span
                    className="stachesepl-seat-tooltip-id-indicator"
                    style={{
                        background: getIndicatorColor(),
                    }}
                />
                <span className="stachesepl-seat-tooltip-id-text">
                    {__('SEAT')}: {seatId}
                </span>
            </span>

            {
                getTagComponent()
            }

            {(!isTaken && !isUnavailable) && (
                <span className="stachesepl-seat-tooltip-price">
                    <span className="stachesepl-seat-tooltip-price-label">
                        {__('PRICE')}:
                    </span>
                    <span
                        className="stachesepl-seat-tooltip-price-value"
                        dangerouslySetInnerHTML={{
                            __html: getFormattedPrice(Number(price) || 0),
                        }}
                    />
                </span>
            )}
        </div>,
        document.body
    );
};

export default SeatTooltip;

