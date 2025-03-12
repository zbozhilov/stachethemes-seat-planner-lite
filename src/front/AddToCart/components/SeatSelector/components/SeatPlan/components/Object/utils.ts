import { FrontWorkflowObject } from "@src/front/AddToCart/types";

export const hasBackgroundColor = (object: unknown): object is { backgroundColor: string } => {
    return typeof object === 'object' && object !== null && 'backgroundColor' in object;
};

export const getFontSizeByType = (type: 'small' | 'medium' | 'large') => {
    switch (type) {
        case 'small':
            return '12px';
        case 'medium':
            return '14px';
        case 'large':
            return '16px';
    }
}

export function isRounded(object: FrontWorkflowObject): object is FrontWorkflowObject & { rounded: boolean } {
    return 'rounded' in object && object.rounded !== undefined && object.rounded;
}