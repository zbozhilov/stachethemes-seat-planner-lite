import { BaseObjectProps, TextDirection } from "../types";

export interface TextObjectProps extends BaseObjectProps {
    type: 'text',
    textDirection?: TextDirection;
}