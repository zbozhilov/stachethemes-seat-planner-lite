<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Auditorium_Product extends \WC_Product {

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

    public function has_stop_date_passed() {

        $stop_date = get_post_meta($this->id, '_stsp_stop_date', true); // datetime-local value

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

        $is_forced_out_of_stock = 'yes' === get_post_meta($this->id, '_stsp_force_out_of_stock', true);

        if ($is_forced_out_of_stock) {
            return false;
        }

        if ($this->has_stop_date_passed()) {
            return false;
        }

        return $this->has_free_seats();
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

        $min = (float) get_post_meta($this->id, '_stsp_price_min', true);
        $max = (float) get_post_meta($this->id, '_stsp_price_max', true);

        if ($min === $max) {

            if (! $min) {
                return esc_html__('Free', 'stachethemes-seat-planner-lite');
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
        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Add to cart: &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite') : esc_html__('Read more about &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_add_to_cart_description', sprintf($text, $this->get_name()), $this);
    }

    public function add_to_cart_url() {
        return apply_filters('woocommerce_product_add_to_cart_url', $this->get_permalink(), $this);
    }

    public function add_to_cart_text() {

        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Select Seat', 'stachethemes-seat-planner-lite') : esc_html__('Read more', 'stachethemes-seat-planner-lite');

        return apply_filters('woocommerce_product_add_to_cart_text', $text, $this);
    }

    public function single_add_to_cart_text() {
        $text = esc_html__('Select Seat', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_single_add_to_cart_text', $text, $this);
    }

    public function get_seat_plan_data($context = 'raw') {

        $data = get_post_meta($this->id, '_stsp_seat_planner_data', true);

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

    public function is_seat_taken($seat_id) {

        $taken_seats = $this->get_taken_seats();

        return in_array($seat_id, $taken_seats);
    }

    public function has_free_seats() {
        $seat_data = $this->get_seat_plan_data('object');

        if (!$seat_data || !isset($seat_data->objects)) {
            return false;
        }

        $seats = array_filter($seat_data->objects, fn($object) => $object->type === 'seat' && $object->seatId !== '');

        return count($seats) > count($this->get_taken_seats());
    }

    public function add_to_cart($seat_id) {

        if ($this->is_seat_taken($seat_id)) {
            /* translators: %s: seat id */
            throw new \Exception(sprintf(esc_html__('Seat %s is already taken', 'stachethemes-seat-planner-lite'), esc_html($seat_id)));
        }

        $seat_data = $this->get_seat_data($seat_id);

        if (!$seat_data) {
            throw new \Exception(esc_html__('Seat not found', 'stachethemes-seat-planner-lite'));
        }

        $cart = WC()->cart;

        foreach ($cart->get_cart() as $cart_item) {
            if (isset($cart_item['seat_data']) && $cart_item['seat_data']->seatId === $seat_id) {
                $cart->remove_cart_item($cart_item['key']);
            }
        }

        $cart_item_key = $cart->generate_cart_id($this->get_id());

        $cart_item_data = [
            'seat_data'     => $seat_data
        ];

        apply_filters('stsp_before_add_to_cart', $this, $seat_id);

        $cart_item_key = $cart->add_to_cart($this->get_id(), 1, 0, [], $cart_item_data, $cart_item_key);

        apply_filters('stsp_after_add_to_cart', $this, $seat_id, $cart_item_key, $cart);

        return $cart_item_key;
    }

    public function get_taken_seats(): array {

        $taken_seats = $this->get_meta('_taken_seat', false);

        if (!$taken_seats) {
            $taken_seats = [];
        }
    
        // Extract seat IDs from metadata if they are WC_Meta_Data objects
        
        $seat_ids = array_map(function($seat) {
            if (is_a($seat, 'WC_Meta_Data')) {
                return $seat->value;
            }
            return $seat;
        }, $taken_seats);
    
        // Applying filter so that Slot Reservation class can add its own reserved seats to the list
        $taken_seats = array_unique(apply_filters('stsp_get_taken_seats', $seat_ids, $this));
    
        // Retrieve seat plan data
        $seat_plan = $this->get_seat_plan_data('object');
    
        // Filter out seats that are not present in the seat plan
        // In situations where the seat plan has been updated after the product was created
        if ($seat_plan && isset($seat_plan->objects)) {
            $seat_plan_seats = array_filter(
                $seat_plan->objects,
                function($object) {
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

}
