import './index.scss';
import { initBlockCartTimers } from './handlers/blockCartHandler.js';
import { initLegacyCartTimers } from './handlers/legacyCartHandler.js';
import { initTimer } from './handlers/timerHandler.js';
import { attachSeatPlannerTimer } from './timer/timerManager.js';

/**
 * Initialize all cart reservation timers
 */
function initSeatPlannerReservationTimers() {
    // Block-based cart item details markup
    initBlockCartTimers();

    // Legacy / classic cart and mini-cart markup
    initLegacyCartTimers();

    // Timer elements
    initTimer();

}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeatPlannerReservationTimers);
} else {
    initSeatPlannerReservationTimers();
}

// For block-based carts and any AJAX-loaded cart content, observe
// the DOM for changes and re-run the initializer when relevant timer elements are added.
if (window.MutationObserver) {

    // Selector that indicates timer-related elements we care about
    const TIMER_SELECTOR = '.stachesepl-cart-timer';

    // Debounce timer to batch rapid mutations
    let debounceTimer = null;
    const DEBOUNCE_DELAY = 100; // 100ms debounce

    const observer = new MutationObserver(function (mutations) {
        // Collect all newly added timer elements
        const newTimerElements = new Set();

        for (const mutation of mutations) {
            if (!mutation.addedNodes || !mutation.addedNodes.length) {
                continue;
            }

            // Check if any added node matches our timer selectors
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the node itself matches
                    if (node.matches && node.matches(TIMER_SELECTOR)) {
                        newTimerElements.add(node);
                    }
                    // Check if any descendant matches
                    if (node.querySelector) {
                        const found = node.querySelectorAll(TIMER_SELECTOR);

                        if (found.length > 0) {
                            found.forEach(timerEl => {
                                newTimerElements.add(timerEl);
                            });
                        }
                    }
                }
            }
        }

        // If we found new timer elements, debounce the initialization
        if (newTimerElements.size > 0) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                // These tranforms the contents
                initBlockCartTimers();
                initLegacyCartTimers();

                // Process only newly added timers directly (most efficient)
                newTimerElements.forEach(timerEl => {
                    attachSeatPlannerTimer(timerEl);
                });
            }, DEBOUNCE_DELAY);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
