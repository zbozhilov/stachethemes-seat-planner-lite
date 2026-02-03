<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * @todo Refactor this class because it gets too big
 */
class Ajax {

    public static function init(): void {
        add_action('wp_ajax_seatplanner', [__CLASS__, 'handle_ajax_requests']);
        add_action('wp_ajax_nopriv_seatplanner', [__CLASS__, 'handle_ajax_requests']);
    }

    public static function handle_ajax_requests(): void {

        check_ajax_referer('stachethemes_seat_planner', 'nonce', true);

        $task = isset($_POST['task']) ? sanitize_key(wp_unslash($_POST['task'])) : '';

        $allowed_tasks = [
            'get_seat_plan_data',
            'add_seats_to_cart',
            'get_qr_string_details',
            'check_double_booking',
            'get_product_ids',
            'check_product_booking',
            'check_product_ghost_booking',
            'fix_ghost_booking',
            'get_bookings_data',
            'get_order_details_by_seat_id',
            'get_overview_stats',
            'save_dashboard_settings',
            'get_available_dates',
            'get_product_dates',
            'get_order_auditorium_items',
            'update_order_item_meta',
            'get_auditorium_products',
            'get_auditorium_product',
            'update_manager_seat_override',
            'bulk_update_manager_seat_overrides',
            'create_order_for_seat',
        ];

        if (empty($task) || !in_array($task, $allowed_tasks, true)) {
            wp_send_json_error(['error' => esc_html__('Invalid task', 'stachethemes-seat-planner-lite')]);
        }

        try {

            switch ($task) {

                case 'get_seat_plan_data': {

                        try {

                            $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                            $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';
                            
                            if ($product_id === false || $product_id < 1) {
                                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
                            }

                            $result = Seat_Plan_Data::get_seat_plan_data($product_id, $selected_date);

                            if (!$result['success']) {
                                wp_send_json_error(['error' => $result['error']]);
                            }

                            wp_send_json_success($result['data']);
                        } catch (\Throwable $th) {

                            wp_send_json_error(['error' => $th->getMessage()]);
                        }

                        break;
                    }

                /**
                 * AJAX task: add_seats_to_cart
                 *
                 * Adds one or more seats for an Auditorium product to the WooCommerce cart.
                 *
                 * Expected POST params:
                 * - product_id (int): The Auditorium product ID.
                 * - selected_date (string): The selected date in format YYYY-MM-DDTHH:MM or empty string if not provided.
                 * - selected_seats (string, JSON): JSON-encoded array of objects:
                 *     [{ "seatId": string, "discountId": string, "customFields": array }]
                 * - nonce (string): WordPress AJAX nonce for 'stachethemes_seat_planner'.
                 *
                 * What it does:
                 * - Validates nonce, product, and request payload format.
                 * - Normalizes selection by keeping only the first occurrence per seatId (unique seats).
                 * - Calculates total seats as (already in cart + new unique selections) and enforces
                 *   product limits for min/max seats per purchase.
                 * - For each unique seat, calls Auditorium_Product::add_to_cart to add and reserve it.
                 * - Returns success along with WooCommerce cart fragments so the mini cart can refresh.
                 *
                 * Error responses:
                 * - wp_send_json_error(['error' => string]) with a human-readable message for:
                 *   invalid product, bad JSON, empty selection, invalid seat IDs,
                 *   min/max limits violations, or add-to-cart failures.
                 */
                case 'add_seats_to_cart': {

                        $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';

                        if ($product_id === false || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $seats_string = isset($_POST['selected_seats']) ? sanitize_text_field(wp_unslash($_POST['selected_seats'])) : '';
                        $seats_object = json_decode($seats_string);

                        if (json_last_error() !== JSON_ERROR_NONE || !is_array($seats_object)) {
                            wp_send_json_error(['error' => esc_html__('Invalid seat data format', 'stachethemes-seat-planner-lite')]);
                        }

                        if (empty($seats_object)) {
                            wp_send_json_error(['error' => esc_html__('No seats selected', 'stachethemes-seat-planner-lite')]);
                        }

                        /** @var Auditorium_Product $auditorium_product */
                        $auditorium_product = wc_get_product($product_id);

                        if (!$auditorium_product || $auditorium_product->get_type() !== 'auditorium') {
                            wp_send_json_error(['error' => esc_html__('Product not found', 'stachethemes-seat-planner-lite')]);
                        }

                        if ($selected_date) {

                            $dates = $auditorium_product->get_dates_data();

                            if (!in_array($selected_date, $dates)) {
                                wp_send_json_error(['error' => esc_html__('The selected date is not available', 'stachethemes-seat-planner-lite')]);
                            }

                            if ($auditorium_product->is_cut_off_time_passed($selected_date)) {
                                wp_send_json_error(['error' => esc_html__('The selected date is no longer available', 'stachethemes-seat-planner-lite')]);
                            }
                        }

                        $min_seats_per_purchase = (int) $auditorium_product->get_meta('_stachesepl_min_seats_per_purchase', true);
                        $max_seats_per_purchase = (int) $auditorium_product->get_meta('_stachesepl_max_seats_per_purchase', true);

                        // Ensure we work with unique selected seats and handle duplicates correctly (preserve string seat IDs)
                        $unique_selected_seats = []; // list of ['seatId' => string, 'discountId' => string]
                        $seen_seat_ids = []; // list of strings for strict duplicate checks
                        foreach ($seats_object as $seat_data) {
                            if (!isset($seat_data->seatId) || !is_string($seat_data->seatId) || '' === $seat_data->seatId) {
                                wp_send_json_error(['error' => esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite')]);
                            }
                            $seat_id       = sanitize_text_field($seat_data->seatId);
                            $seat_discount = isset($seat_data->discountId) ? sanitize_text_field($seat_data->discountId) : '';
                            $custom_fields  = isset($seat_data->customFields) ? $seat_data->customFields : new \stdClass();

                            if (!in_array($seat_id, $seen_seat_ids, true)) {
                                $unique_selected_seats[] = [
                                    'seatId'       => $seat_id,
                                    'discountId'   => $seat_discount,
                                    'customFields' => $custom_fields,
                                ];
                                $seen_seat_ids[] = $seat_id;
                            }
                        }

                        $get_seats_in_cart_args = [];
                        if ($selected_date) {
                            $get_seats_in_cart_args['selected_date'] = $selected_date;
                        }
                        $seats_in_cart       = $auditorium_product->get_seats_in_cart($get_seats_in_cart_args);
                        $seats_in_cart_count = max(0, count($seats_in_cart));

                        // Compute total seats post-add (cart + new unique selections not already in cart)
                        $seats_in_cart_lookup = [];

                        foreach ($seats_in_cart as $sid) {
                            $seats_in_cart_lookup[(string) $sid] = true;
                        }

                        $new_unique_seats = 0;
                        foreach ($unique_selected_seats as $item) {
                            $actual_seat_id = $item['seatId'];
                            if (!isset($seats_in_cart_lookup[$actual_seat_id])) {
                                $new_unique_seats++;
                            }
                        }
                        $total_seats_count = $seats_in_cart_count + $new_unique_seats;

                        // Enforce purchase limits
                        if ($min_seats_per_purchase > 0 && $total_seats_count < $min_seats_per_purchase) {
                            $error_message = sprintf(
                                // translators: %d is the minimum number of seats per purchase
                                _n(
                                    'You need to purchase at least %d seat per order.',
                                    'You need to purchase at least %d seats per order.',
                                    $min_seats_per_purchase,
                                    'stachethemes-seat-planner-lite'
                                ),
                                $min_seats_per_purchase
                            );

                            wp_send_json_error(['error' => $error_message]);
                        }

                        if ($max_seats_per_purchase > 0 && $total_seats_count > $max_seats_per_purchase) {
                            $error_message = sprintf(
                                // translators: %d is the maximum number of seats per purchase
                                _n(
                                    'You can only purchase up to %d seat per order.',
                                    'You can only purchase up to %d seats per order.',
                                    $max_seats_per_purchase,
                                    'stachethemes-seat-planner-lite'
                                ),
                                $max_seats_per_purchase
                            );

                            if ($seats_in_cart_count > 0) {
                                $error_message .= ' ' . sprintf(
                                    // translators: %d is the number of seats in the cart
                                    _n(
                                        'You already have %d seat in your cart.',
                                        'You already have %d seats in your cart.',
                                        $seats_in_cart_count,
                                        'stachethemes-seat-planner-lite'
                                    ),
                                    $seats_in_cart_count
                                );
                            }

                            wp_send_json_error(['error' => $error_message]);
                        }

                        // Add only unique seats (first occurrence discount preference)
                        foreach ($unique_selected_seats as $item) {

                            $seat_id       = $item['seatId'];
                            $seat_discount = $item['discountId'];
                            $custom_fields = $item['customFields'];

                            if ('' === $seat_id) {
                                wp_send_json_error(['error' => esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite')]);
                            }

                            if (!$auditorium_product->add_to_cart($seat_id, $seat_discount, $selected_date, $custom_fields)) {
                                wp_send_json_error(['error' => esc_html__('Failed to add seat to cart', 'stachethemes-seat-planner-lite')]);
                            }
                        }

                        ob_start();
                        woocommerce_mini_cart();
                        $mini_cart = ob_get_clean();

                        if (empty($mini_cart)) {
                            wp_send_json_error(['error' => esc_html__('Failed to generate mini cart', 'stachethemes-seat-planner-lite')]);
                        }

                        $cart_fragments = apply_filters(
                            'woocommerce_add_to_cart_fragments',
                            array(
                                'div.widget_shopping_cart_content' => '<div class="widget_shopping_cart_content">' . wp_kses_post($mini_cart) . '</div>',
                            )
                        );

                        wp_send_json_success(
                            [
                                'message'        => esc_html__('Seats added to cart', 'stachethemes-seat-planner-lite'),
                                'cart_fragments' => $cart_fragments
                            ]
                        );
                    }


                case 'get_qr_string_details': {

                        if (!current_user_can(
                            apply_filters('stachesepl_can_read_qr_string_details', 'manage_woocommerce')
                        )) {
                            wp_send_json_error([
                                'error' =>
                                esc_html__('You do not have the required permissions to access QR code details. Please contact the site administrator if you believe this is an error.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $qr_string = isset($_POST['qr_string']) ? sanitize_text_field(wp_unslash($_POST['qr_string'])) : '';

                        if (!$qr_string) {
                            wp_send_json_error(['error' => esc_html__('QR string not specified', 'stachethemes-seat-planner-lite')]);
                        }

                        $qr_string_details = QRCode::get_decode_qr_code_text($qr_string, apply_filters('stachesepl_mark_qr_as_scanned', true));

                        // $qr_string_details returns success and data as an array
                        // If the data is empty, the QR code is invalid
                        // wp_send_json_success is used because we want to show the invalid ticket container, not an error in <Home />
                        wp_send_json_success($qr_string_details);

                        break;
                    }

                case 'check_double_booking': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $results = Check_Double_Booking::get_double_bookings_for_products();

                        wp_send_json_success($results);

                        break;
                    }

                case 'get_product_ids': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_ids = Check_Double_Booking::get_auditorium_product_ids();

                        wp_send_json_success([
                            'product_ids' => $product_ids
                        ]);

                        break;
                    }

                case 'check_product_booking': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $result = Check_Double_Booking::check_product_for_double_booking($product_id);

                        wp_send_json_success($result);

                        break;
                    }

                case 'check_product_ghost_booking': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $result = Check_Ghost_Booking::check_product_for_ghost_booking($product_id);

                        wp_send_json_success($result);

                        break;
                    }

                case 'fix_ghost_booking': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $seat_id       = isset($_POST['seat_id']) ? sanitize_text_field(wp_unslash($_POST['seat_id'])) : '';
                        $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        if (empty($seat_id)) {
                            wp_send_json_error(['error' => esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $result = Check_Ghost_Booking::fix_ghost_booking($product_id, $seat_id, $selected_date);

                        if ($result) {
                            wp_send_json_success([
                                'message' => esc_html__('Seat has been marked as taken.', 'stachethemes-seat-planner-lite')
                            ]);
                        } else {
                            wp_send_json_error(['error' => esc_html__('Failed to fix ghost booking.', 'stachethemes-seat-planner-lite')]);
                        }

                        break;
                    }

                case 'get_bookings_data': {

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $bookings_data = new Bookings_Data($product_id);

                        wp_send_json_success($bookings_data->get_bookings($selected_date));

                        break;
                    }

                case 'get_order_details_by_seat_id': {

                        if (! current_user_can('manage_woocommerce')) {
                            wp_send_json_error(['error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')]);
                            return;
                        }

                        $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $seat_id       = isset($_POST['seat_id']) ? sanitize_text_field(wp_unslash($_POST['seat_id'])) : '';
                        $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $booking_data = new Bookings_Data($product_id);
                        $data         = $booking_data->get_order_details_by_seat_id($seat_id, $selected_date);

                        wp_send_json_success($data);

                        break;
                    }

                case 'get_overview_stats': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $stats = Overview_Stats::get_stats();

                        wp_send_json_success($stats);

                        break;
                    }

                case 'save_dashboard_settings': {

                        if (!current_user_can('manage_options')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to save settings.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                        $settings_json = isset($_POST['settings']) ? wp_unslash($_POST['settings']) : '';
                        $settings      = json_decode($settings_json, true);

                        if (json_last_error() !== JSON_ERROR_NONE || !is_array($settings)) {
                            wp_send_json_error([
                                'error' => esc_html__('Invalid settings data format.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $result = Settings::save_settings($settings);

                        if ($result) {
                            wp_send_json_success([
                                'message'  => esc_html__('Settings saved successfully.', 'stachethemes-seat-planner-lite'),
                                'settings' => Settings::get_settings()
                            ]);
                        } else {
                            wp_send_json_error([
                                'error' => esc_html__('Failed to save settings.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        break;
                    }

                case 'get_available_dates': {

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        $product = wc_get_product($product_id);

                        if (!$product || $product->get_type() !== 'auditorium') {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        /** @var Auditorium_Product $product */
                        $dates = $product->get_available_dates();

                        wp_send_json_success($dates);

                        break;
                    }

                case 'get_product_dates': {
                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        $product = wc_get_product($product_id);

                        if (!$product || $product->get_type() !== 'auditorium') {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        /** @var Auditorium_Product $product */
                        $dates = $product->get_dates_data();

                        wp_send_json_success($dates);

                        break;
                    }

                case 'get_order_auditorium_items': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $order_id = filter_input(INPUT_POST, 'order_id', FILTER_VALIDATE_INT);

                        if (false === $order_id || $order_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid order ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $result = Manager_Service::get_order_auditorium_items($order_id);

                        if (!$result['success']) {
                            wp_send_json_error(['error' => $result['error']]);
                        }

                        wp_send_json_success($result['data']);

                        break;
                    }

                case 'update_order_item_meta': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $order_id = filter_input(INPUT_POST, 'order_id', FILTER_VALIDATE_INT);

                        if (false === $order_id || $order_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid order ID', 'stachethemes-seat-planner-lite')]);
                        }

                        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                        $updates_json = isset($_POST['updates']) ? wp_unslash($_POST['updates']) : '';
                        $updates      = json_decode($updates_json, true);

                        if (json_last_error() !== JSON_ERROR_NONE || !is_array($updates)) {
                            wp_send_json_error(['error' => esc_html__('Invalid updates data format', 'stachethemes-seat-planner-lite')]);
                        }

                        $result = Manager_Service::update_order_item_meta($order_id, $updates);

                        if (!$result['success']) {
                            wp_send_json_error(['error' => $result['error']]);
                        }

                        wp_send_json_success($result['data']);

                        break;
                    }

                case 'get_auditorium_product': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $include_dates = isset($_POST['include_dates']) ? sanitize_text_field(wp_unslash($_POST['include_dates'])) : 'no';

                        $result = Manager_Service::get_auditorium_product(
                            (int) $product_id,
                            $include_dates === 'yes'
                        );

                        if (!$result['success']) {
                            wp_send_json_error(['error' => $result['error']]);
                        }

                        wp_send_json_success($result['data']);

                        break;
                    }

                case 'get_auditorium_products': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $search   = isset($_POST['search']) ? sanitize_text_field(wp_unslash($_POST['search'])) : '';
                        $page     = isset($_POST['page']) ? absint($_POST['page']) : 1;
                        $per_page = isset($_POST['per_page']) ? absint($_POST['per_page']) : 10;

                        $result = Manager_Service::get_auditorium_products($search, (int) $page, (int) $per_page);

                        if (!$result['success']) {
                            wp_send_json_error(['error' => $result['error']]);
                        }

                        wp_send_json_success($result['data']);

                        break;
                    }

                case 'update_manager_seat_override': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $seat_id       = isset($_POST['seat_id']) ? sanitize_text_field(wp_unslash($_POST['seat_id'])) : '';
                        $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';
                        $status        = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

                        $result = Manager_Service::update_manager_seat_override(
                            (int) $product_id,
                            $seat_id,
                            $selected_date,
                            $status
                        );

                        if (!$result['success']) {
                            wp_send_json_error(['error' => $result['error']]);
                        }

                        wp_send_json_success($result['data']);

                        break;
                    }

                case 'bulk_update_manager_seat_overrides': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to access this feature.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';
                        $status        = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

                        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                        $seat_ids_json = isset($_POST['seat_ids']) ? wp_unslash($_POST['seat_ids']) : '';
                        $seat_ids      = json_decode($seat_ids_json, true);

                        if (json_last_error() !== JSON_ERROR_NONE || !is_array($seat_ids)) {
                            wp_send_json_error(['error' => esc_html__('Invalid seat IDs format', 'stachethemes-seat-planner-lite')]);
                        }

                        $result = Manager_Service::bulk_update_manager_seat_overrides(
                            (int) $product_id,
                            $seat_ids,
                            $selected_date,
                            $status
                        );

                        if (!$result['success']) {
                            wp_send_json_error(['error' => $result['error']]);
                        }

                        wp_send_json_success($result['data']);

                        break;
                    }

                case 'create_order_for_seat': {

                        if (!current_user_can('manage_woocommerce')) {
                            wp_send_json_error([
                                'error' => esc_html__('You do not have the required permissions to create orders.', 'stachethemes-seat-planner-lite')
                            ]);
                        }

                        $product_id     = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $seat_id        = isset($_POST['seat_id']) ? sanitize_text_field(wp_unslash($_POST['seat_id'])) : '';
                        $selected_date  = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';
                        $customer_name  = isset($_POST['customer_name']) ? sanitize_text_field(wp_unslash($_POST['customer_name'])) : '';
                        $customer_email = isset($_POST['customer_email']) ? sanitize_email(wp_unslash($_POST['customer_email'])) : '';
                        $customer_phone = isset($_POST['customer_phone']) ? sanitize_text_field(wp_unslash($_POST['customer_phone'])) : '';
                        $order_status   = isset($_POST['order_status']) ? sanitize_text_field(wp_unslash($_POST['order_status'])) : 'processing';
                        $send_emails    = isset($_POST['send_emails']) && $_POST['send_emails'] === 'yes';

                        $seat_discount = null;
                        if (!empty($_POST['seat_discount'])) {
                            $seat_discount_raw = sanitize_text_field(wp_unslash($_POST['seat_discount']));
                            $decoded           = json_decode($seat_discount_raw, true);
                            if (is_array($decoded) && isset($decoded['type'], $decoded['value']) && (float) $decoded['value'] > 0) {
                                $seat_discount = [
                                    'type'  => in_array($decoded['type'], ['fixed', 'percentage'], true) ? $decoded['type'] : 'fixed',
                                    'value' => (float) $decoded['value'],
                                    'name'  => isset($decoded['name']) ? sanitize_text_field($decoded['name']) : '',
                                ];
                            }
                        }

                        $seat_custom_fields = null;
                        if (!empty($_POST['seat_custom_fields'])) {
                            $seat_custom_fields_raw = sanitize_text_field(wp_unslash($_POST['seat_custom_fields']));
                            $decoded_cf            = json_decode($seat_custom_fields_raw, true);
                            if (is_array($decoded_cf)) {
                                $seat_custom_fields = $decoded_cf;
                            }
                        }

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $result = Manager_Service::create_order_for_seat(
                            (int) $product_id,
                            $seat_id,
                            $selected_date,
                            $customer_name,
                            $customer_email,
                            $customer_phone,
                            $order_status,
                            $send_emails,
                            $seat_discount,
                            $seat_custom_fields
                        );

                        if (!$result['success']) {
                            wp_send_json_error(['error' => $result['error']]);
                        }

                        wp_send_json_success($result['data']);

                        break;
                    }

                default: {
                        throw new \Exception(esc_html__('No action specified', 'stachethemes-seat-planner-lite'));
                    }
            }
        } catch (\Exception $e) {
            wp_send_json_error(['error' => $e->getMessage()]);
        }

        exit;
    }
}

Ajax::init();
