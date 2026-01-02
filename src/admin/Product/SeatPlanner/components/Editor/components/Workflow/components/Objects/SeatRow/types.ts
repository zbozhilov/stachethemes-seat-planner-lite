import { SeatObjectProps } from "../Seat/types";
import { BaseObjectProps } from "../types";

export type Statuses = 'available' | 'unavailable' | 'on-site' | 'sold-out'; 

export interface SeatRowObjectProps extends BaseObjectProps {
    type: 'seat-row',
    // Seats that reside in this object
    seats: SeatObjectProps[],
}

export const isSeatRowObject = (object: BaseObjectProps): object is SeatRowObjectProps => {
    return object.type === 'seat-row';
}