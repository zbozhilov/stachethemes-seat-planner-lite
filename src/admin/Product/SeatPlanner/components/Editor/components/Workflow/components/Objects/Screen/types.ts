import { BaseObjectProps } from "../types";

export interface ScreenObjectProps extends BaseObjectProps {
    type: 'screen',
    backgroundColor: string;
}