import { TextObjectProps } from "./types";

// The properties of a seat object when it is created
// Move position will be updated when the object is created
export const textProperties: TextObjectProps = {
    id: 0,
    type: 'text',
    label: 'Text',
    move: {
        x: 0,
        y: 0
    },
    size: {
        width: 100,
        height: 50
    },
    color: '#ffffff',
    fontSize: 'medium'
}