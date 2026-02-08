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
        add_action('woocommerce_refund_created', [__CLASS__, 'handle_partial_refund'], 10, 2);

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

            $seat_data = Utils::normalize_seat_data_meta($item->get_meta('seat_data'));

            if (empty($seat_data)) {
                continue;
            }

            if (!method_exists($item, 'get_product_id')) {
                continue;
            }

            /** @var \WC_Order_Item_Product $item */
            $selected_date = $item->get_meta('selected_date');
            $product_id    = $item->get_product_id();
            
            /** @var Auditorium_Product $product */
            $product    = wc_get_product($product_id);
            $seat_id    = $seat_data['seatId'] ?? '';

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
            
            $seat_data = Utils::normalize_seat_data_meta($item->get_meta('seat_data'));

            if (empty($seat_data)) {
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
                    // Skip items that have been refunded - don't create reservation for them
                    if (Order_Helper::is_item_refunded($that, $item->get_id())) {
                        continue 2;
                    }

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

                    // Skip items that have been refunded - don't re-add them as taken
                    if (Order_Helper::is_item_refunded($that, $item->get_id())) {
                        continue 2;
                    }

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

        if (!$order || !($order instanceof \WC_Order) || !$order->get_meta('has_auditorium_product')) {
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

    /**
     * Handle partial refunds - release only the specific seats that were refunded
     * 
     * @param int $refund_id The refund order ID
     * @param array $args Refund arguments
     */
    public static function handle_partial_refund($refund_id, $args) {
        $refund = wc_get_order($refund_id);

        if (!$refund || !($refund instanceof \WC_Order_Refund)) {
            return;
        }

        $parent_order = wc_get_order($refund->get_parent_id());

        if (!$parent_order || !($parent_order instanceof \WC_Order)) {
            return;
        }

        if (!$parent_order->get_meta('has_auditorium_product')) {
            return;
        }

        $status_groups = self::get_status_groups();

        // Only process if the parent order is in a confirmed state
        // If the order is already cancelled/refunded, the order_status_changed handler will take care of it
        if (!in_array($parent_order->get_status(), $status_groups['confirm'])) {
            return;
        }

        // Get all refunded items
        $refund_items = $refund->get_items();

        foreach ($refund_items as $refund_item) {
            // Get the original order item ID that was refunded
            $refunded_item_id = $refund_item->get_meta('_refunded_item_id');

            if (!$refunded_item_id) {
                continue;
            }

            // Get the original order item
            $original_item = $parent_order->get_item($refunded_item_id);

            if (!$original_item) {
                continue;
            }

            if (!method_exists($original_item, 'get_product_id')) {
                continue;
            }

            /** @var \WC_Order_Item_Product $original_item */
            $seat_data = Utils::normalize_seat_data_meta($original_item->get_meta('seat_data'));

            if (empty($seat_data)) {
                continue;
            }

            $product_id    = $original_item->get_product_id();
            /** @var Auditorium_Product $product */
            $product       = wc_get_product($product_id);
            $seat_id       = $seat_data['seatId'] ?? '';
            $selected_date = $seat_data['selectedDate'] ?? '';

            if (!$product || !$product->is_type('auditorium') || !$seat_id) {
                continue;
            }

            // Check if this seat is booked by another order before releasing
            $booking_data                = new Bookings_Data($product_id);
            $orders_with_seat_id         = $booking_data->get_orders_with_seat($seat_id, $selected_date);
            $other_orders_with_this_seat = array_diff($orders_with_seat_id, [$parent_order->get_id()]);

            if (!empty($other_orders_with_this_seat)) {
                // Seat is also in another confirmed order, don't release
                continue;
            }

            // Check if the item should be restocked
            // If not, skip releasing the seat
            if (empty($args['restock_items'])) {
                continue;
            }

            // Release the seat
            $product->delete_meta_taken_seat($seat_id, $selected_date);
            $product->save_meta_data();
            Slot_Reservation::release_transient($product_id, $seat_id, $selected_date);
        }
    }

    // Notes
    // Trashing confirmed order will make the seats available again
    public static function before_trash_order($order_id, $prev_state) {

        $order = wc_get_order($order_id);

        if (!$order || !($order instanceof \WC_Order) || !$order->get_meta('has_auditorium_product')) {
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
