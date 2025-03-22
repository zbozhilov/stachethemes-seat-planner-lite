<?php

namespace Stachethemes\SeatPlannerLite;

class Admin_Menu {

    public static function init() {

        add_action('admin_menu', [__CLASS__, 'register_menu']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_scripts']);
    }

    public static function enqueue_scripts() {

        $screen = get_current_screen();

        if ($screen->id !== 'woocommerce_page_st-seat-scanner') {
            return;
        }

        $seat_scanner_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/seat_scanner/index.bundle.asset.php';

        wp_enqueue_script(
            'seat-scanner',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/seat_scanner/index.bundle.js',
            $seat_scanner_deps['dependencies'],
            $seat_scanner_deps['version'],
            true
        );

        wp_enqueue_style(
            'seat-scanner',
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/seat_scanner/index.css',
            [],
            $seat_scanner_deps['version']
        );

        wp_localize_script(
            'seat-scanner',
            'stspi18n',
            Translation::get_scanner_strings()
        );

    }

    public static function register_menu() {
        add_submenu_page(
            'woocommerce', // Extends the WooCommerce menu as per requirements by WooCommerce review team
            esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite'),
            esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite'),
            'manage_woocommerce',
            'stachethemes-seat-planner-scanner',
            [__CLASS__, 'render_seat_scanner']
        );
    }

    public static function render_seat_scanner() {
        echo '<div class="wrap"><h1></h1>';
        echo '  <div id="stachethemes-seat-planner-scanner"></div>';
        echo '</wrap>';
    }
}

Admin_Menu::init();