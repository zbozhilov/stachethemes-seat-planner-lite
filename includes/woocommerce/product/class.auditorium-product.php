<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Auditorium_Product extends \WC_Product {

    protected function get_auditorium_meta_value(string $key,  bool $single = \false) {

        $value = $this->get_meta($key, $single);

        if (! $value) {

            // Check for deprecated meta keys ( prior 1.0.6)

            $legacy_key = str_replace('stachesepl', 'stsp', $key);
            $deprecated_value = $this->get_meta($legacy_key, $single);
            if ($deprecated_value) {
                $value = $deprecated_value;
            }
        }

        return $value;
    }

    public function get_type() {
        return 'auditorium';
    }

    public function __construct($product) {
        parent::__construct($product);
    }

    public function is_sold_individually() {
        return true;
    }

    public function is_purchasable() {

        $condition = $this->exists() && ('publish' === $this->get_status() || current_user_can('edit_post', $this->get_id()));

        return apply_filters('woocommerce_is_purchasable', $condition, $this);
    }

    public function managing_stock() {
        return false;
    }

    public function backorders_allowed() {
        return false;
    }

    public function has_date_passed($date) {

        if (! $date) {
            return false;
        }

        $server_timezone = new \DateTimeZone(date_default_timezone_get());
        $now             = new \DateTime('now', $server_timezone);
        $date_object     = \DateTime::createFromFormat('Y-m-d\TH:i', $date, $server_timezone);

        if (! $date_object) {
            return false;
        }

        return $now >= $date_object;
    }

    public function has_stop_date_passed() {

        $stop_date = $this->get_auditorium_meta_value('_stachesepl_stop_date', true); // datetime-local value

        if (! $stop_date) {
            return false;
        }

        $server_timezone = new \DateTimeZone(date_default_timezone_get());

        $stop_date_object = \DateTime::createFromFormat('Y-m-d\TH:i', $stop_date, $server_timezone);

        if (! $stop_date_object) {
            return false;
        }

        $now = new \DateTime('now', $server_timezone);

        return $now >= $stop_date_object;
    }

    public function is_in_stock() {

        $is_forced_out_of_stock = 'yes' === $this->get_auditorium_meta_value('_stachesepl_force_out_of_stock', true);

        if ($is_forced_out_of_stock) {
            return false;
        }

        if ($this->has_stop_date_passed()) {
            return false;
        }

        if (! $this->has_available_dates()) {
            return false;
        }

        return $this->has_free_seats();
    }

    public function has_available_dates() {

        $has_any_dates = $this->get_dates_data();

        if (empty($has_any_dates)) {
            return true; // This product doesn't use dates
        }

        return !empty($this->get_available_dates());
    }

    public function is_virtual() {
        return true;
    }

    public function set_virtual($virtual) {
        $this->set_prop('virtual', true);
    }

    public function get_virtual($context = 'view') {
        return true;
    }

    public function get_stock_quantity($context = 'view') {
        return 0;
    }

    public function get_price_html($context = 'view') {

        $min = (float) $this->get_auditorium_meta_value('_stachesepl_price_min', true);
        $max = (float) $this->get_auditorium_meta_value('_stachesepl_price_max', true);

        if ($min === $max) {

            if (! $min) {
                return esc_html__('Free', 'stachethemes-seat-planner-lite')
;
            }

            return wc_price($min);
        }


        return wc_price($min) . ' - ' . wc_price($max);
    }

    public function get_price($context = 'view') {
        return parent::get_price($context) ?: 0;
    }

    public function add_to_cart_description() {
        /* translators: %s: product name */
        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Add to cart: &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite')
 : esc_html__('Read more about &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite')
;
        return apply_filters('woocommerce_product_add_to_cart_description', sprintf($text, $this->get_name()), $this);
    }

    public function add_to_cart_url() {
        return apply_filters('woocommerce_product_add_to_cart_url', $this->get_permalink(), $this);
    }

    public function add_to_cart_text() {

        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Select Seat', 'stachethemes-seat-planner-lite')
 : esc_html__('Read more', 'stachethemes-seat-planner-lite')
;

        return apply_filters('woocommerce_product_add_to_cart_text', $text, $this);
    }

    public function single_add_to_cart_text() {
        $text = esc_html__('Select Seat', 'stachethemes-seat-planner-lite')
;
        return apply_filters('woocommerce_product_single_add_to_cart_text', $text, $this);
    }

    public function get_seat_plan_data($context = 'raw') {

        $data = $this->get_auditorium_meta_value('_stachesepl_seat_planner_data', true);

        switch ($context) {

            case 'object': {

                    if (!$data) {

                        return [
                            'workflowProps' => [],
                            'objects'       => []
                        ];
                    }

                    return json_decode($data);
                }

            default: {
                    return $data;
                }
        }
    }

    public function get_seat_data($seat_id) {

        $seat_data = $this->get_seat_plan_data('object');

        $objects = $seat_data->objects;

        if (!is_array($objects) || empty($objects)) {
            return false;
        }

        foreach ($objects as $object) {

            if ($object->type !== 'seat') {
                continue;
            }

            if ($object->seatId === $seat_id) {
                return $object;
            }
        }

        return false;
    }

    public function is_seat_taken($seat_id, $selected_date = '') {

        $taken_seats_args = [];

        if ($selected_date) {
            $taken_seats_args['selected_date'] = $selected_date;
        }

        $taken_seats = $this->get_taken_seats($taken_seats_args);

        return in_array($seat_id, $taken_seats);
    }

    public function get_available_seats() {

        $seat_data = $this->get_seat_plan_data('object');

        if (!$seat_data || !isset($seat_data->objects)) {
            return false;
        }

        // Filter out objects that are not seats or don't have a seat ID or has seat status 'unavailable'
        $seats = array_filter($seat_data->objects, function ($object) {
            return $object->type === 'seat' &&
                !empty($object->seatId) &&
                (!isset($object->status) || $object->status !== 'unavailable' && $object->status !== 'sold-out');
        });

        return $seats;
    }

    public function get_available_seats_count() {
        return count($this->get_available_seats());
    }

    public function get_taken_seats_count() {
        return count($this->get_taken_seats());
    }

    public function has_free_seats() {
        return $this->get_available_seats_count() > $this->get_taken_seats_count();
    }

    public function add_to_cart($seat_id, $discount = '', $selected_date = '') {

        if ($this->is_seat_taken($seat_id, $selected_date)) {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s is already taken', 'stachethemes-seat-planner-lite')
, esc_html($seat_id)));
        }

        $seat_data = $this->get_seat_data($seat_id);

        $seat_status = isset($seat_data->status) ? $seat_data->status : '';

        if ($seat_status === 'unavailable') {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s is unavailable', 'stachethemes-seat-planner-lite')
, esc_html($seat_id)));
        }

        if ($seat_status === 'on-site') {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s can only be purchased at the venue.', 'stachethemes-seat-planner-lite')
, esc_html($seat_id)));
        }

        if (!$seat_data) {
            throw new \Exception(esc_html__('Seat not found', 'stachethemes-seat-planner-lite')
);
        }

        $cart = WC()->cart;

        foreach ($cart->get_cart() as $cart_item) {

            $cart_item_selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';

            if (
                isset($cart_item['seat_data']) &&
                $cart_item['seat_data']->seatId === $seat_id &&
                $cart_item_selected_date  === $selected_date
            ) {
                $cart->remove_cart_item($cart_item['key']);
            }
        }

        $cart_item_key = $cart->generate_cart_id($this->get_id());

        $cart_item_data = [
            'seat_data'     => $seat_data,
            'seat_discount' => $this->get_discount_by_name($discount),
            'selected_date' => $selected_date
        ];

        // Check if transient exists for this seat and throw an exception if it does
        apply_filters('stachesepl_before_add_to_cart', $this, $seat_id, $selected_date);

        $cart_item_key = $cart->add_to_cart($this->get_id(), 1, 0, [], $cart_item_data, $cart_item_key);

        // Insert transient to reserve the seat temporarily
        apply_filters('stachesepl_after_add_to_cart', $this, $seat_id, $cart_item_key, $cart, $selected_date);

        return $cart_item_key;
    }

    public function get_taken_seats($args = []): array {

        $default_args = [
            'selected_date' => ''
        ];

        $args          = wp_parse_args($args, $default_args);
        $taken_seats   = $this->get_meta_taken_seat($args['selected_date']);

        if (!$taken_seats) {
            $taken_seats = [];
        }

        // Extract seat IDs from metadata if they are WC_Meta_Data objects
        $seat_ids = array_map(function ($seat) {
            if (is_a($seat, 'WC_Meta_Data')) {
                return $seat->value;
            }
            return $seat;
        }, $taken_seats);

        // Applying filter so that Slot Reservation class can add its own reserved seats to the list
        $taken_seats = array_unique(apply_filters('stachesepl_get_taken_seats', $seat_ids, $this, $args['selected_date']));

        // Retrieve seat plan data
        $seat_plan = $this->get_seat_plan_data('object');

        // Filter out seats that are not present in the seat plan
        // In situations where the seat plan has been updated after the product was created
        if ($seat_plan && isset($seat_plan->objects)) {
            $seat_plan_seats = array_filter(
                $seat_plan->objects,
                function ($object) {
                    return $object->type === 'seat' && !empty($object->seatId);
                }
            );

            $valid_seat_ids = array_column($seat_plan_seats, 'seatId');
            $taken_seats = array_values(array_intersect($taken_seats, $valid_seat_ids));
        }

        return $taken_seats;
    }

    public function get_seat_price($seat_id) {

        $seat_data = $this->get_seat_data($seat_id);

        if (!$seat_data) {
            return 0;
        }

        return (float) $seat_data->price;
    }

    public function get_dates_data() {

        // Expects a data in the following format:
        // Array
        // (
        //     [0] => 2025-11-28T10:00 [1] => 2025-11-29T10:00 [2] 
        // )

        $data = $this->get_auditorium_meta_value('_stachesepl_seat_planner_dates_data', true);

        if (!is_array($data)) {
            return [];
        }

        return $data;
    }

    /**
     * Returns the available dates for the product
     * @return array|false
     * Returns false if the product does not have option to Select Dates
     * Returns an array of available dates if the product has option to Select Dates
     * The array is in the following format:
     * Array
     * (
     *     [0] => 2025-11-28T10:00 [1] => 2025-11-29T10:00 [2] 
     * )
     */
    public function get_available_dates() {
        $date_now = new \DateTime('now');
        $dates    = $this->get_dates_data();

        if (empty($dates)) {
            return false; // Does not have option to Select Dates
        }

        $available_dates = [];

        foreach ($dates as $date) {
            $date_object = \DateTime::createFromFormat('Y-m-d\TH:i', $date);

            if ($date_object > $date_now) {
                $available_dates[] = $date_object->format('Y-m-d\TH:i');
            }
        }

        sort($available_dates);

        return $available_dates;
    }

    public function get_discounts_data() {

        // Expects a data in the following format:
        // Array
        // (
        //     [0] => stdClass Object
        //         (
        //             [group] => string
        //             [name] => string
        //             [type] => percentage | fixed
        //             [value] => float
        //         )
        // )

        $data = $this->get_auditorium_meta_value('_stachesepl_seat_planner_discounts_data', true);

        if (!is_array($data)) {
            return [];
        }

        return $data;
    }

    public function get_discount_by_name($name): array|false {

        if (empty($name)) {
            return false;
        }

        $discounts = $this->get_discounts_data();

        if (empty($discounts)) {
            return false;
        }

        // Find the discount by name
        $found = array_filter($discounts, function ($discount) use ($name) {
            return isset($discount->name) && $discount->name === $name;
        });

        if (empty($found)) {
            return false;
        }

        // Get the first matching discount
        $discount = reset($found);

        return [
            'group' => $discount->group ?? '',
            'name'  => $discount->name,
            'value' => max(0, (float)$discount->value),
            'type'  => $discount->type
        ];
    }

    public function validate_cart_item_discount($cart_item): bool {
        $cart_item_discount = $cart_item['seat_discount'] ?? false;

        // If no discount in cart item, it's valid
        if (!$cart_item_discount) {
            return true;
        }

        // Get the current discount data from product
        $discount = $this->get_discount_by_name($cart_item_discount['name']);

        // If discount no longer exists, cart item is invalid
        if (!$discount) {
            return false;
        }

        // Validate that discount details match
        if (
            $cart_item_discount['value'] !== $discount['value'] ||
            $cart_item_discount['type'] !== $discount['type'] ||
            $cart_item_discount['group'] !== $discount['group']
        ) {
            return false;
        }

        // If no discount group specified, no further validation needed
        if (empty($cart_item_discount['group'])) {
            return true;
        }

        // Validate that seat belongs to the correct discount group
        $seat_group = $cart_item['seat_data']->group ?? '';

        return $cart_item_discount['group'] === $seat_group;
    }

    public function get_seat_status($seat_id) {

        $seat_data = $this->get_seat_data($seat_id);

        if (!$seat_data) {
            return false;
        }

        return isset($seat_data->status) ? $seat_data->status : '';
    }

    public function get_seats_in_cart($args = []) {

        $default_args = [
            'selected_date' => ''
        ];

        $args = wp_parse_args($args, $default_args);

        $cart = WC()->cart;

        $cart_items = $cart->get_cart();

        $seats_in_cart = [];

        foreach ($cart_items as $cart_item) {

            if (isset($cart_item['seat_data']) && $cart_item['product_id'] === $this->get_id()) {

                $cart_item_selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';

                if (
                    $args['selected_date'] &&
                    $cart_item_selected_date !== $args['selected_date']
                ) {
                    continue;
                }
                $seats_in_cart[] = $cart_item['seat_data']->seatId;
            }
        }

        return $seats_in_cart;
    }

    public function delete_meta_taken_seat($seat_id, $selected_date = '') {
        $meta_key = '_taken_seat';
        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $this->delete_meta_data_value($meta_key, $seat_id);
    }

    public function add_meta_taken_seat($seat_id, $selected_date = '') {

        $meta_key = '_taken_seat';

        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $this->add_meta_data($meta_key, $seat_id, false);
    }

    public function get_meta_taken_seat($selected_date = '') {

        $meta_key = '_taken_seat';

        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $taken_seats = $this->get_meta($meta_key, false);

        return $taken_seats;
    }

    public function get_meta_taken_seat_keys() {

        $meta_keys = $this->get_meta_data();
        $taken_seat_keys = [];

        foreach ($meta_keys as $meta_key) {
            $key = $meta_key->key;

            if (strpos($key, '_taken_seat') === 0) {
                $taken_seat_keys[] = $key;
            }
        }

        return $taken_seat_keys;
    }
}
