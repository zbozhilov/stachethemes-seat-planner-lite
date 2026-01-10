<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Price_Adjustment {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_action('woocommerce_before_calculate_totals', [__CLASS__, 'before_calculate_totals'], 10, 1);

        if ('yes' === Settings::get_setting('stachesepl_compat_calc_totals')) {
            add_action('woocommerce_cart_loaded_from_session', function () {
                WC()->cart->calculate_totals();
            });
        }
    }

    public static function before_calculate_totals($cart) {
        if (is_admin() && !defined('DOING_AJAX')) {
            return;
        }

        foreach ($cart->get_cart() as $cart_item) {
            if (isset($cart_item['seat_data'])) {
                $price         = $cart_item['seat_data']->price;
                $discount_data = isset($cart_item['seat_discount']) && is_array($cart_item['seat_discount']) ? $cart_item['seat_discount'] : null;

                if ($discount_data && (float) $discount_data['value'] > 0) {
                    $discount_type = isset($discount_data['type']) ? $discount_data['type'] : '';
                    switch ($discount_type) {
                        case 'fixed':
                            $price -= $discount_data['value'];
                            break;
                        case 'percentage':
                            $price -= ($price * $discount_data['value'] / 100);
                            break;
                    }
                }

                $cart_item['data']->set_price(max(0, $price));
            }
        }
    }
}


