<?php

namespace Stachethemes\SeatPlannerLite;

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
            $selected_date = $seat_data['selectedDate'];

            if (!$product || !$product->is_type('auditorium') || !$seat_id) {
                continue;
            }

            $status_groups = [
                'reserve' => ['pending'],
                'confirm' => ['completed', 'processing', 'on-hold'],
                'cancel'  => ['cancelled', 'failed', 'refunded']
            ];

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
                        'reserve_time'  => 1440,
                        'selected_date' => $selected_date
                    ]);

                    break;

                case 'confirm':

                    $product->delete_meta_taken_seat($seat_id, $selected_date);
                    $product->add_meta_taken_seat($seat_id, $selected_date);
                    $product->save_meta_data();
                    Slot_Reservation::release_transient($product_id, $seat_id, $selected_date);
                    break;

                case 'cancel':
                    $booking_data                = new Bookings_Data($product_id);
                    $orders_with_seat_id         = $booking_data->get_orders_with_seat($seat_id, $selected_date);
                    $other_orders_with_this_seat = array_diff($orders_with_seat_id, [$that->get_id()]);

                    if (!empty($other_orders_with_this_seat)) {
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
}


