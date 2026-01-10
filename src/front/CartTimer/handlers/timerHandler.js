import { attachSeatPlannerTimer } from '../timer/timerManager.js';

const TIMER_SELECTOR = '.stachesepl-cart-timer';

/**
 * Handle timer elements that third-parties or custom templates
 * can opt-in to by adding the ".stachesepl-cart-timer" class to any
 * element that contains either a UNIX timestamp or "MM:SS" formatted value.
 *
 * This runs after the block and legacy transformations so our own markup
 * is also covered, but attachSeatPlannerTimer() itself guards against
 * double-initialization via a data attribute.
 */
export function initTimer() {
    const timerEls = document.querySelectorAll(TIMER_SELECTOR);
    
    timerEls.forEach(function (timerEl) {
        attachSeatPlannerTimer(timerEl);
    });
}

