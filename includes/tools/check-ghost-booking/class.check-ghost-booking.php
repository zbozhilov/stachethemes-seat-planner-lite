<?php

namespace Stachethemes\SeatPlannerLite;

/**
 * Ghost Booking Checker
 * 
 * Detects seats that appear "free" on the front-end but actually have orders 
 * associated with them. This indicates a data inconsistency where the seat's 
 * "_taken_seat" meta is missing but there's an order claiming that seat.
 */
class Check_Ghost_Booking {

    /**
     * Get all orders for a specific product that contain seat bookings
     */
    private static function get_orders_by_product_id($product_id) {

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
                    break;
                }
            }
        }

        return $orders_with_this_product_id;
    }

    /**
     * Extract seat data from order items
     */
    private static function get_order_items($order, $filter_by_product_id) {
        $items = [];
        $order_items = $order->get_items();

        foreach ($order_items as $item) {

            $product_id = $item->get_product_id();

            if ($product_id !== $filter_by_product_id) {
                continue;
            }

            $seat_data = (array) $item->get_meta('seat_data');

            if (!$seat_data) {
                continue;
            }

            $seat_id       = isset($seat_data['seatId']) ? $seat_data['seatId'] : '';
            $selected_date = isset($seat_data['selectedDate']) ? $seat_data['selectedDate'] : '';

            if (!$seat_id) {
                continue;
            }

            $items[] = [
                'order_id'      => $order->get_id(),
                'product_id'    => $product_id,
                'seat_id'       => $seat_id,
                'selected_date' => $selected_date,
                'order_status'  => $order->get_status()
            ];
        }

        return $items;
    }

    /**
     * Get all auditorium product IDs
     */
    public static function get_auditorium_product_ids() {
        $products_to_test = wc_get_products([
            'status' => 'publish',
            'limit'  => -1,
            'type'   => 'auditorium',
            'return' => 'ids'
        ]);

        return $products_to_test;
    }

    /**
     * Get taken seats from product meta for a specific date
     */
    private static function get_taken_seats_from_meta($product, $selected_date = '') {
        
        $meta_key = '_taken_seat';

        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $taken_seats = $product->get_meta($meta_key, false);

        if (!$taken_seats) {
            return [];
        }

        // Extract seat IDs from metadata if they are WC_Meta_Data objects
        $seat_ids = array_map(function ($seat) {
            if (is_a($seat, 'WC_Meta_Data')) {
                return $seat->value;
            }
            return $seat;
        }, $taken_seats);

        return array_unique($seat_ids);
    }

    /**
     * Get all unique dates from orders for a product
     */
    private static function get_unique_dates_from_orders($orders, $product_id) {
        $dates = [''];  // Include empty string for non-date specific bookings

        foreach ($orders as $order) {
            $order_items = self::get_order_items($order, $product_id);

            foreach ($order_items as $item) {
                $selected_date = $item['selected_date'];
                if (!in_array($selected_date, $dates, true)) {
                    $dates[] = $selected_date;
                }
            }
        }

        return $dates;
    }

    /**
     * Check a product for ghost bookings (seats with orders that appear free)
     */
    public static function check_product_for_ghost_booking($product_id) {
        
        /** @var Auditorium_Product $product */
        $product = wc_get_product($product_id);

        if (!$product || !$product->is_type('auditorium')) {
            return [
                'product_id'     => $product_id,
                // translators: %d - product ID
                'product_name'   => sprintf(esc_html__('Product #%d (Invalid)', 'stachethemes-seat-planner-lite'), $product_id),
                'ghost_seats'    => [],
                'has_ghost_seats' => false
            ];
        }

        $orders      = self::get_orders_by_product_id($product_id);
        $ghost_seats = [];

        // Get all unique dates from orders
        $unique_dates = self::get_unique_dates_from_orders($orders, $product_id);

        // For each date, check which ordered seats are not marked as taken
        foreach ($unique_dates as $selected_date) {
            
            // Get seats marked as taken in the product meta for this date
            $taken_seats_in_meta = self::get_taken_seats_from_meta($product, $selected_date);

            // Get all seats with orders for this date
            foreach ($orders as $order) {
                $order_items = self::get_order_items($order, $product_id);

                foreach ($order_items as $item) {
                    
                    // Skip items with different dates
                    if ($item['selected_date'] !== $selected_date) {
                        continue;
                    }

                    $seat_id  = $item['seat_id'];
                    $order_id = $item['order_id'];

                    // If seat has an order but is NOT marked as taken in meta = ghost seat
                    if (!in_array($seat_id, $taken_seats_in_meta, true)) {
                        
                        // Create composite key to track unique ghost seats
                        $composite_key = $seat_id . '|' . $selected_date;

                        if (!isset($ghost_seats[$composite_key])) {
                            $ghost_seats[$composite_key] = [
                                'seat_id'       => $seat_id,
                                'selected_date' => $selected_date,
                                'order_ids'     => [],
                                'order_statuses' => []
                            ];
                        }

                        if (!in_array($order_id, $ghost_seats[$composite_key]['order_ids'], true)) {
                            $ghost_seats[$composite_key]['order_ids'][] = $order_id;
                            $ghost_seats[$composite_key]['order_statuses'][] = $item['order_status'];
                        }
                    }
                }
            }
        }

        // Convert to indexed array and add order count
        $ghost_seats_array = [];
        foreach ($ghost_seats as $data) {
            $data['order_count'] = count($data['order_ids']);
            $ghost_seats_array[] = $data;
        }

        // Get product name
        $product_name = $product->get_name();

        return [
            'product_id'      => $product_id,
            'product_name'    => $product_name,
            'ghost_seats'     => $ghost_seats_array,
            'has_ghost_seats' => !empty($ghost_seats_array)
        ];
    }

    /**
     * Check all auditorium products for ghost bookings
     */
    public static function get_ghost_bookings_for_products() {

        $result = [];
        $products_to_test = self::get_auditorium_product_ids();

        foreach ($products_to_test as $product_id) {
            $product_result = self::check_product_for_ghost_booking($product_id);
            $result[] = $product_result;
        }

        return $result;
    }

    /**
     * Fix ghost booking by adding the seat to the taken meta
     */
    public static function fix_ghost_booking($product_id, $seat_id, $selected_date = '') {
        
        /** @var Auditorium_Product $product */
        $product = wc_get_product($product_id);

        if (!$product || !$product->is_type('auditorium')) {
            return false;
        }

        // Add the seat to taken meta
        $product->add_meta_taken_seat($seat_id, $selected_date);
        $product->save();

        return true;
    }
}

