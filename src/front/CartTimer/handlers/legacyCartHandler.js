import { isSeatPlannerTimerLabel } from '../utils/labelUtils.js';
import { attachSeatPlannerTimer } from '../timer/timerManager.js';

const LEGACY_LABEL_SELECTOR = '.variation-Timeremaining';
const PROCESSED_ATTR = 'data-stachesepl-timer-processed';
const TIMER_CLASS = 'stachesepl-cart-timer';
const TIMER_ROW_CLASS = 'stachesepl-cart-timer-row';
const TIMER_LABEL_CLASS = 'stachesepl-cart-timer-label';

/**
 * Find the corresponding value element for a legacy label element
 *
 * @param {HTMLElement} labelEl - The label element
 * @returns {HTMLElement|null} - The value container element or null
 */
function findValueContainer(labelEl) {
    // Find the corresponding value element. In WooCommerce's
    // default markup this is the very next sibling with the
    // same "variation-Timeremaining" class, but we keep this
    // a bit more defensive and walk forward until we find one.
    let valueContainer = labelEl.nextElementSibling;
    while (valueContainer && !valueContainer.classList.contains('variation-Timeremaining')) {
        valueContainer = valueContainer.nextElementSibling;
    }

    return valueContainer;
}

/**
 * Get the value element from a container
 *
 * @param {HTMLElement} valueContainer - The container element
 * @returns {HTMLElement|null} - The value element or null
 */
function getValueElement(valueContainer) {
    // Inside the container, prefer a <p> (default Woo markup),
    // but gracefully fall back to other common inline elements
    // or the container itself so this keeps working even if a
    // theme changes the exact tags.
    return valueContainer.querySelector('p, span, strong, b') || valueContainer;
}

/**
 * Transform legacy markup into modern structure
 *
 * @param {HTMLElement} labelEl - The label element to transform
 * @param {HTMLElement} valueEl - The value element
 */
function transformLegacyMarkup(labelEl, valueEl) {
    // At this point we want to transform the original legacy:
    //
    //   <dt class="variation-Timeremaining">Time remaining:</dt>
    //   <dd class="variation-Timeremaining"><p>04:15</p></dd>
    //
    // into:
    //
    //   <dt class="variation-Timeremaining stachesepl-cart-timer-row">
    //     <span class="stachesepl-cart-timer-label">Time remaining:</span>
    //     <span class="stachesepl-cart-timer" data-stachesepl-timer-init="1">04:15</span>
    //   </dt>
    //
    // so that legacy themes use the same internal structure as
    // our "modern" markup.

    const labelText = (labelEl.textContent || '').trim();

    // Mark as processed so repeated initializations don't
    // keep re-writing the DOM tree.
    labelEl.setAttribute(PROCESSED_ATTR, '1');

    // Use the existing label element as the "row" container.
    labelEl.classList.add(TIMER_ROW_CLASS);

    // Build the label span.
    const labelSpan = document.createElement('span');
    labelSpan.classList.add(TIMER_LABEL_CLASS);
    // Normalise the label text so it always ends with a colon.
    const baseLabel = isSeatPlannerTimerLabel(labelText) ?
        labelText.replace(/:$/, '') :
        labelText;
    labelSpan.textContent = baseLabel + ':';

    // Build the value / countdown span.
    const timerSpan = document.createElement('span');
    timerSpan.classList.add(TIMER_CLASS);
    timerSpan.textContent = (valueEl.textContent || '').trim();

    // Clear the original label contents and inject the new structure.
    while (labelEl.firstChild) {
        labelEl.removeChild(labelEl.firstChild);
    }
    labelEl.appendChild(labelSpan);
    labelEl.appendChild(timerSpan);

    // Attach the countdown behaviour to the new timer span.
    attachSeatPlannerTimer(timerSpan);
}

/**
 * Handle legacy / classic cart and mini-cart markup where WooCommerce
 * renders item meta inside a <dl class="variation"> list and
 * the label / value pairs are identified via classes derived
 * from the meta name, for example:
 *
 * <dt class="variation-Timeremaining">Time remaining:</dt>
 * <dd class="variation-Timeremaining"><p>1763671856</p></dd>
 */
export function initLegacyCartTimers() {
    const legacyTextLabels = document.querySelectorAll(LEGACY_LABEL_SELECTOR);
    
    legacyTextLabels.forEach(function (labelEl) {
        const labelText = (labelEl.textContent || '').trim();

        // Avoid re-processing the same node when the initializer
        // is triggered multiple times (e.g. via MutationObserver).
        if (labelEl.getAttribute(PROCESSED_ATTR) === '1') {
            return;
        }

        // Only treat this element as the label if its text matches
        // the current translated "Time remaining" label.
        if (!isSeatPlannerTimerLabel(labelText)) {
            return;
        }

        const valueContainer = findValueContainer(labelEl);
        if (!valueContainer) {
            return;
        }

        const valueEl = getValueElement(valueContainer);
        if (!valueEl || !valueEl.textContent) {
            return;
        }

        // Transform the legacy markup
        transformLegacyMarkup(labelEl, valueEl);

        // Remove the old value container (dd) from the DOM.
        if (valueContainer.parentNode) {
            valueContainer.parentNode.removeChild(valueContainer);
        }
    });
}

