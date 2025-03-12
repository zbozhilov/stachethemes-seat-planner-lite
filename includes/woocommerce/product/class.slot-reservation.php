<?php

namespace Stachethemes\SeatPlannerLite;

/**
 * Slot Reservation class
 * This class is responsible for reserving seats in the cart for a certain amount of time
 * By default when a customer adds a seat to the cart, it will be reserved for 24 hours
 * If the customer doesn't complete the order in that time, the seat will be available again
 */
class Slot_Reservation {

    private static $reserve_time = 0;

    public static function init() {

        self::$reserve_time = max(0, (int) apply_filters('stsp_reserve_time', get_option('stsp_reserve_time', 24 * 60)));

        // WooCommerce Settings > Products
        add_filter('woocommerce_get_settings_products', [__CLASS__, 'add_settings'], 10, 1);
        add_action('woocommerce_update_options_products', [__CLASS__, 'save_settings'], 10, 1);

        if (!self::$reserve_time) {
            return; // No need to continue if reservation time is 0
        }

        add_filter('stsp_before_add_to_cart', [__CLASS__, 'verify_seat_not_reserved'], 10, 2);
        add_filter('stsp_after_add_to_cart', [__CLASS__, 'reserve_seat'], 10, 4);
        add_filter('stsp_get_taken_seats', [__CLASS__, 'attach_reserved_seats_to_taken_seats'], 10, 2);
        add_action('woocommerce_remove_cart_item', [__CLASS__, 'remove_reserved_seat'], 10, 2);
    }

    public static function add_settings($settings) {

        $settings[] = [
            'title' => esc_html__('Seat Reservation', 'stachethemes-seat-planner-lite'),
            'type'  => 'title',
            'desc'  => '',
            'id'    => 'stsp_seat_reservation',
        ];

        $settings[] = [
            'title'    => esc_html__('Seat Reservation Time', 'stachethemes-seat-planner-lite'),
            'desc'     => esc_html__('The time in minutes that a seat will be reserved in the cart.', 'stachethemes-seat-planner-lite'),
            'id'       => 'stsp_reserve_time',
            'type'     => 'number',
            'default'  => self::$reserve_time,
            'desc_tip' => true,
        ];

        $settings[] = [
            'type' => 'sectionend',
            'id'   => 'stsp_seat_reservation',
        ];

        return $settings;
    }

    public static function save_settings($settings) {

        $nonce_value = isset($_POST['_wpnonce']) ? wp_unslash($_POST['_wpnonce']) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

        if (!wp_verify_nonce($nonce_value, 'woocommerce-settings')) {
            return;
        }

        $reserve_time = isset($_POST['stsp_reserve_time']) ? (int) $_POST['stsp_reserve_time'] : 0;

        update_option('stsp_reserve_time', max(0, $reserve_time));
    }

    private static function get_seats_in_cart($product_id) {

        $cart = WC()->cart;

        if (!$cart) {
            return [];
        }

        $cart_contents = WC()->cart->get_cart();

        $seats = [];

        foreach ($cart_contents as $cart_item_key => $cart_item) {
            if ($cart_item['product_id'] == $product_id && isset($cart_item['seat_data'])) {
                $seats[] = $cart_item['seat_data']->seatId;
            }
        }

        return $seats;
    }

    private static function get_reserved_transients_by_product_id($product_id) {
        global $wpdb;

        $current_time = time();
        $product_id   = (int) $product_id;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
        $transients = $wpdb->get_col(
            $wpdb->prepare(
                "SELECT t.option_name 
                 FROM %i t
                 INNER JOIN %i timeout 
                 ON timeout.option_name = CONCAT('_transient_timeout_', SUBSTRING(t.option_name, CHAR_LENGTH('_transient_') + 1))
                 WHERE t.option_name LIKE %s
                 AND timeout.option_value > %d",
                $wpdb->options,
                $wpdb->options,
                $wpdb->esc_like("_transient_stsp_reserved_seat_{$product_id}_") . '%',
                $current_time
            )
        );

        return $transients;
    }

    public static function attach_reserved_seats_to_taken_seats($taken_seats, $product) {

        if (!self::$reserve_time) {
            return $taken_seats;
        }

        $transients = self::get_reserved_transients_by_product_id($product->get_id());

        if (!is_array($transients) || !$transients) {
            return $taken_seats;
        }

        $seats_in_cart = self::get_seats_in_cart($product->get_id());

        foreach ($transients as $transient) {
            $seat_id          = explode('_', $transient);
            $seat_id          = end($seat_id);

            if (!in_array($seat_id, $seats_in_cart)) {
                $taken_seats[] = $seat_id;
            }
        }

        return $taken_seats;
    }

    public static function verify_seat_not_reserved($product, $seat_id) {

        $product_id = $product->get_id();

        if (self::is_seat_reserved($product_id, $seat_id)) {
            throw new \Exception(esc_html__('This seat was just added to another cart. Please select another seat or try again later.', 'stachethemes-seat-planner-lite'));
        }
    }

    public static function is_seat_reserved($product_id, $seat_id) {
        $result     = get_transient("stsp_reserved_seat_{$product_id}_{$seat_id}");
        return $result;
    }

    public static function reserve_seat($product, $seat_id, $cart_item_key, $cart) {

        if (!$cart_item_key) {
            return;
        }

        $product_id = $product->get_id();

        self::release_transient($product_id, $seat_id);
        self::insert_transient($product_id, $seat_id);
    }

    public static function remove_reserved_seat($cart_item_key, $cart) {

        if (!isset($cart->cart_contents[$cart_item_key]['seat_data'])) {
            return;
        }

        $product_id = $cart->cart_contents[$cart_item_key]['product_id'];
        $seat_id = $cart->cart_contents[$cart_item_key]['seat_data']->seatId;

        self::release_transient($product_id, $seat_id);
    }

    public static function release_transient($product_id, $seat_id) {
        delete_transient("stsp_reserved_seat_{$product_id}_{$seat_id}");
    }

    public static function insert_transient($product_id, $seat_id) {
        set_transient("stsp_reserved_seat_{$product_id}_{$seat_id}", $seat_id, self::$reserve_time * 60);
    }
}

Slot_Reservation::init();
