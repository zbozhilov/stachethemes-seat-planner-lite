<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/class.admin-menu.php';
require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/woocommerce/load.php';

if (defined('DOING_AJAX') && DOING_AJAX) {
    require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . '/includes/ajax/class.ajax.php';
}