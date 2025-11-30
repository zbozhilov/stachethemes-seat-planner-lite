<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Scripts {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_filter('admin_enqueue_scripts', [__CLASS__, 'register_admin_scripts']);
        add_filter('wp_enqueue_scripts', [__CLASS__, 'register_add_to_cart_scripts']);
    }

    public static function register_admin_scripts() {

        $screen = get_current_screen();

        if (! $screen || $screen->id !== 'product') {
            return;
        }

        // Reserved seats assets

        $seat_planner_reserved_seats_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/reserved_seats/index.bundle.asset.php';

        wp_enqueue_script(
            'seat-planner-reserved-seats',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/reserved_seats/index.bundle.js',
            $seat_planner_reserved_seats_deps['dependencies'],
            $seat_planner_reserved_seats_deps['version'],
            [
                'strategy' => 'defer'
            ]
        );

        wp_enqueue_style(
            'seat-planner-reserved-seats',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/reserved_seats/index.css',
            [],
            $seat_planner_reserved_seats_deps['version']
        );

        // Dates assets

        $seat_planner_dates_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/dates/index.bundle.asset.php';

        wp_enqueue_script(
            'seat-planner-dates',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/dates/index.bundle.js',
            $seat_planner_dates_deps['dependencies'],
            $seat_planner_dates_deps['version'],
            [
                'strategy' => 'defer'
            ]
        );

        wp_enqueue_style(
            'seat-planner-dates',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/dates/index.css',
            [],
            $seat_planner_dates_deps['version']
        );

        // Discounts assets

        $seat_planner_discounts_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/discounts/index.bundle.asset.php';

        wp_enqueue_script(
            'seat-planner-discounts',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/discounts/index.bundle.js',
            $seat_planner_discounts_deps['dependencies'],
            $seat_planner_discounts_deps['version'],
            [
                'strategy' => 'defer'
            ]
        );

        wp_enqueue_style(
            'seat-planner-discounts',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/discounts/index.css',
            [],
            $seat_planner_discounts_deps['version']
        );

        // Editor assets 

        $seat_planner_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/seat_planner/index.bundle.asset.php';

        wp_enqueue_script(
            'seat-planner',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/seat_planner/index.bundle.js',
            $seat_planner_deps['dependencies'],
            $seat_planner_deps['version'],
            [
                'strategy' => 'defer'
            ]
        );

        wp_enqueue_style(
            'seat-planner',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/seat_planner/index.css',
            [],
            $seat_planner_deps['version']
        );

        // Export Bookings CSV assets

        $seat_planner_export_bookings_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/export_bookings/index.bundle.asset.php';

        wp_enqueue_script(
            'seat-planner-export-bookings',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/export_bookings/index.bundle.js',
            $seat_planner_export_bookings_deps['dependencies'],
            $seat_planner_export_bookings_deps['version'],
            [
                'strategy' => 'defer'
            ]
        );

        wp_enqueue_style(
            'seat-planner-export-bookings',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/export_bookings/index.css',
            [],
            $seat_planner_export_bookings_deps['version']
        );

        // This is common for all scripts

        wp_localize_script(
            'seat-planner',
            'stachesepl_i18n',
            Translation::get_admin_strings()
        );

        wp_localize_script(
            'seat-planner',
            'stachesepl_ajax',
            [
                'ajax_url'           => esc_url(admin_url('admin-ajax.php')),
                'nonce'              => wp_create_nonce('stachethemes_seat_planner'),
            ]
        );

        wp_localize_script(
            'seat-planner',
            'stachesepl_date_format',
            [
                'date_format' => get_option('date_format'),
                'time_format' => get_option('time_format'),
            ]
        );
    }

    public static function register_add_to_cart_scripts() {

        $add_to_cart_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/front/add_to_cart/add-to-cart.bundle.asset.php';

        wp_enqueue_script(
            'seat-planner-add-to-cart',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . 'assets/front/add_to_cart/add-to-cart.bundle.js',
            $add_to_cart_deps['dependencies'],
            $add_to_cart_deps['version'],
            [
                'strategy' => 'defer'
            ]
        );

        $cart_url = wc_get_cart_url();
        $cart_redirect_after_add = apply_filters('stachesepl_cart_redirect_after_add', get_option('woocommerce_cart_redirect_after_add'));
        $cart_redirect_url = apply_filters('stachesepl_cart_redirect_url', $cart_url);

        $inline_script = sprintf(
            'var seat_planner_add_to_cart = %s;',
            wp_json_encode([
                'cart_url'                => esc_url($cart_url),
                'ajax_url'                => esc_url(admin_url('admin-ajax.php')),
                'nonce'                   => wp_create_nonce('stachethemes_seat_planner'),
                'currency'                => esc_html(get_woocommerce_currency()),
                'currency_symbol'         => esc_html(get_woocommerce_currency_symbol()),
                'currency_format'         => esc_html(get_woocommerce_price_format()),
                'currency_decimals'       => absint(wc_get_price_decimals()),
                'symbol_position'         => esc_html(get_option('woocommerce_currency_pos')),
                'decimals_separator'      => esc_html(wc_get_price_decimal_separator()),
                'thousand_separator'      => esc_html(wc_get_price_thousand_separator()),
                'cart_redirect_after_add' => esc_html($cart_redirect_after_add),
                'cart_redirect_url'       => esc_url($cart_redirect_url)
            ])
        );

        wp_add_inline_script('seat-planner-add-to-cart', $inline_script, 'before');

        wp_localize_script(
            'seat-planner-add-to-cart',
            'stachesepl_i18n',
            Translation::get_front_strings()
        );
    }
}

Auditorium_Product_Scripts::init();
