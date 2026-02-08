<?php

namespace StachethemesSeatPlannerLite;

class Bookings_Data {

    private Auditorium_Product $product;

    public function __construct(int $product_id) {

        $product = wc_get_product($product_id);

        if (! $product || ! $product->is_type('auditorium')) {
            throw new \Exception(esc_html__('Invalid product ID or product is not an auditorium type.', 'stachethemes-seat-planner-lite'));
        }

        /** @var Auditorium_Product $product */
        $this->product = $product;
    }

    /**
     * @return list<array{item_id: int, order_id: int, product_id: int, seat_id: string, seat_data: array<string, mixed>, price: string, date_time: string, custom_fields: array}>
     */
    private function get_order_items(\WC_Order $order, int $filter_by_product_id): array {
        $base_items = Order_Helper::get_order_items($order, $filter_by_product_id);
        $items      = [];

        // Get order items again to access WC_Order_Item_Product methods
        $order_items = $order->get_items();

        foreach ($base_items as $base_item) {
            $item_id = $base_item['item_id'];
            $item    = $order_items[$item_id] ?? null;

            if (!$item) {
                continue;
            }

            /** @var \WC_Order_Item_Product $item */
            $seat_data     = $base_item['seat_data'];
            $seat_discount = $item->get_meta('seat_discount');

            $items[] = [
                'item_id'       => $item_id,
                'order_id'      => $base_item['order_id'],
                'product_id'    => $base_item['product_id'],
                'seat_id'       => $base_item['seat_id'],
                'seat_data'     => $seat_data,
                'seat_discount' => $seat_discount && is_array($seat_discount) ? $seat_discount : null,
                'price'         => $item->get_total(),
                'date_time'     => $base_item['selected_date'],
                'custom_fields' => [],
            ];
        }

        return $items;
    }

    /**
     * @return list<\WC_Order>
     */
    private function get_orders(): array {
        return Order_Helper::get_orders_by_product_id($this->product->get_id());
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function get_bookings(string $selected_date = ''): array {
        $data   = [];
        return $data;
    }

    /**
     * @return list<int>
     */
    public function get_orders_with_seat(string $seat_id, string $selected_date = ''): array {

        $orders = $this->get_orders();
        $matching_orders = [];

        foreach ($orders as $order) {
            $order_items = $this->get_order_items($order, $this->product->get_id());

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

    /**
     * @return array<string, mixed>|null
     */
    public function get_order_details_by_seat_id(string $seat_id, string $selected_date = ''): ?array {
        $orders = $this->get_orders_with_seat($seat_id, $selected_date);
        
        if (empty($orders)) {
            return null;
        }

        $order_id = $orders[0];
        $order = wc_get_order($order_id);

        if (!$order || !($order instanceof \WC_Order)) {
            return null;
        }

        $order_items    = $this->get_order_items($order, $this->product->get_id());
        $seat_price     = 0;
        $date_time      = '';
        $item_id        = 0;
        $seat_data      = [];

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
            'seat_discount'  => null,
            'has_dates'      => $this->product->has_dates(),
        ];
    }

}
