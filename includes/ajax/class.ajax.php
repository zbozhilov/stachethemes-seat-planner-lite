<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Ajax {

    public static function init() {
        add_action('wp_ajax_seatplanner', [__CLASS__, 'handle_ajax_requests']);
        add_action('wp_ajax_nopriv_seatplanner', [__CLASS__, 'handle_ajax_requests']);
    }

    public static function handle_ajax_requests() {

        check_ajax_referer('stachethemes_seat_planner', 'nonce', true);

        $task = isset($_POST['task']) ? sanitize_key(wp_unslash($_POST['task'])) : '';

        $allowed_tasks = [
            'get_seat_plan_data',
            'add_seats_to_cart',
            'get_qr_string_details',
            'check_double_booking',
            'check_product_ghost_booking',
            'fix_ghost_booking',
            'get_product_ids',
            'check_product_booking',
            'get_order_details_by_seat_id'
        ];

        if (empty($task) || !in_array($task, $allowed_tasks, true)) {
            wp_send_json_error(['error' => esc_html__('Invalid task', 'stachethemes-seat-planner-lite')]);
        }

        try {

            switch ($task) {

                case 'get_seat_plan_data': {

                        $product_id    = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
                        $selected_date = isset($_POST['selected_date']) ? sanitize_text_field(wp_unslash($_POST['selected_date'])) : '';

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        /** @var Auditorium_Product $auditorium_product */
                        $auditorium_product = wc_get_product($product_id);

                        if (!$auditorium_product || $auditorium_product->get_type() !== 'auditorium') {
                            wp_send_json_error(['error' => esc_html__('Product not found', 'stachethemes-seat-planner-lite')]);
                        }

                        if (!$auditorium_product->get_id()) {
                            wp_send_json_error(['error' => esc_html__('Product not found', 'stachethemes-seat-planner-lite')]);
                        }

                        if ($selected_date) {
                            // Verify date exists and is valid format
                            $dates = $auditorium_product->get_dates_data();
                            if (!in_array($selected_date, $dates)) {
                                wp_send_json_error(['error' => esc_html__('Invalid date', 'stachethemes-seat-planner-lite')]);
                            }
                        }

                        $seat_plan_data = $auditorium_product->get_seat_plan_data('object');

                        if (!is_object($seat_plan_data) || !isset($seat_plan_data->objects)) {
                            wp_send_json_error(['error' => esc_html__('Failed to retrieve seat plan data', 'stachethemes-seat-planner-lite')]);
                        }

                        $taken_seats_args = [];

                        if ($selected_date) {
                            $taken_seats_args['selected_date'] = $selected_date;
                        }

                        $taken_seats = $auditorium_product->get_taken_seats($taken_seats_args);

                        if (!is_array($taken_seats)) {
                            wp_send_json_error(['error' => esc_html__('Failed to retrieve taken seats', 'stachethemes-seat-planner-lite')]);
                        }

                        $seat_plan_data->objects = array_map(function ($object) use ($taken_seats) {
                            if ($object->type !== 'seat') {
                                return $object;
                            }
                            $object->taken = isset($object->seatId) ? in_array($object->seatId, $taken_seats) : false;
                            return $object;
                        }, $seat_plan_data->objects);

                        $discounts_data = $auditorium_product->get_discounts_data();

                        if (is_array($discounts_data) && !empty($discounts_data)) {
                            $seat_plan_data->discounts = $discounts_data;
                        }

                        wp_send_json_success($seat_plan_data);

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
                 *     [{ "seatId": string, "discountId": string }]
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

                            if ($auditorium_product->has_date_passed($selected_date)) {
                                wp_send_json_error(['error' => esc_html__('The selected date is no longer available', 'stachethemes-seat-planner-lite')]);
                            }
                        }

                        // Ensure we work with unique selected seats and handle duplicates correctly (preserve string seat IDs)
                        $unique_selected_seats = []; // list of ['seatId' => string, 'discountId' => string]
                        $seen_seat_ids = []; // list of strings for strict duplicate checks
                        foreach ($seats_object as $seat_data) {
                            if (!isset($seat_data->seatId) || !is_string($seat_data->seatId) || '' === $seat_data->seatId) {
                                wp_send_json_error(['error' => esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite')]);
                            }
                            $seat_id       = sanitize_text_field($seat_data->seatId);
                            $seat_discount = isset($seat_data->discountId) ? sanitize_text_field($seat_data->discountId) : '';
                            if (!in_array($seat_id, $seen_seat_ids, true)) {
                                $unique_selected_seats[] = [
                                    'seatId'     => $seat_id,
                                    'discountId' => $seat_discount,
                                ];
                                $seen_seat_ids[] = $seat_id;
                            }
                        }

                        $get_seats_in_cart_args = [];
                        if ($selected_date) {
                            $get_seats_in_cart_args['selected_date'] = $selected_date;
                        }
                        $seats_in_cart       = $auditorium_product->get_seats_in_cart($get_seats_in_cart_args);

                        // Compute total seats post-add (cart + new unique selections not already in cart)
                        $seats_in_cart_lookup = [];
                        if (is_array($seats_in_cart)) {
                            foreach ($seats_in_cart as $sid) {
                                $seats_in_cart_lookup[(string) $sid] = true;
                            }
                        }
                        $new_unique_seats = 0;
                        foreach ($unique_selected_seats as $item) {
                            $actual_seat_id = $item['seatId'];
                            if (!isset($seats_in_cart_lookup[$actual_seat_id])) {
                                $new_unique_seats++;
                            }
                        }

                        // Add only unique seats (first occurrence discount preference)
                        foreach ($unique_selected_seats as $item) {

                            $seat_id       = $item['seatId'];
                            $seat_discount = $item['discountId'];

                            if (!is_string($seat_id) || '' === $seat_id) {
                                wp_send_json_error(['error' => esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite')]);
                            }

                            if (!$auditorium_product->add_to_cart($seat_id, $seat_discount, $selected_date)) {
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
                            return;
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
