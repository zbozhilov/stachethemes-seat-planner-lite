<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Order Helper
 * 
 * Provides common order-related utility methods used across multiple classes
 * to avoid code duplication and maintain consistency.
 */
class Order_Helper {

    /**
     * Check if a specific order item has been refunded
     * 
     * @param \WC_Order $order The order object
     * @param int $item_id The order item ID
     * @return bool True if the item has been refunded
     */
    public static function is_item_refunded(\WC_Order $order, int $item_id): bool {
        $qty_refunded = $order->get_qty_refunded_for_item($item_id);
        // qty_refunded returns negative value, so we check if it's less than 0
        return $qty_refunded < 0;
    }

    /**
     * Get order items for a specific product, excluding refunded items
     * 
     * @param \WC_Order $order The order object
     * @param int $filter_by_product_id Product ID to filter by
     * @param bool $include_refunded Whether to include refunded items (default: false)
     * @return list<array{item_id: int, order_id: int, product_id: int, seat_id: string, seat_data: array<string, mixed>, selected_date: string, price: float}>
     */
    public static function get_order_items(\WC_Order $order, int $filter_by_product_id = 0, bool $include_refunded = false): array {
        $items = [];
        $order_items = $order->get_items();

        foreach ($order_items as $item_id => $item) {
            /** @var \WC_Order_Item_Product $item */
            $product_id = $item->get_product_id();

            if ($filter_by_product_id > 0 && $product_id !== $filter_by_product_id) {
                continue; // Skip items that do not match the product ID
            }

            // Skip items that have been refunded (unless explicitly requested)
            if (!$include_refunded && self::is_item_refunded($order, $item_id)) {
                continue;
            }

            $seat_data = Utils::normalize_seat_data_meta($item->get_meta('seat_data'));

            if (empty($seat_data)) {
                continue;
            }

            $seat_id       = $seat_data['seatId'] ?? '';
            $selected_date = $seat_data['selectedDate'] ?? '';

            if (!$seat_id) {
                continue;
            }

            $items[] = [
                'item_id'       => $item_id,
                'order_id'      => $order->get_id(),
                'product_id'    => $product_id,
                'seat_id'       => $seat_id,
                'seat_data'     => $seat_data,
                'selected_date' => $selected_date,
                'price'         => (float) $item->get_total()
            ];
        }

        return $items;
    }

    /**
     * Get all orders that contain a specific product
     * 
     * @param int $product_id Product ID to filter by
     * @param array<string> $statuses Order statuses to include (default: completed, processing, pending, on-hold)
     * @return list<\WC_Order>
     */
    public static function get_orders_by_product_id(int $product_id, array $statuses = []): array {

        if (empty($statuses)) {
            $statuses = ['wc-completed', 'wc-processing', 'pending', 'on-hold'];
        }

        // Note 
        // 'auditorium_product_id' filter is not yet used since older versions of the plugin does not include this meta key.
        // That's why 'has_auditorium_product' is used instead and the orders are later checked for the $product_id
        // @todo use 'auditorium_product_id' filter in future updates to ease the filtering of the orders

        $orders = wc_get_orders([
            'type'                   => 'shop_order',
            'status'                 => $statuses,
            'limit'                  => -1,
            'has_auditorium_product' => 1
        ]);

        if (empty($orders) || !is_array($orders)) {
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
}
