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
        if (!$discount_data || (float) ($discount_data['value'] ?? 0) <= 0) {
            return $price;
        }

        $discount_type  = isset($discount_data['type']) ? (string) $discount_data['type'] : '';
        $discount_value = (float) $discount_data['value'];

        switch ($discount_type) {
            case 'fixed':
                return $price - $discount_value;
            case 'percentage':
                return $price - ($price * $discount_value / 100);
            default:
                return $price;
        }
    }

    /**
     * Safely read a property from a stdClass/array field definition.
     *
     * @param mixed  $field
     * @param string $prop
     * @param mixed  $default
     * @return mixed
     */
    private static function field_get($field, string $prop, $default = null) {
        if (is_object($field) && isset($field->{$prop})) {
            return $field->{$prop};
        }
        if (is_array($field) && array_key_exists($prop, $field)) {
            return $field[$prop];
        }
        return $default;
    }

    /**
     * Calculate the surcharge (options total) based on sanitized custom fields and admin field definitions.
     *
     * @param Auditorium_Product $product
     * @param \stdClass   $sanitized_custom_fields
     * @return float
     */
    public static function calculate_custom_fields_surcharge($product, \stdClass $sanitized_custom_fields): float {
        if (!$product || !method_exists($product, 'get_custom_fields_data')) {
            return 0.0;
        }

        $admin_custom_fields = $product->get_custom_fields_data();
        if (empty($admin_custom_fields)) {
            return 0.0;
        }

        $surcharge = 0.0;

        foreach ($admin_custom_fields as $index => $admin_custom_field) {
            // Skip price calculation if field is not visible due to display conditions
            if (!$product->is_field_visible($index, $admin_custom_fields, $sanitized_custom_fields)) {
                continue;
            }

            $field_label = (string) self::field_get($admin_custom_field, 'label', '');
            $field_key = trim($field_label);
            if ($field_key === '') {
                $field_key = 'field_' . intval($index);
            }

            if (!property_exists($sanitized_custom_fields, $field_key)) {
                continue;
            }

            $field_type  = (string) self::field_get($admin_custom_field, 'type', '');
            $field_value = $sanitized_custom_fields->{$field_key};

            switch ($field_type) {
                case 'checkbox': {
                        $unit_price = self::field_get($admin_custom_field, 'price', null);
                        if ($unit_price === null || $unit_price === '') {
                            break;
                        }

                        $checked_value = self::field_get($admin_custom_field, 'checkedValue', '');
                        $checked_value = is_string($checked_value) ? trim($checked_value) : '';

                        if ($checked_value !== '') {
                            $is_checked = ((string) $field_value === $checked_value);
                        } else {
                            $is_checked =
                                $field_value === true ||
                                $field_value === 1 ||
                                $field_value === '1' ||
                                $field_value === 'yes' ||
                                $field_value === 'true';
                        }

                        if ($is_checked) {
                            $surcharge += (float) $unit_price;
                        }
                        break;
                    }

                case 'number': {
                        $unit_price = self::field_get($admin_custom_field, 'price', null);
                        if ($unit_price === null || $unit_price === '') {
                            break;
                        }

                        $raw = is_scalar($field_value) ? trim((string) $field_value) : '';
                        if ($raw === '') {
                            break;
                        }

                        $qty = is_numeric($raw) ? (float) $raw : null;
                        if ($qty === null || $qty <= 0) {
                            break;
                        }

                        $surcharge += ((float) $unit_price * $qty);
                        break;
                    }

                case 'select': {
                        $selected_label = is_scalar($field_value) ? (string) $field_value : '';
                        if ($selected_label === '') {
                            break;
                        }

                        $options = self::field_get($admin_custom_field, 'options', []);
                        if (!is_array($options) || empty($options)) {
                            break;
                        }

                        foreach ($options as $opt) {
                            $opt_label = (string) self::field_get($opt, 'label', '');
                            if ($opt_label !== $selected_label) {
                                continue;
                            }

                            $opt_price = self::field_get($opt, 'price', null);
                            if ($opt_price === null || $opt_price === '') {
                                break;
                            }

                            $surcharge += (float) $opt_price;
                            break;
                        }

                        break;
                    }
            }
        }

        return $surcharge;
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

        $product_id = $cart_item['product_id'] ?? null;
        if (!$product_id) {
            return 0.0;
        }

        $product   = wc_get_product($product_id);
        $seat_data = Utils::normalize_seat_data_meta($cart_item['seat_data'] ?? null);
        $seat_id   = $seat_data['seatId'] ?? null;

        if (!$seat_id || !$product || !$product->is_type('auditorium') || !($product instanceof Auditorium_Product)) {

            wc_add_notice(
                sprintf(
                    // translators: %s: product id
                    esc_html__('Product %s is not found', 'stachethemes-seat-planner-lite'),
                    esc_html($product_id)
                ),
                'error'
            );

            return 0.0;
        }

        // If we cannot validate/sanitize, just skip surcharge (still apply base+discount price).
        $validation_result = $product->validate_custom_fields($custom_fields);
        if ($validation_result !== null) {

            wc_add_notice(
                sprintf(
                    // translators: %s: seat id
                    esc_html__('Seat options for seat %s are not valid. Please remove it from your cart.', 'stachethemes-seat-planner-lite'),
                    esc_html($seat_id)
                ),
                'error'
            );

            return 0.0;
        }

        $sanitized_custom_fields = $product->sanitize_custom_fields($custom_fields);
        if (!($sanitized_custom_fields instanceof \stdClass) || empty((array) $sanitized_custom_fields)) {
            return 0.0;
        }

        return self::calculate_custom_fields_surcharge($product, $sanitized_custom_fields);
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
