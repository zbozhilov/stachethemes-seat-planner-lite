<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Utils {

    /**
     * Normalize seat_data meta to an array. Use when reading seat_data from order item meta or cart.
     * Ensures consistent array access regardless of whether data was stored as object or array.
     *
     * @param mixed $seat_data Raw seat_data meta (object, array, or null).
     * @return array<string, mixed> Associative array; empty array if null/invalid. customFields is normalized to array.
     */
    public static function normalize_seat_data_meta(mixed $seat_data): array {
        if ($seat_data === null || $seat_data === '') {
            return [];
        }
        if (is_array($seat_data)) {
            $out = $seat_data;
        } elseif (is_object($seat_data)) {
            $out = (array) $seat_data;
        } else {
            return [];
        }
        if (isset($out['customFields'])) {
            $cf = $out['customFields'];
            $out['customFields'] = is_array($cf) ? $cf : (is_object($cf) ? (array) $cf : []);
        }
        return $out;
    }

    public static function get_formatted_date_time(string|int $date_time): string {
        $dt_format = get_option('date_format') . ' ' . get_option('time_format');
        return date_i18n($dt_format, strtotime((string) $date_time));
    }


    public static function darken(string $hex, int|float $percent): string {
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

    public static function hexToRgba(string $hex, int|float $alpha): string {
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
