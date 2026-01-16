<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Checkout {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_action('woocommerce_checkout_order_created', [__CLASS__, 'checkout_order_processed'], 10, 1);
        add_action('woocommerce_store_api_checkout_order_processed', [__CLASS__, 'checkout_order_processed'], 10, 1);
        add_action('woocommerce_checkout_create_order_line_item', [__CLASS__, 'checkout_create_order_line_item'], 10, 4);
    }

    public static function checkout_order_processed($order) {
        if (!$order->get_meta('has_auditorium_product')) {
            return;
        }

        $items = $order->get_items();

        foreach ($items as $item) {
            $seat_data = (array) $item->get_meta('seat_data');
            if (!$seat_data) {
                continue;
            }

            $product_id = $item->get_product_id();
            $seat_id    = $seat_data['seatId'];

            if (!$seat_id) {
                continue;
            }

            $secret_key     = wp_generate_password(6, false);
            $qr_code_string = $order->get_order_key() . '-' . $product_id . '-' . $item->get_id() . '-' . $secret_key;
            $qr_code_url    = QRCode::get_qr_code($qr_code_string);

            if ($qr_code_url) {
                $seat_data['qr_code']        = $qr_code_url;
                $seat_data['qr_code_secret'] = $secret_key;
                $item->update_meta_data('seat_data', (object) $seat_data);
                $item->save_meta_data();
            }

            $order->add_meta_data('auditorium_product_id', $product_id);
        }

        $order->save_meta_data();
    }

    public static function checkout_create_order_line_item($item, $cart_item_key, $values, $order) {
        if (!isset($values['seat_data'])) {
            return;
        }

        $seat_data     = $values['seat_data'];
        $seat_discount = isset($values['seat_discount']) && is_array($values['seat_discount']) ? $values['seat_discount'] : '';
        $selected_date = isset($values['selected_date']) ? $values['selected_date'] : '';

        if ($selected_date) {
            $seat_data->selectedDate = $selected_date;
        }

        $item->update_meta_data('seat_data', $seat_data);
        $item->update_meta_data('seat_discount', $seat_discount);
        $order->update_meta_data('has_auditorium_product', true);
    }
}


