import './index.scss';
import { initBlockCartTimers } from './handlers/blockCartHandler.js';
import { initLegacyCartTimers } from './handlers/legacyCartHandler.js';
import { initCustomTimers } from './handlers/customTimerHandler.js';

/**
 * Initialize all cart reservation timers
 */
function initSeatPlannerReservationTimers() {
    // Block-based cart item details markup
    initBlockCartTimers();

    // Legacy / classic cart and mini-cart markup
    initLegacyCartTimers();

    // Custom timer elements (opt-in)
    initCustomTimers();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeatPlannerReservationTimers);
} else {
    initSeatPlannerReservationTimers();
}

// For block-based carts and any AJAX-loaded cart content, observe
// the DOM for changes and re-run the initializer when nodes are added.
if (window.MutationObserver) {
    const observer = new MutationObserver(function (mutations) {
        let shouldReinit = false;

        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length) {
                shouldReinit = true;
            }
        });

        if (shouldReinit) {
            initSeatPlannerReservationTimers();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
