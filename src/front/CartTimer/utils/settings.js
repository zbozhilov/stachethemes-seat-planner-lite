/**
 * Global settings and configuration for cart timer
 */
export function getGlobalSettings() {
    if (typeof window === 'undefined' || !window.stacheseplCartTimer) {
        return {};
    }
    return window.stacheseplCartTimer;
}

export function getTimerLabel() {
    const settings = getGlobalSettings();
    return settings.label || 'Time remaining';
}

export function getTimerLabelWithColon() {
    return getTimerLabel() + ':';
}

// Key added to the el container when initialized to guard against double initialization
export const DATA_ATTR_INITIALIZED = 'data-stachesepl-cart-timer-initialized';