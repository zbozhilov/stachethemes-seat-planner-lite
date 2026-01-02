<?php

namespace Stachethemes\SeatPlannerLite;

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
            'stachesepl_compat_mode'                    => get_option('stachesepl_compat_mode', 'yes'),
            'stachesepl_reserve_time'                   => (int) get_option('stachesepl_reserve_time', 15),
            'stachesepl_cart_redirect'                  => get_option('stachesepl_cart_redirect', 'checkout'),
            'stachesepl_cart_redirect_message'          => get_option('stachesepl_cart_redirect_message', 'yes'),
            'stachesepl_cart_redirect_message_text'     => get_option('stachesepl_cart_redirect_message_text', ''),
            'stachesepl_cart_timer_enabled'             => get_option('stachesepl_cart_timer_enabled', 'yes'),
            'stachesepl_cart_timer_bg_color'            => get_option('stachesepl_cart_timer_bg_color', '#32373c'),
            'stachesepl_cart_timer_text_color'          => get_option('stachesepl_cart_timer_text_color', '#fff'),
            'stachesepl_cart_timer_time_color'          => get_option('stachesepl_cart_timer_time_color', '#fb8a2e'),
            'stachesepl_cart_timer_time_color_critical' => get_option('stachesepl_cart_timer_time_color_critical', '#ff6c5f'),

            // datepicker
            'stachesepl_datepicker_accent_color'       => get_option('stachesepl_datepicker_accent_color', '#873eff'),

            'stachesepl_pdf_attachments'                => get_option('stachesepl_pdf_attachments', 'yes'),
            'stachesepl_pdf_attachment_name'            => get_option('stachesepl_pdf_attachment_name', ''),
            'stachesepl_auto_confirm_paid_orders'       => get_option('stachesepl_auto_confirm_paid_orders', 'no'),
            'stachesepl_app_enabled'                    => get_option('stachesepl_app_enabled', 'yes'),
            'stachesepl_app_secret_key'                 => get_option('stachesepl_app_secret_key', ''),

            // select seat button
            'stachesepl_select_seat_btn_bg_color' => get_option('stachesepl_select_seat_btn_bg_color', '#202020'),
            'stachesepl_select_seat_btn_bg_color_hover' => get_option('stachesepl_select_seat_btn_bg_color_hover', '#873EFF'),
            'stachesepl_select_seat_btn_text_color' => get_option('stachesepl_select_seat_btn_text_color', '#fff'),
            'stachesepl_select_seat_btn_text_color_hover' => get_option('stachesepl_select_seat_btn_text_color_hover', '#fff'),

            // add to cart button
            'stachesepl_add_to_cart_btn_bg_color' => get_option('stachesepl_add_to_cart_btn_bg_color', '#2C9F45'),
            'stachesepl_add_to_cart_btn_bg_color_hover' => get_option('stachesepl_add_to_cart_btn_bg_color_hover', '#0ABF53'),
            'stachesepl_add_to_cart_btn_text_color' => get_option('stachesepl_add_to_cart_btn_text_color', '#fff'),
            'stachesepl_add_to_cart_btn_text_color_hover' => get_option('stachesepl_add_to_cart_btn_text_color_hover', '#fff'),

            // view cart button
            'stachesepl_view_cart_button_bg_color' => get_option('stachesepl_view_cart_button_bg_color', '#2C9F45'),
            'stachesepl_view_cart_button_bg_color_hover' => get_option('stachesepl_view_cart_button_bg_color_hover', '#0ABF53'),
            'stachesepl_view_cart_button_text_color' => get_option('stachesepl_view_cart_button_text_color', '#fff'),
            'stachesepl_view_cart_button_text_color_hover' => get_option('stachesepl_view_cart_button_text_color_hover', '#fff'),
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

            'stachesepl_compat_mode' => [
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
            'stachesepl_cart_timer_bg_color' => [
                'type'    => 'string',
            ],
            'stachesepl_cart_timer_text_color' => [
                'type'    => 'string',
            ],
            'stachesepl_cart_timer_time_color' => [
                'type'    => 'string',
            ],
            'stachesepl_cart_timer_time_color_critical' => [
                'type'    => 'string',
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
            'stachesepl_datepicker_accent_color' => [
                'type'    => 'string',
            ],

            // select seat button
            'stachesepl_select_seat_btn_bg_color' => [
                'type'    => 'string',
            ],
            'stachesepl_select_seat_btn_bg_color_hover' => [
                'type'    => 'string',
            ],
            'stachesepl_select_seat_btn_text_color' => [
                'type'    => 'string',
            ],
            'stachesepl_select_seat_btn_text_color_hover' => [
                'type'    => 'string',
            ],

            // add to cart button
            'stachesepl_add_to_cart_btn_bg_color' => [
                'type'    => 'string',
            ],
            'stachesepl_add_to_cart_btn_bg_color_hover' => [
                'type'    => 'string',
            ],
            'stachesepl_add_to_cart_btn_text_color' => [
                'type'    => 'string',
            ],
            'stachesepl_add_to_cart_btn_text_color_hover' => [
                'type'    => 'string',
            ],

            // view cart button
            'stachesepl_view_cart_button_bg_color' => [
                'type'    => 'string',
            ],
            'stachesepl_view_cart_button_bg_color_hover' => [
                'type'    => 'string',
            ],
            'stachesepl_view_cart_button_text_color' => [
                'type'    => 'string',
            ],
            'stachesepl_view_cart_button_text_color_hover' => [
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
}
