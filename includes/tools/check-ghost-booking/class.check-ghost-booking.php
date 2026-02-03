<?php

namespace StachethemesSeatPlannerLite;

/**
 * Ghost Booking Checker
 * 
 * Detects seats that appear "free" on the front-end but actually have orders 
 * associated with them. This indicates a data inconsistency where the seat's 
 * "_taken_seat" meta is missing but there's an order claiming that seat.
 */
class Check_Ghost_Booking {

    /**
     * Extract seat data from order items
     *
     * @return list<array{order_id: int, product_id: int, seat_id: string, selected_date: string, order_status: string}>
     */
    private static function get_order_items(\WC_Order $order, int $filter_by_product_id): array {
        $base_items = Order_Helper::get_order_items($order, $filter_by_product_id);
        $items = [];

        foreach ($base_items as $base_item) {
            $items[] = [
                'order_id'      => $base_item['order_id'],
                'product_id'    => $base_item['product_id'],
                'seat_id'       => $base_item['seat_id'],
                'selected_date' => $base_item['selected_date'],
                'order_status'  => $order->get_status()
            ];
        }

        return $items;
    }

    /**
     * Get all auditorium product IDs
     *
     * @return list<int>
     */
    public static function get_auditorium_product_ids(): array {
        $products_to_test = wc_get_products([
            'status' => 'publish',
            'limit'  => -1,
            'type'   => 'auditorium',
            'return' => 'ids'
        ]);

        if (empty($products_to_test) || !is_array($products_to_test)) {
            return [];
        }

        return array_values(array_unique($products_to_test));
    }

    /**
     * Get taken seats from product meta for a specific date
     *
     * @return list<string>
     */
    private static function get_taken_seats_from_meta(\WC_Product $product, string $selected_date = ''): array {
        
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
            if (is_a($seat, '\WC_Meta_Data') && isset($seat->value)) {
                return $seat->value;
            }
            return $seat;
        }, $taken_seats);

        return array_values(array_unique($seat_ids));
    }

    /**
     * Get all unique dates from orders for a product
     *
     * @param list<\WC_Order> $orders
     * @return list<string>
     */
    private static function get_unique_dates_from_orders(array $orders, int $product_id): array {
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
     *
     * @return array{product_id: int, product_name: string, ghost_seats: list<array{seat_id: string, selected_date: string, order_ids: list<int>, order_statuses: list<string>, order_count?: int}>, has_ghost_seats: bool}
     */
    public static function check_product_for_ghost_booking(int $product_id): array {
        
        $product = wc_get_product($product_id);

        if (!$product || !$product->is_type('auditorium')) {

            /** @var Auditorium_Product $product */

            return [
                'product_id'     => $product_id,
                // translators: %d - product ID
                'product_name'   => sprintf(esc_html__('Product #%d (Invalid)', 'stachethemes-seat-planner-lite'), $product_id),
                'ghost_seats'    => [],
                'has_ghost_seats' => false
            ];
        }

        $orders      = Order_Helper::get_orders_by_product_id($product_id);
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
     *
     * @return list<array{product_id: int, product_name: string, ghost_seats: list<array{seat_id: string, selected_date: string, order_ids: list<int>, order_statuses: list<string>, order_count?: int}>, has_ghost_seats: bool}>
     */
    public static function get_ghost_bookings_for_products(): array {

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
    public static function fix_ghost_booking(int $product_id, string $seat_id, string $selected_date = ''): bool {
        
        $product = wc_get_product($product_id);

        if (!$product || !$product->is_type('auditorium')) {
            return false;
        }

        /** @var Auditorium_Product $product */

        // Add the seat to taken meta
        $product->add_meta_taken_seat($seat_id, $selected_date);
        $product->save();

        return true;
    }
}

