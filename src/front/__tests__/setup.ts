// Jest setup file for front-end tests

// Mock window-scoped globals used throughout the front-end.
// Important: do NOT replace the jsdom window object (it breaks document, events, etc).
const w = (global as any).window || {};
(global as any).window = w;

Object.assign(w, {
    seat_planner_currency: {
        currency_symbol: '$',
        currency_format: '%1$s%2$s',
        currency_decimals: 2,
        decimals_separator: '.',
        thousand_separator: ',',
        symbol_position: 'left',
    },
    stachesepl_i18n: {
        'FIELD_REQUIRED': 'This field is required',
        'NO_SELECTION': 'No selection',
        'TOTAL': 'Total',
        'ADD_TO_CART': 'Add to Cart',
        'LOADING': 'Loading',
        'OPTIONS_TITLE': 'Options',
        'OPTIONS_SUBTITLE': 'Configure your seat options',
        'REGULAR_SEAT': 'Regular Seat',
        'NO_DISCOUNT_APPLIED': 'No discount applied',
        'SELECT_DATE': 'Select Date',
        'D_SEAT_SELECTED': '%d seat selected',
        'D_SEATS_SELECTED': '%d seats selected',
        'SEAT': 'Seat',
        'PRICE': 'Price',
        'REDIRECTING_TO_PAYMENT': 'Redirecting to payment',
        'PLEASE_WAIT': 'Please wait',
        'NO_SEATS_SELECTED': 'No seats selected',
        'D_SEAT_ADDED_TO_CART': '%d seat added to cart',
        'D_SEATS_ADDED_TO_CART': '%d seats added to cart',
        'A__VIEW_CART': 'View Cart',
        'GENERIC_ERROR_MESSAGE': 'An error occurred',
    },
    stachesepl_date_format: {
        date_format: 'Y-m-d',
        time_format: 'H:i',
    },
    seat_planner_add_to_cart: {
        cart_redirect_after_add: 'no',
        cart_redirect_url: '',
        cart_redirect_message: 'no',
        cart_redirect_message_text: 'Redirecting...',
    },
});

// Mock DOMParser for getFormattedPrice
(global as any).DOMParser = class DOMParser {
    parseFromString(text: string, type: string) {
        return {
            documentElement: {
                textContent: text,
            },
        };
    }
};
