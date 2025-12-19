<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Dashboard {

    public static $did_init = false;

    public static function init() {

        if (self::$did_init) {
            return;
        }

        self::$did_init = true;

        add_action('admin_menu', [__CLASS__, 'register_menu']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_scripts']);
    }

    public static function register_menu() {

        add_menu_page(
            esc_html__('Seat Planner', 'stachethemes-seat-planner-lite'),
            esc_html__('Seat Planner', 'stachethemes-seat-planner-lite'),
            'manage_options',
            'stachesepl',
            [__CLASS__, 'render_menu'],
            'dashicons-tickets-alt',
            58
        );

        add_submenu_page(
            'stachesepl',
            esc_html__('Overview', 'stachethemes-seat-planner-lite'),
            esc_html__('Overview', 'stachethemes-seat-planner-lite'),
            'manage_options',
            admin_url('admin.php?page=stachesepl#overview'),
        );

        add_submenu_page(
            'stachesepl',
            esc_html__('Settings', 'stachethemes-seat-planner-lite'),
            esc_html__('Settings', 'stachethemes-seat-planner-lite'),
            'manage_options',
            admin_url('admin.php?page=stachesepl#settings'),
        );

        add_submenu_page(
            'stachesepl',
            esc_html__('Scanner', 'stachethemes-seat-planner-lite'),
            esc_html__('Scanner', 'stachethemes-seat-planner-lite'),
            'manage_options',
            admin_url('admin.php?page=stachesepl#scanner'),
        );

        add_submenu_page(
            'stachesepl',
            esc_html__('Tools', 'stachethemes-seat-planner-lite'),
            esc_html__('Tools', 'stachethemes-seat-planner-lite'),
            'manage_options',
            admin_url('admin.php?page=stachesepl#tools'),
        );

        global $submenu;

        if (isset($submenu['stachesepl'])) {
            unset($submenu['stachesepl'][0]);
        }
    }

    private static function should_load_admin_scripts(): bool {

        $screen = get_current_screen();

        if ($screen && $screen->id === 'toplevel_page_stachesepl') {
            return true;
        }

        return false;
    }

    public static function enqueue_scripts() {

        if (true !== self::should_load_admin_scripts()) {
            return;
        }

        $dependencies = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/dashboard/index.bundle.asset.php';

        wp_enqueue_script(
            'stachesepl-dashboard',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . 'assets/admin/dashboard/index.bundle.js',
            $dependencies['dependencies'],
            $dependencies['version'],
            array(
                'strategy' => 'defer',
            )
        );

        wp_enqueue_style(
            'stachesepl-dashboard',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . 'assets/admin/dashboard/index.css',
            array(),
            filemtime(STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/dashboard/index.css')
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stachesepl_i18n',
            Translation::get_dashboard_strings()
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stachesepl_ajax',
            [
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce'    => wp_create_nonce('stachethemes_seat_planner')
            ]
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stachesepl_rest_url',
            [
                'rest_url' => rest_url('/')
            ]
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stachesepl_admin_url',
            [
                'admin_url' => admin_url('/')
            ]
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stachesepl_pdf_preview',
            [
                'nonce' => wp_create_nonce('stachesepl_pdf_preview')
            ]
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stachesepl_settings',
            self::get_settings()
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stacheseplCartTimer',
            [
                'label' => esc_html__('Time remaining', 'stachethemes-seat-planner-lite'),
            ]
        );

        wp_localize_script(
            'stachesepl-dashboard',
            'stachesepl_version',
            [
                'version' => STACHETHEMES_SEAT_PLANNER_LITE_VERSION
            ]
        );
    }

    public static function render_menu(): void {
        echo '<div class="wrap">
                <h1></h1>
                <div id="stachesepl-dashboard"></div>
             </div>';
    }

    public static function get_settings(): array {

        $settings = [
            'stachesepl_reserve_time'                   => (int) get_option('stachesepl_reserve_time', 15),
            'stachesepl_cart_redirect'                  => get_option('stachesepl_cart_redirect', 'checkout'),
            'stachesepl_cart_redirect_message'          => get_option('stachesepl_cart_redirect_message', 'yes'),
            'stachesepl_cart_redirect_message_text'     => get_option('stachesepl_cart_redirect_message_text', ''),
            'stachesepl_cart_timer_enabled'             => get_option('stachesepl_cart_timer_enabled', 'yes'),
            'stachesepl_cart_timer_bg_color'            => get_option('stachesepl_cart_timer_bg_color', Auditorium_Product_Cart_Timer::$default_cart_timer_bg_color),
            'stachesepl_cart_timer_text_color'          => get_option('stachesepl_cart_timer_text_color', Auditorium_Product_Cart_Timer::$default_cart_timer_text_color),
            'stachesepl_cart_timer_time_color'          => get_option('stachesepl_cart_timer_time_color', Auditorium_Product_Cart_Timer::$default_cart_timer_time_color),
            'stachesepl_cart_timer_time_color_critical' => get_option('stachesepl_cart_timer_time_color_critical', Auditorium_Product_Cart_Timer::$default_cart_timer_time_color_critical),
            'stachesepl_pdf_attachments'                => get_option('stachesepl_pdf_attachments', 'yes'),
            'stachesepl_pdf_attachment_name'            => get_option('stachesepl_pdf_attachment_name', ''),
            'stachesepl_auto_confirm_paid_orders'       => get_option('stachesepl_auto_confirm_paid_orders', 'no'),
            'stachesepl_app_enabled'                    => get_option('stachesepl_app_enabled', 'yes'),
            'stachesepl_app_secret_key'                 => get_option('stachesepl_app_secret_key', ''),
        ];

        return $settings;
    }

    /**
     * Save settings from the dashboard
     * 
     * @param array $settings Array of settings to save
     * @return bool True on success, false on failure
     */
    public static function save_settings(array $settings): bool {

        $allowed_settings = [
            'stachesepl_reserve_time' => [
                'type'    => 'int',
                'min'     => 5,
                'max'     => 1440 * 30, // 30 days
                'default' => 15
            ],
            'stachesepl_cart_redirect' => [
                'type'    => 'string',
                'allowed' => ['disabled', 'cart', 'checkout'],
                'default' => 'checkout'
            ],
            'stachesepl_cart_redirect_message' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
                'default' => 'yes'
            ],
            'stachesepl_cart_redirect_message_text' => [
                'type'    => 'string',
                'default' => ''
            ],
            'stachesepl_cart_timer_enabled' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
                'default' => 'yes'
            ],
            'stachesepl_cart_timer_bg_color' => [
                'type'    => 'string',
                'default' => Auditorium_Product_Cart_Timer::$default_cart_timer_bg_color
            ],
            'stachesepl_cart_timer_text_color' => [
                'type'    => 'string',
                'default' => Auditorium_Product_Cart_Timer::$default_cart_timer_text_color
            ],
            'stachesepl_cart_timer_time_color' => [
                'type'    => 'string',
                'default' => Auditorium_Product_Cart_Timer::$default_cart_timer_time_color
            ],
            'stachesepl_cart_timer_time_color_critical' => [
                'type'    => 'string',
                'default' => Auditorium_Product_Cart_Timer::$default_cart_timer_time_color_critical
            ],
            'stachesepl_pdf_attachments' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
                'default' => 'yes'
            ],
            'stachesepl_pdf_attachment_name' => [
                'type'    => 'string',
                'default' => ''
            ],
            'stachesepl_auto_confirm_paid_orders' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
                'default' => 'no'
            ],
            'stachesepl_app_enabled' => [
                'type'    => 'string',
                'allowed' => ['yes', 'no'],
                'default' => 'yes'
            ],
            'stachesepl_app_secret_key' => [
                'type'    => 'string',
                'default' => ''
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
                    $value = $config['default'];
                }
            }

            // Use default if empty and default is set
            if ('' === $value && isset($config['default']) && '' !== $config['default']) {
                $value = $config['default'];
            }

            update_option($key, $value);
        }

        return true;
    }
}

Dashboard::init();
