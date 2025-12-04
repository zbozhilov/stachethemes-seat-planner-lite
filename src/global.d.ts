// global for window.seat_planner_add_to_cart, stachesepl_i18n

declare global {
    interface Window {
        moment: any;
        seat_planner_add_to_cart: {
            cart_url: string;
            ajax_url: string;
            nonce: string;
            currency: string;
            currency_symbol: string;
            currency_format: string;
            currency_decimals: number;
            symbol_position: 'left' | 'right' | 'left_space' | 'right_space';
            decimals_separator: string;
            thousand_separator: string;
            cart_redirect_after_add: 'yes' | 'no';
            cart_redirect_url: string;
            can_view_seat_orders: boolean;
        };
        seat_scanner: {
            ajax_url: string;
            nonce: string;
        };
        stacheseplFilterMaxAllowedObjects?: number;
        stachesepl_i18n?: Record<string, string>;
        wp: any;
        stachesepl_ajax: {
            ajax_url: string;
            nonce: string;
        };
        stachesepl_admin_url: {
            admin_url: string;
        };
        stachesepl_date_format: {
            date_format: string;
            time_format: string;
        };
    }
}

export {};