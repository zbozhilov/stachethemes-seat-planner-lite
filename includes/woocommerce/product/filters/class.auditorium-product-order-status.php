<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Order_Status {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_action('woocommerce_order_status_changed', [__CLASS__, 'order_status_changed'], 10, 4);
        add_action('woocommerce_delete_order_items', [__CLASS__, 'before_delete_order_items'], 10);
        add_action('woocommerce_before_trash_order', [__CLASS__, 'before_trash_order'], 10, 2);

    }

    private static function get_status_groups() {
        return [
            'reserve' => ['pending'],
            'confirm' => ['completed', 'processing', 'on-hold'],
            'cancel'  => ['cancelled', 'failed', 'refunded']
        ];
    }

    private static function release_order_items($order) {

        $order = is_numeric($order) ? wc_get_order($order) : $order;

        $items = $order->get_items();

        foreach ($items as $item) {

            $seat_data = $item->get_meta('seat_data');

            if (!$seat_data) {
                continue;
            }

            if (!method_exists($item, 'get_product_id')) {
                continue;
            }

            $selected_date = $item->get_meta('selected_date');

            /** @var \WC_Order_Item_Product $item */
            $product_id = $item->get_product_id();
            /** @var Auditorium_Product $product */
            $product    = wc_get_product($product_id);
            $seat_id    = $seat_data->seatId;

            if (!$product || !$product->is_type('auditorium') || !$seat_id) {
                continue;
            }

            $product->delete_meta_taken_seat($seat_id, $selected_date);
            $product->save_meta_data();
        }
    }

    public static function order_status_changed($id, $status_transition_from, $status_transition_to, $that) {
        if (!$that->get_meta('has_auditorium_product')) {
            return;
        }

        if ($status_transition_from === $status_transition_to) {
            return;
        }

        $items = $that->get_items();

        foreach ($items as $item) {
            $seat_data = (array) $item->get_meta('seat_data');
            if (!$seat_data) {
                continue;
            }

            $product_id    = $item->get_product_id();
            /** @var Auditorium_Product $product */
            $product       = wc_get_product($product_id);
            $seat_id       = $seat_data['seatId'];
            $selected_date = $seat_data['selectedDate'] ?? '';

            if (!$product || !$product->is_type('auditorium') || !$seat_id) {
                continue;
            }

            $status_groups = self::get_status_groups();

            $target_group = null;
            foreach ($status_groups as $group => $statuses) {
                if (in_array($status_transition_to, $statuses)) {
                    $target_group = $group;
                    break;
                }
            }

            switch ($target_group) {
                case 'reserve':
                    $product->delete_meta_taken_seat($seat_id, $selected_date);
                    $product->save_meta_data();

                    Slot_Reservation::release_transient($product_id, $seat_id, $selected_date);
                    Slot_Reservation::insert_transient($product_id, $seat_id, [
                        'session_id'    => 'system',
                        'reserve_time'  => 1440 * 7, // lock for 7 days
                        'selected_date' => $selected_date
                    ]);

                    break;

                case 'confirm':

                    $product->add_meta_taken_seat($seat_id, $selected_date);
                    $product->save_meta_data();
                    Slot_Reservation::release_transient($product_id, $seat_id, $selected_date);

                    // Automatically complete paid orders if the option is enabled
                    if (Settings::get_setting('stachesepl_auto_confirm_paid_orders') === 'yes') {
                        if ($that->is_paid() && $that->get_status() !== 'completed') {
                            $that->update_status('completed');
                        }
                    }

                    break;

                case 'cancel':
                    $booking_data                = new Bookings_Data($product_id);
                    $orders_with_seat_id         = $booking_data->get_orders_with_seat($seat_id, $selected_date);
                    $other_orders_with_this_seat = array_diff($orders_with_seat_id, [$that->get_id()]);

                    if (!empty($other_orders_with_this_seat)) {
                        // Prevent release of a seat if it is already booked by another order
                        // Otherwise we risk to release a seat that was already confirmed by another order
                        continue 2;
                    }

                    $product->delete_meta_taken_seat($seat_id, $selected_date);
                    $product->save_meta_data();
                    Slot_Reservation::release_transient($product_id, $seat_id, $selected_date);

                    break;
            }
        }
    }

    public static function before_delete_order_items($order_id) {
        $order = wc_get_order($order_id);

        if (!$order || !$order->get_meta('has_auditorium_product')) {
            return;
        }

        $status_groups = self::get_status_groups();

        // Do nothing if the status is not in the 'confirm' group
        // Otherwise we risk to release a seat that was already confirmed by another order
        if (!in_array($order->get_status(), $status_groups['confirm'])) {
            return;
        }

        self::release_order_items($order);
    }

    // Notes
    // Trashing confirmed order will make the seats available again
    public static function before_trash_order($order_id, $prev_state) {

        $order = wc_get_order($order_id);

        if (!$order || !$order->get_meta('has_auditorium_product')) {
            return;
        }

        $status_groups = self::get_status_groups();

        // Do nothing if the status is not in the 'confirm' group
        // Otherwise we risk to release a seat that was already confirmed by another order
        if (!in_array($prev_state->get_status(), $status_groups['confirm'])) {
            return;
        }

        self::release_order_items($order);
    }
}
