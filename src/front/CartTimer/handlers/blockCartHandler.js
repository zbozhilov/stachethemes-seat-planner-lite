import { isSeatPlannerTimerLabel } from '../utils/labelUtils.js';
import { attachSeatPlannerTimer } from '../timer/timerManager.js';

const BLOCK_NAME_SELECTOR = 'span.wc-block-components-product-details__name';
const BLOCK_VALUE_SELECTOR = '.wc-block-components-product-details__value';
const TIMER_CLASS = 'stachesepl-cart-timer';
const TIMER_ROW_CLASS = 'stachesepl-cart-timer-row';
const TIMER_LABEL_CLASS = 'stachesepl-cart-timer-label';

/**
 * Handle block-based cart item details markup:
 * <li class="wc-block-components-product-details__...">
 *   <span class="wc-block-components-product-details__name">Reservation expires in:</span>
 *   <span class="wc-block-components-product-details__value">02:00</span>
 * </li>
 */
export function initBlockCartTimers() {
    const blockNameEls = document.querySelectorAll(BLOCK_NAME_SELECTOR);
    
    blockNameEls.forEach(function (nameEl) {
        const label = (nameEl.textContent || '').trim();
        if (!isSeatPlannerTimerLabel(label)) {
            return;
        }

        const item = nameEl.closest ? nameEl.closest('li') : nameEl.parentElement;
        if (!item) {
            return;
        }

        const valueEl = item.querySelector(BLOCK_VALUE_SELECTOR);
        if (!valueEl) {
            return;
        }

        // Preserve custom class names for styling / targeting.
        valueEl.classList.add(TIMER_CLASS);
        item.classList.add(TIMER_ROW_CLASS);

        // Add a helper class to the label inside the row (if present)
        // so themes can easily style it.
        const nameSpan = item.querySelector(BLOCK_NAME_SELECTOR);
        if (nameSpan) {
            nameSpan.classList.add(TIMER_LABEL_CLASS);
        }

        attachSeatPlannerTimer(valueEl);
    });
}

