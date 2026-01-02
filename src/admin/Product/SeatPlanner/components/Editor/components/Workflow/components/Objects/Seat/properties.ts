import { SeatObjectProps } from "./types";

// The properties of a seat object when it is created
// Move position will be updated when the object is created
export const seatProperties: SeatObjectProps = {
    id: 0,
    type: 'seat',
    label: 'Seat',
    group: '',
    move: {
        x: 0,
        y: 0
    },
    size: {
        width: 50,
        height: 50
    },
    isHandicap: false,
    seatId: '',
    price: 0,
    color: '#000000',
    backgroundColor: '#f4f4f4',
    fontSize: 'medium',
    fontWeight: 'normal',
    zIndex: 0
}