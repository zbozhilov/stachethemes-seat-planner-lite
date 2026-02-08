<?php

namespace StachethemesSeatPlannerLite\Product_Traits;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Trait for handling cart operations
 */
trait Cart_Operations {

    /**
     * Add seat to cart
     * 
     * @param string $seat_id
     * @param string $discount
     * @param string $selected_date
     * @param object|null $custom_fields
     * @return string|bool Cart item key or false on error
     * @throws \Exception
     */
    public function add_to_cart($seat_id, $discount = '', $selected_date = '', $custom_fields = null) {

        $seat_data   = $this->get_seat_data($seat_id, 'add_to_cart', 'apply_seat_object_overrides', $selected_date);
        if (!$seat_data) {
            throw new \Exception(esc_html__('Seat not found', 'stachethemes-seat-planner-lite'));
        }
        $seat_data_array = (array) $seat_data;
        $seat_status     = $seat_data_array['status'] ?? 'available'; // Default to available if status is not set

        if ($seat_status === 'unavailable') {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s is unavailable. Please select a different seat.', 'stachethemes-seat-planner-lite'), esc_html($seat_id)));
        }

        if ($seat_status === 'on-site') {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s can only be purchased at the venue.', 'stachethemes-seat-planner-lite'), esc_html($seat_id)));
        }

        if ($seat_status === 'sold-out' || $this->is_seat_taken($seat_id, $selected_date)) {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s is already taken. Please select a different seat.', 'stachethemes-seat-planner-lite'), esc_html($seat_id)));
        }

        // Ensure custom fields is an object
        if (!is_object($custom_fields)) {
            $custom_fields = is_array($custom_fields) ? (object) $custom_fields : new \stdClass();
        }

        // Meta fields are the read only custom fields of type "Meta" in the admin panel
        // Since they are not editable, we do not submit them but obtain them during add to cart
        $meta_fields = $this->get_custom_fields_data([
            'meta_only' => true
        ]);

        foreach ($meta_fields as $meta_field) {
            /** @var \stdClass $meta_field */
            $label = isset($meta_field->label) ? trim((string) $meta_field->label) : '';
            if ($label !== '') {
                $custom_fields->{$label} = $meta_field->value;
            }
        }

        $validation_result = $this->validate_custom_fields($custom_fields);

        if (is_array($validation_result) && isset($validation_result['error'])) {
            throw new \Exception(esc_html($validation_result['error']));
        }

        $sanitized_custom_fields = $this->sanitize_custom_fields($custom_fields);

        if (is_array($sanitized_custom_fields) && isset($sanitized_custom_fields['error'])) {
            throw new \Exception(esc_html($sanitized_custom_fields['error']));
        }

        $cart = WC()->cart;

        foreach ($cart->get_cart() as $cart_item) {

            $cart_item_selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';

            $existing_seat = \StachethemesSeatPlannerLite\Utils::normalize_seat_data_meta($cart_item['seat_data'] ?? null);
            if (
                !empty($existing_seat) &&
                ($existing_seat['seatId'] ?? '') === $seat_id &&
                $cart_item_selected_date === $selected_date
            ) {
                $cart->remove_cart_item($cart_item['key']);
            }
        }

        $cart_item_key = $cart->generate_cart_id($this->get_id());

        $cart_item_data = [
            'seat_data'          => $seat_data_array,
            'seat_discount'      => $this->get_discount_by_name($discount),
            'selected_date'      => $selected_date,
            'seat_custom_fields' => $sanitized_custom_fields
        ];

        // Check if transient exists for this seat and throw an exception if it does
        do_action('stachesepl_before_add_to_cart', $this, $seat_id, $selected_date);

        $cart_item_key = $cart->add_to_cart($this->get_id(), 1, 0, [], $cart_item_data);

        // Insert transient to reserve the seat temporarily
        do_action('stachesepl_after_add_to_cart', $this, $seat_id, $cart_item_key, $cart, $selected_date);

        return $cart_item_key;
    }

    /**
     * Validate cart item discount
     * 
     * @param array $cart_item
     * @return bool
     */
    public function validate_cart_item_discount($cart_item): bool {
        return true;
    }

    /**
     * Get seats in cart
     * 
     * @param array $args
     * @return array
     */
    public function get_seats_in_cart($args = []) {

        $default_args = [
            'selected_date' => ''
        ];

        $args           = wp_parse_args($args, $default_args);
        $cart           = WC()->cart;
        $cart_items     = $cart->get_cart();
        $seats_in_cart  = [];

        foreach ($cart_items as $cart_item) {

            if (isset($cart_item['seat_data']) && $cart_item['product_id'] === $this->get_id()) {

                $cart_item_selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';

                if (
                    $args['selected_date'] &&
                    $cart_item_selected_date !== $args['selected_date']
                ) {
                    continue;
                }
                $sd = \StachethemesSeatPlannerLite\Utils::normalize_seat_data_meta($cart_item['seat_data']);
                $seats_in_cart[] = $sd['seatId'] ?? '';
            }
        }

        return $seats_in_cart;
    }
}
