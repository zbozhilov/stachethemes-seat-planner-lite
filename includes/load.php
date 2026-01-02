<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/class.utils.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/class.settings.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/class.qrcode.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/woocommerce/load.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/class.notice-rate.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/shortcodes/stachesepl_add_to_cart.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/class.wp-dashboard.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/dashboard/class.dashboard.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/dashboard/class.overview-stats.php';

// Admin Tools
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/tools/check-double-booking/class.check-double-booking.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/tools/check-ghost-booking/class.check-ghost-booking.php';

if (defined('DOING_AJAX') && DOING_AJAX) {
    require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . '/includes/ajax/class.ajax.php';
}