import { SeatRowObjectProps } from "./types";

export const seatRowProperties: SeatRowObjectProps = {
    id: 0,
    type: 'seat-row',
    label: 'Seat Row',
    move: {
        x: 0,
        y: 0
    },
    size: {
        width: 50,
        height: 50
    },
    color: '#fff',
    fontSize: 'medium',
    fontWeight: 'normal',
    zIndex: 0,
    seats: []
}