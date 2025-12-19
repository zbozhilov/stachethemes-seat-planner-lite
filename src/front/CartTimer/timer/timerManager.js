import { parseTimeValue, formatTime, getCurrentTimeSeconds } from '../utils/timeUtils.js';

const TIMER_INIT_ATTR = 'data-stachesepl-timer-init';
const CRITICAL_CLASS = 'stachesepl-cart-timer--critical';
const CRITICAL_THRESHOLD = 5 * 60; // 5 minutes

/**
 * Update timer element color based on remaining time
 *
 * @param {HTMLElement} valueEl - The timer element
 * @param {number} remainingSeconds - Remaining seconds
 */
function updateTimerColor(valueEl, remainingSeconds) {
    // Keep the base style on the value element and toggle a
    // "critical" modifier class below 1 minute.
    if (remainingSeconds < CRITICAL_THRESHOLD) {
        valueEl.classList.add(CRITICAL_CLASS);
    } else {
        valueEl.classList.remove(CRITICAL_CLASS);
    }
}

/**
 * Attach a countdown timer to a given element containing either:
 * - a UNIX timestamp (seconds since epoch), or
 * - a fallback "MM:SS" time string (for backwards compatibility).
 *
 * @param {HTMLElement} valueEl - The element to attach the timer to
 */
export function attachSeatPlannerTimer(valueEl) {
    if (!valueEl || !valueEl.textContent) {
        return;
    }

    // Prevent attaching multiple timers to the same element
    if (valueEl.getAttribute(TIMER_INIT_ATTR) === '1') {
        return;
    }
    valueEl.setAttribute(TIMER_INIT_ATTR, '1');

    const timeText = (valueEl.textContent || '').trim();
    const expiresAt = parseTimeValue(timeText);

    if (!expiresAt) {
        return;
    }

    const nowCheck = getCurrentTimeSeconds();
    if (expiresAt <= nowCheck) {
        return;
    }

    function tick() {
        const now = getCurrentTimeSeconds();
        const remaining = expiresAt - now;

        if (remaining <= 0) {
            valueEl.textContent = '00:00';
            valueEl.classList.add(CRITICAL_CLASS);
            return;
        }

        updateTimerColor(valueEl, remaining);
        valueEl.textContent = formatTime(remaining);

        window.setTimeout(tick, 1000);
    }

    // Start the countdown
    tick();
}

