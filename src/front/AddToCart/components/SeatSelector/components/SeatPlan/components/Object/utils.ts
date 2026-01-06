import { FrontWorkflowObject } from "@src/front/AddToCart/types";
import { MAX_ROUNDED_VALUE } from "@src/utils";

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

// rounded is legacy property, roundedValue is the new property
export function isRounded(object: FrontWorkflowObject): object is FrontWorkflowObject & { rounded: boolean } {
    if ('roundedValue' in object && object.roundedValue !== undefined) {
        return false;
    }

    return 'rounded' in object && object.rounded !== undefined && object.rounded;
}

export function isRoundedValue(object: FrontWorkflowObject): object is FrontWorkflowObject & { roundedValue: number } {
    return 'roundedValue' in object && object.roundedValue !== undefined && object.roundedValue !== 0;
}

type TextDirection = 'horizontal' | 'vertical-upright' | 'rotated-cw';

export function getTextDirectionStyles(object: FrontWorkflowObject): React.CSSProperties {
    if (!('textDirection' in object) || !object.textDirection || object.textDirection === 'horizontal') {
        return {};
    }

    const textDirection = object.textDirection as TextDirection;

    switch (textDirection) {
        case 'vertical-upright':
            return {
                writingMode: 'vertical-rl',
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

export function getObjectStyle(data: FrontWorkflowObject): React.CSSProperties {
    const style: React.CSSProperties = {
        left: data.move.x,
        top: data.move.y,
        width: data.size.width,
        height: data.size.height,
        color: data.color,
        fontSize: getFontSizeByType(data.fontSize),
        fontWeight: data.fontWeight ?? 'normal',
        zIndex: data.zIndex ?? 0,
        backgroundColor: hasBackgroundColor(data) ? data.backgroundColor : 'transparent',
        borderRadius: isRounded(data) ? `${MAX_ROUNDED_VALUE}px` : isRoundedValue(data) ? `${data.roundedValue}px` : undefined
    };

    const textDirectionStyles = getTextDirectionStyles(data);
    Object.assign(style, textDirectionStyles);

    return style;
}