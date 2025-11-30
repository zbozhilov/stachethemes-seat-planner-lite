import { GenericObjectProps } from "./Generic/types";
import { ScreenObjectProps } from "./Screen/types";
import { SeatObjectProps } from "./Seat/types";
import { TextObjectProps } from "./Text/types";

export type ObjectTypes = 'seat' | 'generic' | 'screen' | 'text';

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
    label: string,
    color: string,
    zIndex?: number,
}

export function hasBackgroundColor(object: WorkflowObject): object is (GenericObjectProps | ScreenObjectProps | SeatObjectProps) {
    return 'backgroundColor' in object;
}

export function isRounded(object: WorkflowObject): object is (GenericObjectProps | ScreenObjectProps | SeatObjectProps) {
    return 'rounded' in object && object.rounded !== undefined && object.rounded;
}

export type WorkflowObject = SeatObjectProps | GenericObjectProps | ScreenObjectProps | TextObjectProps