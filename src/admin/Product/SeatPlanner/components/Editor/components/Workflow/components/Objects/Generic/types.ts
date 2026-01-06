import { BaseObjectProps, TextDirection } from "../types";

export interface GenericObjectProps extends BaseObjectProps {
    type: 'generic',
    backgroundColor: string;
    rounded?: boolean;
    roundedValue?: number;
    textDirection?: TextDirection;
}