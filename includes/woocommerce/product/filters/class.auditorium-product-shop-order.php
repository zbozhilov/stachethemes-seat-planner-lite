<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Shop_Order_Admin {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_action('woocommerce_process_shop_order_meta', [__CLASS__, 'shop_order_update'], 10, 2);
    }

    public static function shop_order_update($post_id, $post) {
        $nonce_value = isset($_POST['woocommerce_meta_nonce']) ? sanitize_text_field(wp_unslash($_POST['woocommerce_meta_nonce'])) : '';
        if (!wp_verify_nonce($nonce_value, 'woocommerce_save_data')) {
            return;
        }

        if (!isset($_POST['stachesepl_unscan_ticket'])) {
            return;
        }

        $item_id = (int) filter_input(INPUT_POST, 'stachesepl_unscan_ticket', FILTER_SANITIZE_NUMBER_INT);
       
        if (!$item_id ) {
            return;
        }

        $order = wc_get_order($post_id);
        if (!$order || !($order instanceof \WC_Order)) {
            return;
        }

        $item = $order->get_item($item_id);
        if (!$item) {
            return;
        }

        $seat_data = Utils::normalize_seat_data_meta($item->get_meta('seat_data'));
        if (!$seat_data) {
            return;
        }

        unset($seat_data['qr_code_scanned']);

        $item->update_meta_data('seat_data', $seat_data);
        $item->save_meta_data();
    }
}


