<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Cart_Validation {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_action('woocommerce_check_cart_items', [__CLASS__, 'validate_cart_items'], 20);
        add_action('woocommerce_cart_loaded_from_session', [__CLASS__, 'maybe_remove_items_from_cart'], 20, 1);
    }

    /**
     * Logic that fires when the cart is loaded, it determines if any items should be removed from the cart
     * If the seat is reserved by another user, it will be removed from the cart
     * @param WC_Cart $cart
     * @return void
     */
    public static function maybe_remove_items_from_cart($cart = null) {

        foreach ($cart->get_cart() as $cart_item) {

            if (!isset($cart_item['seat_data'])) {
                continue;
            }

            $seat_data     = $cart_item['seat_data'];
            $product_id    = $cart_item['product_id'];
            $selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';
            $seat_id       = $seat_data->seatId;
            $has_transient = Slot_Reservation::get_slot_transient($product_id, $seat_id, $selected_date);

            if (!$has_transient) {

                $reserve_time = Slot_Reservation::get_reserve_time();

                if ($reserve_time > 0) {
                    // If no transient is found, assume that 
                    // the seat lock has expired and remove the item from the cart
                    $cart->remove_cart_item($cart_item['key']);
                }

                continue;
            }

            $transient_session_id = $has_transient['session_id'];
            $current_session_id   = WC()->session->get_customer_id();

            if ((string) $transient_session_id !== (string) $current_session_id) {
                $cart->remove_cart_item($cart_item['key']);
            }
        }
    }

    public static function validate_cart_items() {
        $cart = WC()->cart;

        if ($cart->is_empty()) {
            return;
        }

        $cart_items = $cart->get_cart();
        $seats_by_product = [];

        foreach ($cart_items as $cart_item) {
            if (!isset($cart_item['seat_data'])) {
                continue;
            }

            $seat_data     = $cart_item['seat_data'];
            $product_id    = $cart_item['product_id'];
            $selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';
            $seat_id    = $seat_data->seatId;
            /** @var Auditorium_Product $product */
            $product    = wc_get_product($product_id);

            if (!$product || $product->get_type() !== 'auditorium') {
                wc_add_notice(
                    sprintf(
                        // translators: %s: product id
                        esc_html__('Product %s is not found', 'stachethemes-seat-planner-lite'),
                        esc_html($product_id)
                    ),
                    'error'
                );
                continue;
            }

            $seat_status = $product->get_seat_status($seat_id);

            if ($seat_id) {
                if (!isset($seats_by_product[$product_id])) {
                    $seats_by_product[$product_id] = [];
                }

                if (!isset($seats_by_product[$product_id][$selected_date])) {
                    $seats_by_product[$product_id][$selected_date] = [];
                }

                $seats_by_product[$product_id][$selected_date][$seat_id] = true;
            }

            if ($seat_status === 'unavailable') {
                wc_add_notice(
                    sprintf(
                        // translators: %s: seat id
                        esc_html__('Seat %s is unavailable', 'stachethemes-seat-planner-lite'),
                        esc_html($seat_id)
                    ),
                    'error'
                );
            }

            if ($seat_status === 'on-site') {
                wc_add_notice(
                    sprintf(
                        // translators: %s: seat id
                        esc_html__('Seat %s can only be purchased at the venue.', 'stachethemes-seat-planner-lite'),
                        esc_html($seat_id)
                    ),
                    'error'
                );
            }

            if ($seat_status === 'sold-out' || $product->is_seat_taken($seat_id, $selected_date)) {
                wc_add_notice(
                    sprintf(
                        // translators: %s: seat id
                        esc_html__('Seat %s is already taken. Please remove it from your cart and select a different seat.', 'stachethemes-seat-planner-lite'),
                        esc_html($seat_id)
                    ),
                    'error'
                );
            }
            
            if ($product->is_cut_off_time_passed($selected_date)) {
                wc_add_notice(
                    sprintf(
                        // translators: %1$s: selected date
                        // translators: %2$s: product name
                        esc_html__('The date "%1$s" for "%2$s" is no longer available', 'stachethemes-seat-planner-lite'),
                        esc_html(Utils::get_formatted_date_time($selected_date)),
                        esc_html($product->get_name()),
                    ),
                    'error'
                );
            }

            if (!$product->validate_cart_item_discount($cart_item)) {
                wc_add_notice(
                    sprintf(
                        // translators: %s: seat id
                        esc_html__('Discount for seat %s is not valid. Please remove it from your cart and select a different discount.', 'stachethemes-seat-planner-lite'),
                        esc_html($seat_id)
                    ),
                    'error'
                );
            }
        }

        foreach ($seats_by_product as $product_id => $dates_map) {

            foreach ($dates_map as $selected_date => $seat_ids_map) {

                $product = wc_get_product($product_id);

                if (!$product || $product->get_type() !== 'auditorium') {
                    wc_add_notice(
                        sprintf(
                            // translators: %s: product id
                            esc_html__('Product %s is not found', 'stachethemes-seat-planner-lite'),
                            esc_html($product_id)
                        ),
                        'error'
                    );
                    continue;
                }
            }
        }
    }
}
