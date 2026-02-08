<?php

namespace StachethemesSeatPlannerLite;

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

    /**
     * Get base seat price from cart item.
     *
     * @param array $cart_item
     * @return float
     */
    private static function get_base_seat_price(array $cart_item): float {
        $seat_data = Utils::normalize_seat_data_meta($cart_item['seat_data'] ?? null);

        if (isset($seat_data['price'])) {
            return (float) $seat_data['price'];
        }
        return 0.0;
    }

    /**
     * Apply a discount structure (type/value) to a price.
     *
     * @param float      $price
     * @param array|null $discount_data
     * @return float
     */
    public static function apply_discount(float $price, ?array $discount_data): float {
        return $price;
    }

    /**
     * Calculate the surcharge (options total) based on sanitized custom fields and admin field definitions.
     *
     * @param Auditorium_Product $product
     * @param \stdClass   $sanitized_custom_fields
     * @return float
     */
    public static function calculate_custom_fields_surcharge($product, \stdClass $sanitized_custom_fields): float {
        return 0.0;
    }

    /**
     * Compute the custom-fields surcharge for a cart item.
     * Returns 0 when the product is not an auditorium product, custom fields are invalid,
     * or no priced options are selected.
     *
     * @param array  $cart_item
     * @param object $custom_fields
     * @return float
     */
    private static function get_cart_item_custom_fields_surcharge(array $cart_item, object $custom_fields): float {
        return 0.0;
    }

    public static function before_calculate_totals($cart) {
        if (is_admin() && !defined('DOING_AJAX')) {
            return;
        }

        foreach ($cart->get_cart() as $cart_item) {

            if (isset($cart_item['seat_data'])) {
                // Base seat price (discount applies to base only; extras are added after).
                $base_price = self::get_base_seat_price($cart_item);

                $discount_data = isset($cart_item['seat_discount']) && is_array($cart_item['seat_discount'])
                    ? $cart_item['seat_discount']
                    : null;

                $base_price = self::apply_discount($base_price, $discount_data);

                // Prevent discount from "eating" extras by clamping the discounted base before adding surcharges.
                $price = max(0, $base_price);

                $custom_fields = isset($cart_item['seat_custom_fields']) && is_object($cart_item['seat_custom_fields'])
                    ? $cart_item['seat_custom_fields']
                    : null;

                if ($custom_fields) {
                    $price += self::get_cart_item_custom_fields_surcharge($cart_item, $custom_fields);
                }

                $cart_item['data']->set_price(max(0, $price));
            }
        }
    }
}
