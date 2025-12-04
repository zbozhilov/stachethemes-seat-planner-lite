<?php

namespace Stachethemes\SeatPlannerLite;

class Check_Double_Booking {

    private static function get_orders_by_product_id($product_id) {

        // Note 
        // 'auditorium_product_id' filter is not yet used since older versions of the plugin does not include this meta key.
        // That's why 'has_auditorium_product' is used instead and the orders are later checked for the $product_id

        $orders = wc_get_orders([
            'type'                   => 'shop_order',
            'status'                 => ['wc-completed', 'wc-processing', 'pending', 'on-hold'],
            'limit'                  => -1,
            'has_auditorium_product' => 1
        ]);

        if (empty($orders)) {
            return [];
        }

        $orders_with_this_product_id = [];

        foreach ($orders as $order) {
            $order_items = self::get_order_items($order, $product_id);

            foreach ($order_items as $item) {

                if ($item['product_id'] === $product_id) {
                    $orders_with_this_product_id[] = $order;
                    break; // No need to check other items in this order
                }
            }
        }

        return $orders_with_this_product_id;
    }

    private static function get_order_items($order, $filter_by_product_id) {
        $items = [];
        $order_items = $order->get_items();

        foreach ($order_items as $item) {

            $product_id = $item->get_product_id();

            if ($product_id !== $filter_by_product_id) {
                continue; // Skip items that do not match the product ID
            }

            $seat_data = (array) $item->get_meta('seat_data');

            if (!$seat_data) {
                continue;
            }

            $seat_id       = $seat_data['seatId'];
            $selected_date = isset($seat_data['selectedDate']) ? $seat_data['selectedDate'] : '';

            if (!$seat_id) {
                continue;
            }

            $items[] = [
                'order_id'      => $order->get_id(),
                'product_id'    => $product_id,
                'seat_id'       => $seat_id,
                'selected_date' => $selected_date
            ];
        }

        return $items;
    }

    public static function get_auditorium_product_ids() {
        $products_to_test = wc_get_products([
            'status' => 'publish',
            'limit'  => -1,
            'type'   => 'auditorium',
            'return' => 'ids'
        ]);

        return $products_to_test;
    }

    public static function check_product_for_double_booking($product_id) {
        $orders      = self::get_orders_by_product_id($product_id);
        $duplicates  = [];
        $seat_counts = [];

        foreach ($orders as $order) {
            $order_items = self::get_order_items($order, $product_id);

            foreach ($order_items as $item) {
                $seat_id       = $item['seat_id'];
                $order_id      = $item['order_id'];
                $selected_date = isset($item['selected_date']) ? $item['selected_date'] : '';

                // Create a composite key using seat_id and selected_date to avoid false positives
                // Same seat can be booked for different dates, which is not a double booking
                $composite_key = $seat_id . '|' . $selected_date;

                // Initialize seat count entry if it doesn't exist
                if (!isset($seat_counts[$composite_key])) {
                    $seat_counts[$composite_key] = [
                        'count'         => 0,
                        'orders'        => [],
                        'seat_id'       => $seat_id,
                        'selected_date' => $selected_date
                    ];
                }

                $seat_counts[$composite_key]['count']++;
                $seat_counts[$composite_key]['orders'][] = $order_id;
            }
        }

        foreach ($seat_counts as $composite_key => $data) {
            if ($data['count'] > 1) {
                $duplicates[] = [
                    'seat_id'       => $data['seat_id'],
                    'selected_date' => $data['selected_date'],
                    'count'         => $data['count'],
                    'order_ids'     => $data['orders']
                ];
            }
        }

        // Get product name
        $product = wc_get_product($product_id);
        // translators: %d - product ID
        $product_name = $product ? $product->get_name() : sprintf(esc_html__('Product #%d', 'stachethemes-seat-planner-lite'), $product_id);

        // Return product results
        return [
            'product_id'     => $product_id,
            'product_name'   => $product_name,
            'duplicates'     => $duplicates,
            'has_duplicates' => !empty($duplicates)
        ];
    }

    public static function get_double_bookings_for_products() {

        $result = [];

        $products_to_test = self::get_auditorium_product_ids();

        foreach ($products_to_test as $product_id) {
            $product_result = self::check_product_for_double_booking($product_id);
            $result[] = $product_result;
        }

        return $result;
    }
}
