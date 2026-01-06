import { GenericObjectProps } from "./Generic/types";
import { ScreenObjectProps } from "./Screen/types";
import { SeatObjectProps } from "./Seat/types";
import { SeatRowObjectProps } from "./SeatRow/types";
import { TextObjectProps } from "./Text/types";

export type ObjectTypes = 'seat' | 'generic' | 'screen' | 'text' | 'seat-row';

export interface MovableProps {
    x: number;
    y: number;
}

export interface SizeProps {
    width: number;
    height: number; 
}

export interface BaseObjectProps {
    id: number;
    type: ObjectTypes,
    move: MovableProps,
    size: SizeProps,
    fontSize: 'small' | 'medium' | 'large',
    fontWeight: 'lighter' | 'normal' | 'bold' | 'bolder',
    label: string,
    color: string,
    zIndex?: number,
    locked?: boolean,
    extraClass?: string,
}

export function hasBackgroundColor(object: WorkflowObject): object is (GenericObjectProps | ScreenObjectProps | SeatObjectProps) {
    return 'backgroundColor' in object;
}

export function isRounded(object: WorkflowObject): object is (GenericObjectProps | ScreenObjectProps | SeatObjectProps) {

    if ('roundedValue' in object && object.roundedValue !== undefined) {
        return false;
    }

    return 'rounded' in object && object.rounded !== undefined && object.rounded;
}

export function isRoundedValue(object: WorkflowObject): object is (GenericObjectProps | SeatObjectProps) {
    return 'roundedValue' in object && object.roundedValue !== undefined && object.roundedValue !== 0;
}

export type TextDirection = 'horizontal' | 'vertical-upright' | 'rotated-cw';

export function getTextDirectionStyles(object: WorkflowObject): React.CSSProperties {
    if (!('textDirection' in object) || !object.textDirection || object.textDirection === 'horizontal') {
        return {};
    }

    switch (object.textDirection) {
        case 'vertical-upright':
            return {
                writingMode: 'vertical-lr',
                textOrientation: 'upright',
            };
        case 'rotated-cw':
            return {
                writingMode: 'vertical-rl',
                textOrientation: 'sideways',
                letterSpacing: '0.2rem',
            };
        default:
            return {};
    }
}

export type WorkflowObject = SeatObjectProps | GenericObjectProps | ScreenObjectProps | TextObjectProps | SeatRowObjectProps