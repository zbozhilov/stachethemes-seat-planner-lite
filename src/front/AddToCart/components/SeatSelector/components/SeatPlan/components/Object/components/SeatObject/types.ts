import { FrontWorkflowObject } from 'src/front/AddToCart/types';
import { SeatObjectProps as BaseSeatObjectProps, Statuses } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types';

/**
 * Extended seat object type with additional front-end properties
 */
export type FrontSeatObject = BaseSeatObjectProps & {
    taken?: boolean;
    discount?: string;
    group?: string;
    customFields?: Record<string, string | number | boolean>;
};

/**
 * Type guard to check if a workflow object is a seat object
 */
export const isSeatObject = (data: FrontWorkflowObject): data is FrontSeatObject => {
    return data.type === 'seat';
};

export interface SeatObjectComponentProps {
    data: FrontWorkflowObject;
    selectedSeats: string[];
    style: React.CSSProperties;
    handleSeatSelectToggle: (seatId: string) => void;
    handleSeatTakenCheck: (seatId: string) => void;
    canViewSeatOrders: boolean;
}

export interface TooltipPosition {
    top: number;
    left: number;
    showBelow: boolean;
}

export interface SeatStatus {
    isTaken: boolean;
    isUnavailable: boolean;
    onSiteOnly: boolean;
    isClickable: boolean;
    isSelected: boolean;
}

export interface SeatTooltipProps {
    visible: boolean;
    position: TooltipPosition;
    seatId: string;
    isTaken: boolean;
    isSelected: boolean;
    isUnavailable: boolean;
    onSiteOnly: boolean;
    backgroundColor: string;
    price: string | number;
}

