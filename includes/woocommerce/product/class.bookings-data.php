<?php

namespace Stachethemes\SeatPlannerLite;

class Bookings_Data {

    private $product;

    public function __construct($product_id) {

        $product = wc_get_product($product_id);

        if (! $product || ! $product->is_type('auditorium')) {
            throw new \Exception(esc_html__('Invalid product ID or product is not an auditorium type.', 'stachethemes-seat-planner-lite'));
        }

        $this->product = $product;
    }

    private function get_order_items($order, $filter_by_product_id) {
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
                'order_id'   => $order->get_id(),
                'product_id' => $product_id,
                'seat_id'    => $seat_id,
                'price'      => $item->get_total(),
                'date_time'  => $selected_date,
            ];
        }

        return $items;
    }

    private function get_orders() {

        // Note 
        // 'auditorium_product_id' filter is not yet used since older versions of the plugin does not include this meta key.
        // That's why 'has_auditorium_product' is used instead and the orders are later checked for the $product_id
        // @todo use 'auditorium_product_id' filter in future updates to ease the filtering of the orders

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

            $order_items = self::get_order_items($order, $this->product->get_id());

            foreach ($order_items as $item) {

                if ($item['product_id'] ===  $this->product->get_id()) {
                    $orders_with_this_product_id[] = $order;
                    break; // No need to check other items in this order
                }
            }
        }

        return $orders_with_this_product_id;
    }

    public function get_orders_with_seat($seat_id, $selected_date = '') {

        $orders = $this->get_orders();
        $matching_orders = [];

        foreach ($orders as $order) {
            $order_items = self::get_order_items($order, $this->product->get_id());

            foreach ($order_items as $item) {

                if ($item['seat_id'] === $seat_id) {

                    if ($selected_date && $item['date_time'] !== $selected_date) {
                        continue 2;
                    }

                    $matching_orders[] = $order;
                    break; // No need to check other items in this order
                }
            }
        }

        return array_map(function ($order) {
            return $order->get_id();
        }, $matching_orders);
    }
}
