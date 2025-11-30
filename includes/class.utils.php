<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Utils {

    public static function get_formatted_date_time($date_time) {
        $dt_format = get_option('date_format') . ' ' . get_option('time_format');
        return date_i18n($dt_format, strtotime($date_time));
    }
}
