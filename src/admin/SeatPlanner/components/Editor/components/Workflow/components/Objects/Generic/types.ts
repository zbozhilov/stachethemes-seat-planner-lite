import { BaseObjectProps } from "../types";

export interface GenericObjectProps extends BaseObjectProps {
    type: 'generic',
    backgroundColor: string;
    rounded?: boolean;
}