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