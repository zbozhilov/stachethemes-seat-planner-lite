import { DATA_ATTR_INITIALIZED } from '../utils/settings';
const BLOCK_CART_TIMER_SELECTOR = '.wc-block-components-product-details__stachesepl-cart-timer-key';
const REMOVE_NAME_SELECTOR = '.wc-block-components-product-details__name';

export function initBlockCartTimers() {

    const blockCartTimerContainers = document.querySelectorAll(BLOCK_CART_TIMER_SELECTOR);
    
    blockCartTimerContainers.forEach(function (container) {

        if (container.getAttribute(DATA_ATTR_INITIALIZED) === '1') {
            return;
        }

        container.setAttribute(DATA_ATTR_INITIALIZED, '1');

        const nameEl = container.querySelector(REMOVE_NAME_SELECTOR);

        if (nameEl) {
            nameEl.remove();
        }

    });
}