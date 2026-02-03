<?php

namespace StachethemesSeatPlannerLite;

class Check_Double_Booking {

    /**
     * @return list<array{order_id: int, product_id: int, seat_id: string, selected_date: string}>
     */
    private static function get_order_items(\WC_Order $order, int $filter_by_product_id): array {
        $base_items = Order_Helper::get_order_items($order, $filter_by_product_id);
        $items = [];

        foreach ($base_items as $base_item) {
            $items[] = [
                'order_id'      => $base_item['order_id'],
                'product_id'    => $base_item['product_id'],
                'seat_id'       => $base_item['seat_id'],
                'selected_date' => $base_item['selected_date']
            ];
        }

        return $items;
    }

    /**
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
     * @return array{product_id: int, product_name: string, duplicates: list<array{seat_id: string, selected_date: string, count: int, order_ids: list<int>}>, has_duplicates: bool}
     */
    public static function check_product_for_double_booking(int $product_id): array {
        $orders      = Order_Helper::get_orders_by_product_id($product_id);
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

    /**
     * @return list<array{product_id: int, product_name: string, duplicates: list<array{seat_id: string, selected_date: string, count: int, order_ids: list<int>}>, has_duplicates: bool}>
     */
    public static function get_double_bookings_for_products(): array {

        $result = [];

        $products_to_test = self::get_auditorium_product_ids();

        foreach ($products_to_test as $product_id) {
            $product_result = self::check_product_for_double_booking($product_id);
            $result[] = $product_result;
        }

        return $result;
    }
}
