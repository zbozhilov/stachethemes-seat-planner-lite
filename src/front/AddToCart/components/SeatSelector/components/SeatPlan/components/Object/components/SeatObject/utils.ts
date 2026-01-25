import { isTouchDevice } from '@src/utils';
import { FrontSeatObject, SeatStatus, TooltipPosition } from './types';

/**
 * Determines if the tooltip should be disabled
 * (disabled on mobile/touch devices or if explicitly disabled via global config)
 */
export const getIsTooltipDisabled = (): boolean => {
    return window.stacheseplSeatTooltip === 'no' || isTouchDevice();
};

/**
 * Calculates the optimal position for the tooltip to avoid viewport overflow
 */
export const calculateTooltipPosition = (
    seatElement: HTMLElement | null
): TooltipPosition => {
    if (!seatElement) {
        return { top: 0, left: 0, showBelow: false };
    }

    const rect = seatElement.getBoundingClientRect();
    const tooltipHeight = 100; // Approximate tooltip height
    const tooltipWidth = 150; // Approximate tooltip width
    const padding = 12;

    let top = rect.top + window.scrollY;
    let left = rect.left + rect.width / 2 + window.scrollX;
    let showBelow = false;

    // Check if tooltip would go above viewport
    if (rect.top < tooltipHeight + padding) {
        showBelow = true;
        top = rect.bottom + window.scrollY;
    }

    // Check if tooltip would go off left edge
    if (left - tooltipWidth / 2 < padding) {
        left = tooltipWidth / 2 + padding;
    }

    // Check if tooltip would go off right edge
    if (left + tooltipWidth / 2 > window.innerWidth - padding) {
        left = window.innerWidth - tooltipWidth / 2 - padding;
    }

    return { top, left, showBelow };
};

/**
 * Computes the status flags for a seat object
 * @param data - Must be a valid seat object (use isSeatObject type guard first)
 */
export const getSeatStatus = (
    data: FrontSeatObject,
    selectedSeats: string[],
    canViewSeatOrders: boolean
): SeatStatus => {

    const isTaken = data.taken || data.status === 'sold-out';
    const isUnavailable = !data.seatId || data.status === 'unavailable' || data.status === 'sold-out';
    const onSiteOnly = data.status === 'on-site' && !data.taken;
    const isClickable = (isTaken && canViewSeatOrders) || !isUnavailable && !!data.seatId;
    const isSelected = selectedSeats.includes(data.seatId);

    return {
        isTaken,
        isUnavailable,
        onSiteOnly,
        isClickable,
        isSelected,
    };
};

/**
 * Generates the CSS class names array for the seat element
 */
export const getSeatClassNames = (status: SeatStatus, extraClass?: string): string[] => {
    return [
        'stachesepl-object',
        'stachesepl-object-seat',
        status.isSelected && 'selected',
        status.isUnavailable && 'disabled',
        status.isTaken && 'taken',
        !status.isTaken && status.onSiteOnly && 'onsite',
        status.isClickable && 'clickable',
        extraClass && extraClass,
    ].filter(Boolean) as string[];
};
