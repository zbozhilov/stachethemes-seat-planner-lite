<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class QRCode {

    // Retrieve qr code image url from text
    public static function get_qr_code(string $text) {

        try {

            if (!$text) {
                return false;
            }

            $qr_directory   = 'stachesepl_qrcode';
            $upload_dir_nfo = wp_get_upload_dir();
            $uploads_dir    = trailingslashit($upload_dir_nfo['basedir']) . $qr_directory;
            $filename       = md5($text) . '.png';

            if (file_exists($uploads_dir . DIRECTORY_SEPARATOR . $filename)) {
                return sprintf('%s/%s/%s', $upload_dir_nfo['baseurl'], $qr_directory, $filename);
            }

            // create directory $uploads_dir if not exists
            if (!file_exists($uploads_dir)) {
                if (!wp_mkdir_p($uploads_dir)) {
                    return false;
                }
            }

            // check if \chillerlan\QRCode\QRCode exists before requiring
            if (!class_exists('\chillerlan\QRCode\QRCode')) {
                require_once(STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'libs/php-qrcode/vendor/autoload.php');
            }

            $options = new \chillerlan\QRCode\QROptions(
                apply_filters('stachesepl_qrcode_qroptions', [
                    'version'      => 5,
                    'outputType'   => \chillerlan\QRCode\Output\QROutputInterface::GDIMAGE_PNG,
                    'eccLevel'     => \chillerlan\QRCode\Common\EccLevel::L,
                    'scale'        => 6,
                    'addQuietzone' => true,
                ])
            );

            $qr = new \chillerlan\QRCode\QRCode($options);

            $qr->render($text, $uploads_dir . DIRECTORY_SEPARATOR . $filename);

            if (file_exists($uploads_dir . '/' . $filename)) {
                return sprintf('%s/%s/%s', $upload_dir_nfo['baseurl'], $qr_directory, $filename);
            }

            return false;
        } catch (\Throwable) {
            return false;
        }
    }

    // Retrieve qr code data from text
    public static function get_decode_qr_code_text(string $text, bool $mark_as_scanned = true, string $scan_author_name = '') {

        // Default data on failure
        $fail_data = [
            'scanned'              => false,
            'scan_date'            => '',
            'scan_author'          => '',
            'order_id'             => 0,
            'order_key'            => '',
            'order_display_status' => '',
            'order_status'         => '',
            'product_id'           => '',
            'product_title'        => '',
            'price'                => '',
            'seat_id'              => '',
            'order_link'           => '',
            'customer_name'        => ''
        ];

        // Expected format
        // [order-key]-[product-id]-[item-id]-[secret]

        $text_array = explode('-', $text);

        if (count($text_array) < 4) {
            return $fail_data;
        }

        list($order_key, $product_id, $item_id, $secret) = $text_array;

        // Validate input values
        if (!$order_key || !$product_id || !$item_id || !$secret) {
            return $fail_data;
        }

        // 1. Check order status
        $order_id = wc_get_order_id_by_order_key($order_key);
        if (!$order_id) {
            return $fail_data;
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            return $fail_data;
        }

        // Get product type and validate
        $product = wc_get_product($product_id);
        if (!$product || $product->get_type() !== 'auditorium' || !($product instanceof Auditorium_Product)) {
            return $fail_data;
        }

        // Get order item
        $item = $order->get_item($item_id);
        if (!$item) {
            return $fail_data;
        }

        // Get seat data
        $seat_data = (array) $item->get_meta('seat_data');
        $selected_date = isset($seat_data['selectedDate']) ? $seat_data['selectedDate'] : '';
        if (!$seat_data || !$product->is_seat_taken($seat_data['seatId'], $selected_date)) {
            return $fail_data;
        }

        // 2. Check secret match
        if ($seat_data['qr_code_secret'] !== $secret) {
            return $fail_data;
        }

        // 3. Mark as scanned
        if ($mark_as_scanned) {
            $was_scanned = isset($seat_data['qr_code_scanned']) ? (bool) $seat_data['qr_code_scanned'] : false;

            if (!$was_scanned && $mark_as_scanned) {
                $seat_data['qr_code_scanned'] = true;
                $seat_data['qr_code_scanned_timestamp'] = time();
                $seat_data['qr_code_scanned_author'] = $scan_author_name ?: get_current_user_id();
                $item->update_meta_data('seat_data', (object) $seat_data);
                $item->save_meta_data();
            }

            // Add "note" to the order that the QR code was scanned
            $order->add_order_note(sprintf(
                // Translators: %1$s - seat ID, %2$s - user name
                esc_html__('QR code for seat %1$s was scanned by %2$s.', 'stachethemes-seat-planner-lite'),
                esc_html($seat_data['seatId']),
                esc_html(self::get_qr_code_scan_author($seat_data['qr_code_scanned_author'] ?? 0))
            ));

            $order->save();
        }

        // Return the result
        return [
            'scanned'              => (bool) $was_scanned,
            'scan_date'            => self::get_qr_code_scan_date($seat_data['qr_code_scanned_timestamp'] ?? 0),
            'scan_author'          => self::get_qr_code_scan_author($seat_data['qr_code_scanned_author'] ?? 0),
            'order_id'             => (int) $order_id,
            'order_key'            => esc_html($order_key),
            'order_display_status' => esc_html(wc_get_order_status_name($order->get_status())),
            'order_status'         => esc_html($order->get_status()),
            'product_id'           => (int) $product_id,
            'product_title'        => esc_html($product->get_title()),
            'price'                => esc_html(wc_price($seat_data['price'])),
            'seat_id'              => esc_html($seat_data['seatId']),
            'date_time'            => isset($seat_data['selectedDate']) && $seat_data['selectedDate']  ? Utils::get_formatted_date_time($seat_data['selectedDate']) : '',
            'date_time_timestamp'  => isset($seat_data['selectedDate']) && $seat_data['selectedDate']  ? strtotime($seat_data['selectedDate']) : 0,
            'order_link'           => $order->get_edit_order_url(),
            'customer_name'        => esc_html($order->get_billing_first_name() . ' ' . $order->get_billing_last_name())
        ];
    }

    public static function get_qr_code_scan_author(int|string $user_id): string {
        if (!$user_id) {
            return '';
        }

        if (is_string($user_id)) {
            return $user_id;
        }

        $user = get_user_by('id', $user_id);
        if (!$user) {
            return '';
        }

        return sprintf('%s %s', esc_html($user->first_name), esc_html($user->last_name));
    }

    public static function get_qr_code_scan_date(int $timestamp): string {
        if (!$timestamp) {
            return '';
        }
    
        $date_string = get_date_from_gmt(gmdate('Y-m-d H:i:s', $timestamp));
        return date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($date_string));
    }
    
}
