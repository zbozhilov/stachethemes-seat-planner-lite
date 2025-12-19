<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Overview Stats class
 * Provides statistics data for the dashboard overview page
 */
class Overview_Stats {

    /**
     * Get all overview statistics
     *
     * @return array
     */
    public static function get_stats(): array {

        $revenue_and_seats_sold = self::get_revenue_and_seats_sold();

        return [
            'total_products'        => self::get_total_auditorium_products(),
            'total_seats'           => $revenue_and_seats_sold['seats'],
            'total_revenue'         => $revenue_and_seats_sold['revenue']
        ];
    }

    /**
     * Get total number of auditorium products
     *
     * @return int
     */
    private static function get_total_auditorium_products(): int {
        $args = [
            'type'   => 'auditorium',
            'status' => 'publish',
            'limit'  => -1,
            'return' => 'ids',
        ];

        $products = wc_get_products($args);

        return is_array($products) ? count($products) : 0;
    }


    /**
     * Get total revenue and seats sold from auditorium product orders
     *
     * @return array [ 'seats' => int, 'revenue' => string ]
     */
    private static function get_revenue_and_seats_sold(): array {
        $orders = wc_get_orders([
            'type'                   => 'shop_order',
            'status'                 => ['wc-completed', 'wc-processing'],
            'limit'                  => -1,
            'has_auditorium_product' => 1,
        ]);

        $total_revenue = 0;
        $total_seats = 0;

        if (is_array($orders)) {
            /** @var WC_Order $order */
            foreach ($orders as $order) {
                // Only count auditorium product line items
                foreach ($order->get_items() as $item) {
                    $product = $item->get_product();
                    if ($product && $product->is_type('auditorium')) {
                        $total_revenue += (float) $item->get_total();
                        $total_seats++;
                    }
                }
            }
        }

        return [
            'seats'   => $total_seats,
            'revenue' => html_entity_decode(wc_price($total_revenue))
        ];
    }

}