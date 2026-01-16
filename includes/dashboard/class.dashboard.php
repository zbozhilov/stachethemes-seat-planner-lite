<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * This is the new class for the dashboard menu
 */
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
            Settings::get_settings()
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
            'stachesepl_date_format',
            [
                'date_format' => get_option('date_format'),
                'time_format' => get_option('time_format'),
                'week_start'  => get_option('start_of_week'),
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

}

Dashboard::init();
