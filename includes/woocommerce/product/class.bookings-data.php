<?php

namespace StachethemesSeatPlannerLite;

class Bookings_Data {

    private $product;

    public function __construct($product_id) {

        $product = wc_get_product($product_id);

        if (! $product || ! $product->is_type('auditorium')) {
            throw new \Exception(esc_html__('Invalid product ID or product is not an auditorium type.', 'stachethemes-seat-planner'));
        }

        $this->product = $product;
    }

    private function get_order_items($order, $filter_by_product_id) {
        $items = [];
        $order_items = $order->get_items();

        foreach ($order_items as $item_id => $item) {

            $product_id = $item->get_product_id();

            if ($product_id !== $filter_by_product_id) {
                continue; // Skip items that do not match the product ID
            }

            $seat_data_meta = $item->get_meta('seat_data');
            $seat_data      = is_array($seat_data_meta) ? $seat_data_meta : (is_object($seat_data_meta) ? (array) $seat_data_meta : []);

            if (empty($seat_data)) {
                continue;
            }

            $seat_id       = isset($seat_data['seatId']) ? $seat_data['seatId'] : '';
            $selected_date = '';
            $custom_fields = isset($seat_data['customFields']) ? $seat_data['customFields'] : [];

            if (is_object($custom_fields)) {
                $custom_fields = (array) $custom_fields;
            }
            if (!is_array($custom_fields)) {
                $custom_fields = [];
            }

            if (!$seat_id) {
                continue;
            }

            $items[] = [
                'item_id'       => $item_id,
                'order_id'      => $order->get_id(),
                'product_id'    => $product_id,
                'seat_id'       => $seat_id,
                'seat_data'     => $seat_data,
                'price'         => $item->get_total(),
                'date_time'     => $selected_date,
                'custom_fields' => $custom_fields,
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

    public function get_order_details_by_seat_id($seat_id, $selected_date = '') {
        $orders = $this->get_orders_with_seat($seat_id, $selected_date);
        
        if (empty($orders)) {
            return null;
        }

        $order_id = $orders[0];
        $order = wc_get_order($order_id);

        if (!$order) {
            return null;
        }

        $order_items = self::get_order_items($order, $this->product->get_id());
        $seat_price = 0;
        $date_time = '';
        $item_id = 0;
        $seat_data = [];

        foreach ($order_items as $item) {
            if ($item['seat_id'] === $seat_id) {
                $seat_price = $item['price'];
                $date_time = $item['date_time'];
                $item_id = $item['item_id'];
                $seat_data = $item['seat_data'];
                break;
            }
        }

        return [
            'order_id'       => $order->get_id(),
            'item_id'        => $item_id,
            'order_edit_url' => admin_url('post.php?post=' . $order->get_id() . '&action=edit'),
            'order_date'     => $order->get_date_created() ? $order->get_date_created()->date_i18n('Y-m-d H:i:s') : '',
            'order_status'   => $order->get_status() ? wc_get_order_status_name($order->get_status()) : '',
            'customer_name'  => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
            'customer_email' => $order->get_billing_email(),
            'product_name'   => $this->product->get_name(),
            'seat_id'        => $seat_id,
            'seat_price'     => $seat_price,
            'date_time'      => $date_time,
            'seat_data'      => $seat_data,
            'has_dates'      => $this->product->has_dates(),
        ];
    }

}
