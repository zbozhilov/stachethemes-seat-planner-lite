import { DATA_ATTR_INITIALIZED } from '../utils/settings';
const DT_LEGACY_CART_TIMER_SELECTOR = 'dt.variation-stachesepl-cart-timer-key';
const DD_LEGACY_CART_TIMER_SELECTOR = 'dd.variation-stachesepl-cart-timer-key'; 

export const initLegacyCartTimers = () => {

    // Remove DT_LEGACY_CART_TIMER_SELECTOR
    document.querySelectorAll(DT_LEGACY_CART_TIMER_SELECTOR).forEach(dtEl => {

        if (dtEl.getAttribute(DATA_ATTR_INITIALIZED) === '1') {
            return;
        }

        dtEl.remove();
    });

    document.querySelectorAll(DD_LEGACY_CART_TIMER_SELECTOR).forEach(ddEl => {
        const newDTEl = document.createElement('dt');
        newDTEl.classList.add('variation-stachesepl-cart-timer-key');
        newDTEl.innerHTML = ddEl.innerHTML;
        newDTEl.setAttribute(DATA_ATTR_INITIALIZED, '1');
        ddEl.parentNode.insertBefore(newDTEl, ddEl);
        ddEl.remove();
    });


}
