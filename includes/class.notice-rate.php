<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * This plugin is fairly new and we would appreciate if you could leave a rating to support it.
 * This notice will be shown on the dashboard and plugins page.
 */
class Notice_Rate {

    const TRANSIENT_ID     = 'stachesepl_notice_rate_timer';
    const OPTION_ID        = 'stachesepl_notice_rate';
    const NOTICE_FREQUENCY = 2 * DAY_IN_SECONDS;

    public static function init() {

        if (get_option(self::OPTION_ID, 'on') === 'off') {
            return;
        }

        add_action('admin_notices', [__CLASS__, 'maybe_show_notice']);
        add_action('admin_init', [__CLASS__, 'handler']);
    }

    public static function handler() {

        if (!isset($_GET['stachesepl_notice_rate']) || !isset($_GET['stachesepl_nonce'])) {
            return;
        }

        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['stachesepl_nonce'])), 'stachesepl_notice_rate_action')) {
            return;
        }

        $action = sanitize_text_field(wp_unslash($_GET['stachesepl_notice_rate']));
        $valid_actions = ['off', 'maybe_later'];

        if (!in_array($action, $valid_actions, true)) {
            return;
        }

        switch ($action) {
            case 'off':
                update_option(self::OPTION_ID, 'off');
                break;
            case 'maybe_later':
                set_transient(self::TRANSIENT_ID, time(), self::NOTICE_FREQUENCY);
                break;
        }

        wp_safe_redirect(remove_query_arg(['stachesepl_notice_rate', 'stachesepl_nonce']));
        exit;
    }

    public static function maybe_show_notice() {

        if (!current_user_can('manage_options')) {
            return;
        }

        $screen           = get_current_screen();
        $allowed_screens = ['dashboard', 'plugins'];

        if (!$screen || !in_array($screen->id, $allowed_screens)) {
            return;
        }

        if (!in_array($screen->id, $allowed_screens)) {
            return;
        }

        if (get_transient('stachesepl_notice_rate_timer')) {
            return;
        }

        self::show_message();
    }

    public static function show_message() {

        $current_page_url   = add_query_arg([]);
        $dismiss_url        = wp_nonce_url(add_query_arg(['stachesepl_notice_rate' => 'off'], $current_page_url), 'stachesepl_notice_rate_action', 'stachesepl_nonce');
        $maybe_later_url    = wp_nonce_url(add_query_arg(['stachesepl_notice_rate' => 'maybe_later'], $current_page_url), 'stachesepl_notice_rate_action', 'stachesepl_nonce');

?>
        <div class="notice notice-success is-dismissible">
            <p>
                <?php
                echo sprintf(
                    // Translators: %1$s is the plugin name, %2$s is the rating link
                    esc_html__('Thank you for using %1$s! Please consider leaving a %2$s rating to support the plugin.', 'stachethemes-seat-planner-lite')
,
                    '<strong>' . esc_html__('Stachethemes Seat Planner', 'stachethemes-seat-planner-lite')
 . '</strong>',
                    '<a href="https://woocommerce.com/products/stachethemes-seat-planner/" target="_blank">' . esc_html__('★★★★★', 'stachethemes-seat-planner-lite')
 . '</a>'
                );
                ?>
            </p>
            <p>
                <?php
                echo sprintf(
                    // Translators: %s is the URL to dismiss the notice
                    '<a class="button-secondary" href="%s">' . esc_html__('Maybe Later', 'stachethemes-seat-planner-lite')
 . '</a>',
                    esc_url($maybe_later_url)
                );
                echo sprintf(
                    // Translators: %s is the URL to dismiss the notice
                    '<a class="button-secondary" style="margin-left: 10px" href="%s">' . esc_html__('Don\'t Show Again', 'stachethemes-seat-planner-lite')
 . '</a>',
                    esc_url($dismiss_url)
                );
                ?>
            </p>
        </div>
<?php

    }
}

Notice_Rate::init();