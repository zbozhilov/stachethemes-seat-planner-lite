<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Scripts {

    public static function init() {
        add_filter('admin_enqueue_scripts', [__CLASS__, 'register_admin_scripts']);
        add_filter('wp_enqueue_scripts', [__CLASS__, 'register_add_to_cart_scripts']);
    }

    public static function register_admin_scripts() {

        $screen = get_current_screen();

        if (! $screen || $screen->id !== 'product') {
            return;
        }

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

        // This is common for both scripts
        wp_localize_script(
            'seat-planner',
            'stspi18n',
            Translation::get_admin_strings()
        );
    }

    public static function register_add_to_cart_scripts() {

        $add_to_cart_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/front/add_to_cart/add-to-cart.bundle.asset.php';

        wp_enqueue_script(
            'seat-planner-add-to-cart',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/front/add_to_cart/add-to-cart.bundle.js',
            $add_to_cart_deps['dependencies'],
            $add_to_cart_deps['version'],
            [
                'strategy' => 'defer'
            ]
        );

        $inline_script = sprintf(
            'var seat_planner_add_to_cart = %s;',
            wp_json_encode([
                'cart_url'           => esc_url(wc_get_cart_url()),
                'ajax_url'           => esc_url(admin_url('admin-ajax.php')),
                'nonce'              => wp_create_nonce('stachethemes_seat_planner'),
                'currency'           => esc_html(get_woocommerce_currency()),
                'currency_symbol'    => esc_html(get_woocommerce_currency_symbol()),
                'currency_format'    => esc_html(get_woocommerce_price_format()),
                'currency_decimals'  => absint(wc_get_price_decimals()),
                'symbol_position'    => esc_html(get_option('woocommerce_currency_pos')),
                'decimals_separator' => esc_html(wc_get_price_decimal_separator()),
                'thousand_separator' => esc_html(wc_get_price_thousand_separator())
            ])
        );

        wp_add_inline_script('seat-planner-add-to-cart', $inline_script, 'before');

        wp_localize_script(
            'seat-planner-add-to-cart',
            'stspi18n',
            Translation::get_front_strings()
        );
    }
}

Auditorium_Product_Scripts::init();
