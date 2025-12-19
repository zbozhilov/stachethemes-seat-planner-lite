import { getTimerLabel, getTimerLabelWithColon } from './settings.js';

/**
 * Normalize and check if a given label text matches the current translated label
 *
 * @param {string} text
 * @returns {boolean}
 */
export function isSeatPlannerTimerLabel(text) {
    if (!text) {
        return false;
    }

    const trimmed = text.trim();
    const seatPlannerTimerLabel = getTimerLabel();
    const seatPlannerTimerLabelWithColon = getTimerLabelWithColon();

    // Match the current translated label, with or without colon.
    if (trimmed === seatPlannerTimerLabel || trimmed === seatPlannerTimerLabelWithColon) {
        return true;
    }

    return false;
}

