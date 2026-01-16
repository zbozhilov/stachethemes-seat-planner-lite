<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Utils {

    public static function get_formatted_date_time($date_time) {
        $dt_format = get_option('date_format') . ' ' . get_option('time_format');
        return date_i18n($dt_format, strtotime($date_time));
    }


    public static function darken($hex, $percent) {
        $hex = str_replace('#', '', $hex);
        if (strlen($hex) === 3) {
            $hex = str_split($hex);
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        $amt = round(2.55 * $percent);
        $r = max(0, hexdec(substr($hex, 0, 2)) - $amt);
        $g = max(0, hexdec(substr($hex, 2, 2)) - $amt);
        $b = max(0, hexdec(substr($hex, 4, 2)) - $amt);
        return "rgb({$r}, {$g}, {$b})";
    }

    public static function hexToRgba($hex, $alpha) {
        $hex = str_replace('#', '', $hex);
        if (strlen($hex) === 3) {
            $hex = str_split($hex);
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        return "rgba({$r}, {$g}, {$b}, {$alpha})";
    }

}
