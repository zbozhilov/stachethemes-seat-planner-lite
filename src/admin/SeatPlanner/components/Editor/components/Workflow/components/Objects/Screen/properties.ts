import { ScreenObjectProps } from "./types";

// The properties of a seat object when it is created
// Move position will be updated when the object is created
export const screenProperties: ScreenObjectProps = {
    id: 0,
    type: 'screen',
    label: 'Screen',
    move: {
        x: 0,
        y: 0
    },
    size: {
        width: 620,
        height: 50
    },
    color: '#000000',
    backgroundColor: '#f4f4f4',
    fontSize: 'medium'
}