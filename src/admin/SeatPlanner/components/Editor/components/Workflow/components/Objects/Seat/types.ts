import { BaseObjectProps } from "../types";

export type Statuses = 'available' | 'unavailable' | 'on-site' | 'sold-out'; 

export interface SeatObjectProps extends BaseObjectProps {
    type: 'seat',
    price: number,
    isHandicap: boolean,
    seatId: string;
    backgroundColor: string;
    group?: string;
    rounded?: boolean;
    status?: Statuses;
    outlineError?: boolean;
}

export const isSeatObject = (object: BaseObjectProps): object is SeatObjectProps => {
    return object.type === 'seat';
}