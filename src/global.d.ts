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
            cart_redirect_message: 'yes' | 'no';
            cart_redirect_message_text: string;
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
        stachesepl_rest_url: {
            rest_url: string;
        };
        stachesepl_admin_url: {
            admin_url: string;
        };
        stachesepl_server_datetime: {
            now: string;
        };
        stachesepl_date_format: {
            date_format: string;
            time_format: string;
            week_start: string;
            accent_color: string;
        };
        stachesepl_user_roles: Record<string, string>;
        stachesepl_pdf_preview: {
            nonce: string;
        };

        stachesepl_settings: {
            stachesepl_reserve_time: number;
            stachesepl_cart_timer_enabled: 'yes' | 'no';
            stachesepl_cart_timer_bg_color: string;
            stachesepl_cart_timer_text_color: string;
            stachesepl_cart_timer_time_color: string;
            stachesepl_cart_timer_time_color_critical: string;
            stachesepl_pdf_attachments: 'yes' | 'no';
            stachesepl_pdf_attachment_name: string;
            stachesepl_auto_confirm_paid_orders: 'yes' | 'no';
            stachesepl_app_enabled: 'yes' | 'no';
            stachesepl_app_secret_key: string;
        };
        stachesepl_version: {
            version: string;
        };
        stacheseplCartTimer: {
            label: string;
        };
        stacheseplSeatTooltip: 'yes' | 'no' | undefined;
    }
}

export {};