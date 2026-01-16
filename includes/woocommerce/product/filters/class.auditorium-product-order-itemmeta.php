<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Order_Itemmeta {

    private static $did_init = false;

    public static function init() {

        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_filter('woocommerce_hidden_order_itemmeta', [__CLASS__, 'hide_order_itemmeta'], 10, 1);
        add_filter('woocommerce_get_item_data', [__CLASS__, 'get_item_data'], 10, 3);
        add_action('woocommerce_after_order_itemmeta', [__CLASS__, 'after_order_itemmeta'], 10, 3);
        add_action('woocommerce_order_item_meta_end', [__CLASS__, 'order_item_meta_end'], 10, 3);
    }

    public static function hide_order_itemmeta($exclude_array) {
        return $exclude_array;
    }

    public static function get_item_data($item_data, $cart_item) {

        if (!isset($cart_item['seat_data'])) {
            return $item_data;
        }

        $seat_data = $cart_item['seat_data'];

        $item_data[] = [
            'name'  => esc_html__('Seat ID', 'stachethemes-seat-planner-lite'),
            'value' => sprintf(
                '%s',
                esc_html($seat_data->seatId ?? '')
            ),
        ];

        return $item_data;
    }

    public static function after_order_itemmeta($item_id, $item, $null) {
        $seat_data = $item->get_meta('seat_data');

        if (!$seat_data) {
            return;
        }

        echo '<div><strong>' . esc_html__('Seat ID', 'stachethemes-seat-planner-lite')
            . ':</strong> ' . esc_html($seat_data->seatId) . '</div>';

        $was_scanned = $seat_data->qr_code_scanned ?? false;

        if ($was_scanned) {
            $scan_author = QRCode::get_qr_code_scan_author($seat_data->qr_code_scanned_author ?? 0);
            $scan_date   = QRCode::get_qr_code_scan_date($seat_data->qr_code_scanned_timestamp ?? 0);

            echo '<div class="stachesepl-ticket-scanned-message" style="display: inline-flex; align-items:center; justify-content: space-between; gap: 20px; padding: 10px; background-color: #fff3e0; color: #555; border: 1px solid #ff9800; border-radius: 5px; margin-top: 10px;">';

            if (!$scan_author || !$scan_date) {
                echo '<p style="margin: 0; font-weight: 500;">' . esc_html__('This ticket has already been scanned.', 'stachethemes-seat-planner-lite')
                    . '</p>';
            } else {
                printf(
                    '<p style="margin: 0; font-weight: 500;">%s</p>',
                    sprintf(
                        // translators: %1$s: scan author
                        // translators: %2$s: scan date
                        esc_html__('This ticket has already been scanned by %1$s on %2$s.', 'stachethemes-seat-planner-lite'),
                        esc_html($scan_author),
                        esc_html($scan_date)
                    )
                );
            }

            printf(
                '<button name="stachesepl_unscan_ticket" value="%s" class="stachesepl-unscan-ticket-button" style="background-color: #202020; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">%s</button>',
                esc_attr($item_id),
                esc_html__('Unscan Ticket', 'stachethemes-seat-planner-lite')
            );

            echo '</div>';
        }
    }

    public static function order_item_meta_end($item_id, $item, $order) {
        $seat_data = $item->get_meta('seat_data');

        if (!$seat_data) {
            return;
        }

        echo '<div><strong>' . esc_html__('Seat ID', 'stachethemes-seat-planner-lite')
            . ':</strong> ' . esc_html($seat_data->seatId) . '</div>';

        if ($order->get_status() !== 'completed') {
            return;
        }

        if (!isset($seat_data->qr_code) || !$seat_data->qr_code) {
            return;
        }

        $item_qr_code = $seat_data->qr_code;
        if (!$item_qr_code) {
            return;
        }

        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo apply_filters(
            'stachesepl_order_item_qr_code',
            sprintf('<div class="stachesepl-qrcode"><img src="%s" alt="qrcode" style="width:250px; height: auto;"></div>', esc_url($item_qr_code)),
            $item_qr_code,
            $item,
            $order
        );
    }

}
