/**
 * Parse time value from text content
 * Supports:
 * - UNIX timestamp (seconds since epoch)
 * - Legacy "MM:SS" formatted value
 *
 * @param {string} timeText - The text content to parse
 * @returns {number|null} - UNIX timestamp (seconds) or null if invalid
 */
export function parseTimeValue(timeText) {
    if (!timeText) {
        return null;
    }

    const trimmed = timeText.trim();

    // First, try to interpret the value as a UNIX timestamp (seconds since epoch).
    const asInt = parseInt(trimmed, 10);
    if (!isNaN(asInt) && String(asInt) === trimmed) {
        return asInt;
    }

    // Fallback: support a legacy "MM:SS" formatted value.
    const parts = trimmed.split(':');
    if (parts.length !== 2) {
        return null;
    }

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) {
        return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const remainingFromNow = minutes * 60 + seconds;
    return now + remainingFromNow;
}

/**
 * Format seconds into a time string
 * - HH:mm:ss if time remaining is greater than an hour
 * - MM:SS for times less than an hour
 *
 * @param {number} totalSeconds - Total seconds to format
 * @returns {string} - Formatted time string
 */
export function formatTime(totalSeconds) {
    // Display HH:mm:ss if time remaining is greater than an hour
    if (totalSeconds >= 3600) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    } else {
        // Display MM:SS for times less than an hour
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
}

/**
 * Get current time in seconds (UNIX timestamp)
 *
 * @returns {number} - Current time in seconds
 */
export function getCurrentTimeSeconds() {
    return Math.floor(Date.now() / 1000);
}

