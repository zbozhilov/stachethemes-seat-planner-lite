<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Duplicate {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_filter('woocommerce_duplicate_product_exclude_meta', [__CLASS__, 'duplicate_exclude_meta'], 10, 2);
    }

    public static function duplicate_exclude_meta($exclude_array, $array_map) {
        
        $taken_seats_keys = [];

        foreach($array_map as $key) {
            if (strpos($key, '_taken_seat') === 0) {
                $taken_seats_keys[] = $key;
            }
        }

        foreach($taken_seats_keys as $taken_seat_key) {
            $exclude_array[] = $taken_seat_key;
        }

        return $exclude_array;
    }
}


