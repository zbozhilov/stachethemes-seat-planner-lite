<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

// Centralize all the settings for the Seat Planner plugin
class Settings {

    private static $the_settings = null;

    public static function get_settings(): array {

        if (!empty(self::$the_settings)) {
            return self::$the_settings;
        }

        self::$the_settings = [
            'stachesepl_dt_adjacent_months'             => get_option('stachesepl_dt_adjacent_months', 'no'),
            'stachesepl_enable_in_loop_button'          => get_option('stachesepl_enable_in_loop_button', 'yes'),
            'stachesepl_compat_mode'                    => get_option('stachesepl_compat_mode', 'yes'),
            'stachesepl_compat_calc_totals'             => get_option('stachesepl_compat_calc_totals', 'no'),
            'stachesepl_reserve_time'                   => (int) get_option('stachesepl_reserve_time', 15),
            'stachesepl_cart_redirect'                  => get_option('stachesepl_cart_redirect', 'checkout'),
            'stachesepl_cart_redirect_message'          => get_option('stachesepl_cart_redirect_message', 'yes'),
            'stachesepl_cart_redirect_message_text'     => get_option('stachesepl_cart_redirect_message_text', ''),
            'stachesepl_cart_timer_enabled'             => get_option('stachesepl_cart_timer_enabled', 'yes'),

            // accent color
            'stachesepl_accent_color'                   => get_option('stachesepl_accent_color', '#7F54B3'),

            'stachesepl_pdf_attachments'                => get_option('stachesepl_pdf_attachments', 'yes'),
            'stachesepl_pdf_attachment_name'            => get_option('stachesepl_pdf_attachment_name', ''),
            'stachesepl_auto_confirm_paid_orders'       => get_option('stachesepl_auto_confirm_paid_orders', 'no'),
            'stachesepl_app_enabled'                    => get_option('stachesepl_app_enabled', 'yes'),
            'stachesepl_app_secret_key'                 => get_option('stachesepl_app_secret_key', ''),
        ];


        return self::$the_settings;
    }

    /**
     * Save settings from the dashboard
     * 
     * @param array $settings Array of settings to save
     * @return bool True on success, false on failure
     */
    public static function save_settings(array $settings): bool {

        $current_settings = self::get_settings();

        $allowed_settings = [

            'stachesepl_dt_adjacent_months' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],

            'stachesepl_enable_in_loop_button' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],

            'stachesepl_compat_mode' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],

            'stachesepl_compat_calc_totals' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],

            'stachesepl_reserve_time' => [
                'type'    => 'int',
                'min'     => 5,
                'max'     => 1440 * 30, // 30 days
            ],
            'stachesepl_cart_redirect' => [
                'type'    => 'string',
                'allowed' => ['disabled', 'cart', 'checkout'],
            ],
            'stachesepl_cart_redirect_message' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],
            'stachesepl_cart_redirect_message_text' => [
                'type'    => 'string',
            ],
            'stachesepl_cart_timer_enabled' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],
            'stachesepl_pdf_attachments' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],
            'stachesepl_pdf_attachment_name' => [
                'type'    => 'string',
            ],
            'stachesepl_auto_confirm_paid_orders' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],
            'stachesepl_app_enabled' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
            ],
            'stachesepl_app_secret_key' => [
                'type'    => 'string',
            ],

            // datepicker
            'stachesepl_accent_color' => [
                'type'    => 'string',
            ],
        ];

        foreach ($settings as $key => $value) {
            // Skip unknown settings
            if (!isset($allowed_settings[$key])) {
                continue;
            }

            $config = $allowed_settings[$key];

            // Sanitize and validate based on type
            if ($config['type'] === 'int') {
                $value = intval($value);

                // Apply minimum if set
                if (isset($config['min']) && $value < $config['min']) {
                    $value = $config['min'];
                }

                // Apply maximum if set
                if (isset($config['max']) && $value > $config['max']) {
                    $value = $config['max'];
                }
            } else {
                // String type
                $value = sanitize_text_field($value);

                // Validate against allowed values if set
                if (isset($config['allowed']) && !in_array($value, $config['allowed'], true)) {
                    $value = isset($current_settings[$key]) ? $current_settings[$key] : '';
                }
            }

            // Use default if empty and default is set
            if ('' === $value && isset($config['default']) && '' !== $config['default']) {
                $value = isset($current_settings[$key]) ? $current_settings[$key] : '';
            }

            update_option($key, $value);
        }

        self::$the_settings = null;

        return true;
    }

    public static function get_setting(string $key): mixed {
        return self::get_settings()[$key];
    }

    public static function delete_settings(): bool {

        $settings = self::get_settings();

        foreach ($settings as $key => $value) {
            delete_option($key);
        }

        self::$the_settings = null;

        return true;
    }

    // Responsible for applying the accent color on the front-end ui
    public static function get_minimized_front_inline_css() {
        $accent_color = Settings::get_setting('stachesepl_accent_color');
        $style = ':root {
            --stachesepl-select-seat-button-background-color: ' . $accent_color . ';
            --stachesepl-select-seat-button-color: #fff;
            --stachesepl-select-seat-button-hover-background-color: ' . Utils::darken($accent_color, 8) . ';
            --stachesepl-select-seat-button-hover-color: #fff;
    
            --stachesepl-btn-primary-bg: ' . $accent_color . ';
            --stachesepl-btn-primary-hover: ' . Utils::darken($accent_color, 8) . ';
            --stachesepl-btn-primary-text: #fff;
            --stachesepl-btn-primary-text-hover: #fff;
    
            --stachesepl-view-cart-button-background-color: ' . Utils::hexToRgba($accent_color, 0.08) . ';
            --stachesepl-view-cart-button-color: ' . $accent_color . ';
            --stachesepl-view-cart-button-hover-background-color: ' . Utils::hexToRgba($accent_color, 0.14) . ';
            --stachesepl-view-cart-button-hover-color: ' . $accent_color . ';
    
            --stachesepl-btn-secondary-bg: ' . Utils::hexToRgba($accent_color, 0.08) . ';
            --stachesepl-btn-secondary-hover: ' . Utils::hexToRgba($accent_color, 0.14) . ';
            --stachesepl-btn-secondary-text: ' . $accent_color . ';
            --stachesepl-btn-secondary-text-hover: ' . $accent_color . ';
    
            --stachesepl-accent-color: ' . $accent_color . ';
            --stachesepl-accent-color-20: ' . Utils::hexToRgba($accent_color, 0.2) . ';
    
            --stachesepl-cart-timer-color: ' . $accent_color . ';
            --stachesepl-cart-timer-critical-color: ' . $accent_color . ';
            --stachesepl-cart-timer-text-color: ' . $accent_color . ';
            --stachesepl-cart-timer-background-color: ' . Utils::hexToRgba($accent_color, 0.08) . ';
    
            .stachesepl-date-time-input,
            .stachesepl-date-time-picker {
            --picker-accent: ' . $accent_color . ';
            --picker-accent-shadow: ' . Utils::hexToRgba($accent_color, 0.25) . ';
            --picker-accent-hover: ' . Utils::darken($accent_color, 5) . ';
            --picker-accent-light: ' . Utils::hexToRgba($accent_color, 0.08) . ';
            --picker-accent-border: ' . Utils::hexToRgba($accent_color, 0.2) . ';
            --picker-btn-primary-bg: ' . $accent_color . ';  
            --picker-btn-primary-hover: ' . Utils::darken($accent_color, 8) . ';
            --picker-btn-primary-text: #ffffff;
            --picker-btn-primary-text-hover: #ffffff;
            --picker-btn-secondary-bg: ' . Utils::hexToRgba($accent_color, 0.08) . ';
            --picker-btn-secondary-hover: ' . Utils::hexToRgba($accent_color, 0.14) . ';
            --picker-btn-secondary-text: ' . $accent_color . ';
            --picker-btn-secondary-text-hover: ' . $accent_color . ';
        }';
        $style = preg_replace('/\s+/', '', $style);
        return $style;
    }
}
