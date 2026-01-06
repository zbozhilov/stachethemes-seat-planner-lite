import { BaseObjectProps } from "../types";

export interface ScreenObjectProps extends BaseObjectProps {
    type: 'screen',
    backgroundColor: string;
    roundedValue?: number;
    rounded?: boolean;
}