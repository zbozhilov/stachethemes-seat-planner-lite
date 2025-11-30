import './index.scss';

(function () {
    // Current translated label (without colon) as rendered by PHP and passed via wp_localize_script.
    const globalSettings = (typeof window !== 'undefined' && window.stacheseplCartTimer) ? window.stacheseplCartTimer : {};
    const seatPlannerTimerLabel = globalSettings.label || 'Time remaining';
    const seatPlannerTimerLabelWithColon = seatPlannerTimerLabel + ':';

    /**
     * Normalize and check if a given label text matches the current translated label
     *
     * @param {string} text
     * @returns {boolean}
     */
    function isSeatPlannerTimerLabel(text) {
        if (!text) {
            return false;
        }

        const trimmed = text.trim();

        // Match the current translated label, with or without colon.
        if (trimmed === seatPlannerTimerLabel || trimmed === seatPlannerTimerLabelWithColon) {
            return true;
        }

        return false;
    }

    function initSeatPlannerReservationTimers() {
        /**
         * Shared helper to attach a countdown timer to a given
         * element containing either:
         * - a UNIX timestamp (seconds since epoch), or
         * - a fallback "MM:SS" time string (for backwards compatibility).
         */
        function attachSeatPlannerTimer(valueEl) {
            if (!valueEl || !valueEl.textContent) {
                return;
            }

            // Prevent attaching multiple timers to the same element
            if (valueEl.getAttribute('data-stachesepl-timer-init') === '1') {
                return;
            }
            valueEl.setAttribute('data-stachesepl-timer-init', '1');

            const timeText = (valueEl.textContent || '').trim();
            let expiresAt = 0; // UNIX timestamp (seconds since epoch) when the reservation ends

            // First, try to interpret the value as a UNIX timestamp (seconds since epoch).
            const asInt = parseInt(timeText, 10);
            if (!isNaN(asInt) && String(asInt) === timeText) {
                expiresAt = asInt;
            } else {
                // Fallback: support a legacy "MM:SS" formatted value.
                const parts = timeText.split(':');
                if (parts.length !== 2) {
                    return;
                }

                const minutes = parseInt(parts[0], 10);
                const seconds = parseInt(parts[1], 10);
                if (isNaN(minutes) || isNaN(seconds)) {
                    return;
                }

                const now = Math.floor(Date.now() / 1000);
                const remainingFromNow = minutes * 60 + seconds;
                expiresAt = now + remainingFromNow;
            }

            const nowCheck = Math.floor(Date.now() / 1000);
            if (expiresAt <= nowCheck) {
                return;
            }

            function formatTime(totalSeconds) {
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

            function updateTimerColor(remainingSeconds) {
                // Keep the base style on the value element and toggle a
                // "critical" modifier class below 1 minute.
                if (remainingSeconds < 60) {
                    valueEl.classList.add('stachesepl-cart-timer--critical');
                } else {
                    valueEl.classList.remove('stachesepl-cart-timer--critical');
                }
            }

            function tick() {
                const now = Math.floor(Date.now() / 1000);
                const remaining = expiresAt - now;

                if (remaining <= 0) {
                    valueEl.textContent = '00:00';
                    valueEl.classList.add('stachesepl-cart-timer--critical');
                    return;
                }

                updateTimerColor(remaining);
                valueEl.textContent = formatTime(remaining);

                window.setTimeout(tick, 1000);
            }

            // Start the countdown
            tick();
        }

        // Block-based cart item details markup:
        // <li class="wc-block-components-product-details__...">
        //   <span class="wc-block-components-product-details__name">Reservation expires in:</span>
        //   <span class="wc-block-components-product-details__value">02:00</span>
        // </li>
        //
        const blockNameEls = document.querySelectorAll('span.wc-block-components-product-details__name');
        blockNameEls.forEach(function (nameEl) {
            const label = (nameEl.textContent || '').trim();
            if (isSeatPlannerTimerLabel(label)) {
                const item = nameEl.closest ? nameEl.closest('li') : nameEl.parentElement;
                if (!item) {
                    return;
                }
                const valueEl = item.querySelector('.wc-block-components-product-details__value');
                if (!valueEl) {
                    return;
                }

                // Preserve custom class names for styling / targeting.
                valueEl.classList.add('stachesepl-cart-timer');
                item.classList.add('stachesepl-cart-timer-row');

                // Add a helper class to the label inside the row (if present)
                // so themes can easily style it.
                const nameSpan = item.querySelector('span.wc-block-components-product-details__name');
                if (nameSpan) {
                    nameSpan.classList.add('stachesepl-cart-timer-label');
                }

                attachSeatPlannerTimer(valueEl);
            }
        });

        // Legacy / classic cart and mini-cart markup where WooCommerce
        // renders item meta inside a <dl class="variation"> list and
        // the label / value pairs are identified via classes derived
        // from the meta name, for example:
        //
        // <dt class="variation-Timeremaining">Time remaining:</dt>
        // <dd class="variation-Timeremaining"><p>1763671856</p></dd>
        //
        // The exact tags (dt/dd/div/etc.) can vary between themes and
        // contexts (cart vs mini-cart), so we intentionally target the
        // elements by class name only instead of by tag.
        const legacyTextLabels = document.querySelectorAll('.variation-Timeremaining');
        legacyTextLabels.forEach(function (labelEl) {
            const labelText = (labelEl.textContent || '').trim();

            // Avoid re-processing the same node when the initializer
            // is triggered multiple times (e.g. via MutationObserver).
            if (labelEl.getAttribute('data-stachesepl-timer-processed') === '1') {
                return;
            }

            // Only treat this element as the label if its text matches
            // the current translated "Time remaining" label.
            if (!isSeatPlannerTimerLabel(labelText)) {
                return;
            }

            // Find the corresponding value element. In WooCommerce's
            // default markup this is the very next sibling with the
            // same "variation-Timeremaining" class, but we keep this
            // a bit more defensive and walk forward until we find one.
            let valueContainer = labelEl.nextElementSibling;
            while (valueContainer && !valueContainer.classList.contains('variation-Timeremaining')) {
                valueContainer = valueContainer.nextElementSibling;
            }

            if (!valueContainer) {
                return;
            }

            // Inside the container, prefer a <p> (default Woo markup),
            // but gracefully fall back to other common inline elements
            // or the container itself so this keeps working even if a
            // theme changes the exact tags.
            const valueEl =
                valueContainer.querySelector('p, span, strong, b') || valueContainer;

            if (!valueEl || !valueEl.textContent) {
                return;
            }

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

            // Mark as processed so repeated initializations don't
            // keep re-writing the DOM tree.
            labelEl.setAttribute('data-stachesepl-timer-processed', '1');

            // Use the existing label element as the "row" container.
            labelEl.classList.add('stachesepl-cart-timer-row');

            // Build the label span.
            const labelSpan = document.createElement('span');
            labelSpan.classList.add('stachesepl-cart-timer-label');
            // Normalise the label text so it always ends with a colon.
            const baseLabel = isSeatPlannerTimerLabel(labelText) ?
                labelText.replace(/:$/, '') :
                labelText;
            labelSpan.textContent = baseLabel + ':';

            // Build the value / countdown span.
            const timerSpan = document.createElement('span');
            timerSpan.classList.add('stachesepl-cart-timer');
            timerSpan.textContent = (valueEl.textContent || '').trim();

            // Clear the original label contents and inject the new structure.
            while (labelEl.firstChild) {
                labelEl.removeChild(labelEl.firstChild);
            }
            labelEl.appendChild(labelSpan);
            labelEl.appendChild(timerSpan);

            // Remove the old value container (dd) from the DOM.
            if (valueContainer.parentNode) {
                valueContainer.parentNode.removeChild(valueContainer);
            }

            // Attach the countdown behaviour to the new timer span.
            attachSeatPlannerTimer(timerSpan);
        });

        // Finally, allow third-parties or custom templates to opt-in to
        // the countdown behavior simply by adding the
        // ".stachesepl-cart-timer" class to any element that contains
        // either a UNIX timestamp or "MM:SS" formatted value.
        //
        // This runs after the above transformations so our own markup
        // is also covered, but attachSeatPlannerTimer() itself guards
        // against double-initialization via a data attribute.
        const customTimerEls = document.querySelectorAll('.stachesepl-cart-timer');
        customTimerEls.forEach(function (timerEl) {
            attachSeatPlannerTimer(timerEl);
        });
    }

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
})();