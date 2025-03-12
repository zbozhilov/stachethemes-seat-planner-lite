import { BaseObjectProps } from "../types";

export interface SeatObjectProps extends BaseObjectProps {
    type: 'seat',
    price: number,
    isHandicap: boolean,
    seatId: string;
    backgroundColor: string;
    rounded?: boolean;
}

export const isSeatObject = (object: BaseObjectProps): object is SeatObjectProps => {
    return object.type === 'seat';
}