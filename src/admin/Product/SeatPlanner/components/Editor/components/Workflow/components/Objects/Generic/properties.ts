import { GenericObjectProps } from "./types";

// The properties of a seat object when it is created
// Move position will be updated when the object is created
export const genericProperties: GenericObjectProps = {
    id: 0,
    type: 'generic',
    label: 'Object',
    move: {
        x: 0,
        y: 0
    },
    size: {
        width: 100,
        height: 100
    },
    color: '#000000',
    backgroundColor: '#f4f4f4',
    fontSize: 'medium',
    zIndex: 0
}