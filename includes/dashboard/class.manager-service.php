<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Manager service
 *
 * Encapsulates Manager-related business logic used by the AJAX controller.
 * All methods return a normalized array in the form:
 * [
 *   'success' => bool,
 *   'data'    => mixed|null,
 *   'error'   => string|null,
 * ]
 *
 * The Ajax controller is responsible for permissions, request parsing,
 * and translating these results into wp_send_json_* responses.
 */
class Manager_Service {

    /**
     * Get a single Auditorium product payload for the Manager UI.
     *
     * @param int    $product_id
     * @param bool   $include_dates Whether to include dates array when product has dates.
     *
     * @return array
     */
    public static function get_auditorium_product(int $product_id, bool $include_dates = false): array {

        try {
            if ($product_id < 1) {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            /** @var Auditorium_Product $product */
            $product = wc_get_product($product_id);

            if (!$product || $product->get_type() !== 'auditorium') {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            $has_dates = $product->has_dates();

            $response_data = [
                'id'        => $product->get_id(),
                'name'      => $product->get_name(),
                'permalink' => $product->get_permalink(),
                'edit_link' => get_edit_post_link($product->get_id(), 'raw'),
                'has_dates' => $has_dates,
                'image'     => $product->get_image_id() ? wp_get_attachment_image_src($product->get_image_id(), 'thumbnail')[0] : '',
            ];

            if ($include_dates && $has_dates) {
                $response_data['dates'] = $product->get_dates_data();
            }

            return [
                'success' => true,
                'data'    => $response_data,
                'error'   => null,
            ];
        } catch (\Throwable $th) {
            return [
                'success' => false,
                'data'    => null,
                'error'   => $th->getMessage(),
            ];
        }
    }

    /**
     * Get paginated Auditorium products list for the Manager listing.
     *
     * @param string $search
     * @param int    $page
     * @param int    $per_page
     *
     * @return array
     */
    public static function get_auditorium_products(string $search = '', int $page = 1, int $per_page = 10): array {

        try {
            if ($page < 1) {
                $page = 1;
            }

            if ($per_page < 1 || $per_page > 100) {
                $per_page = 10;
            }

            $args = [
                'type'    => 'auditorium',
                'status'  => 'publish',
                'limit'   => $per_page,
                'offset'  => ($page - 1) * $per_page,
                'orderby' => 'title',
                'order'   => 'ASC',
            ];

            // Add search if provided
            if (!empty($search)) {
                $args['s'] = $search;
            }

            // Get total count for pagination
            $count_args           = $args;
            $count_args['limit']  = -1;
            $count_args['return'] = 'ids';

            $total_products = wc_get_products($count_args);
            $total          = is_array($total_products) ? count($total_products) : 0;

            // Get products
            $products = wc_get_products($args);

            $formatted_products = [];

            if (is_array($products)) {
                foreach ($products as $product) {
                    /** @var Auditorium_Product $product */
                    $formatted_products[] = [
                        'id'        => $product->get_id(),
                        'name'      => $product->get_name(),
                        'permalink' => $product->get_permalink(),
                        'edit_link' => get_edit_post_link($product->get_id(), 'raw'),
                        'has_dates' => $product->has_dates(),
                        'image'     => $product->get_image_id() ? wp_get_attachment_image_src($product->get_image_id(), 'thumbnail')[0] : '',
                    ];
                }
            }

            $total_pages = $total > 0 ? ceil($total / $per_page) : 0;

            return [
                'success' => true,
                'data'    => [
                    'products'    => $formatted_products,
                    'total'       => $total,
                    'page'        => $page,
                    'per_page'    => $per_page,
                    'total_pages' => $total_pages,
                ],
                'error'   => null,
            ];
        } catch (\Throwable $th) {
            return [
                'success' => false,
                'data'    => null,
                'error'   => $th->getMessage(),
            ];
        }
    }

    /**
     * Update a Manager seat override for an Auditorium product.
     *
     * This mirrors the existing behavior used by the Manager seat override UI.
     *
     * @param int    $product_id
     * @param string $seat_id
     * @param string $selected_date
     * @param string $status
     *
     * @return array
     */
    public static function update_manager_seat_override(int $product_id, string $seat_id, string $selected_date, string $status): array {

        try {
            if ($product_id < 1) {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            if ($seat_id === '') {
                throw new \Exception(esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite'));
            }

            /** @var Auditorium_Product $product */
            $product = wc_get_product($product_id);

            if (!$product || $product->get_type() !== 'auditorium') {
                throw new \Exception(esc_html__('Product not found', 'stachethemes-seat-planner-lite'));
            }

            // Validate that the seat exists in the product's seat plan
            $seat_data = $product->get_seat_data($seat_id);

            if (!$seat_data) {
                throw new \Exception(esc_html__('Seat not found in the product seat plan', 'stachethemes-seat-planner-lite'));
            }

            // Validate selected date if provided
            if ($selected_date && !$product->date_exists($selected_date)) {
                throw new \Exception(esc_html__('Invalid date', 'stachethemes-seat-planner-lite'));
            }

            // Validate status
            $allowed_statuses = ['default', 'available', 'unavailable', 'sold-out', 'on-site'];

            if ($status !== '' && !in_array($status, $allowed_statuses, true)) {
                throw new \Exception(esc_html__('Invalid status', 'stachethemes-seat-planner-lite'));
            }

            // Reset status to plan's default
            // Currently we have only status as override
            // So in this case just delete the seat override as a whole
            // but in the future we may have more overrides, so we need to handle it accordingly
            // by unsetting the specific override key
            if ($status === 'default') {
                $product->delete_manager_seat_override($seat_id, $selected_date);

                return [
                    'success' => true,
                    'data'    => [
                        'message' => esc_html__('Seat override removed', 'stachethemes-seat-planner-lite'),
                        'seat_id' => $seat_id,
                        'status'  => 'default',
                    ],
                    'error'   => null,
                ];
            }

            /**
             * IMPORTANT: Order Protection Check
             * ---------------------------------
             * When setting status to 'available' or 'on-site', we MUST verify
             * that the seat doesn't have existing orders. This prevents accidentally
             * making already-sold seats available for purchase again (double booking).
             *
             * For single-seat updates, we throw an error to inform the admin.
             */
            if ($status === 'available' || $status === 'on-site') {
                if ($product->is_seat_taken($seat_id, $selected_date)) {

                    $booking_data  = new Bookings_Data($product_id);
                    $seat_bookings = $booking_data->get_orders_with_seat($seat_id, $selected_date);

                    if (!empty($seat_bookings)) {
                        // Seat has actual orders - DO NOT allow changing to available/on-site
                        throw new \Exception(esc_html__('Seat is already taken by an order', 'stachethemes-seat-planner-lite'));
                    } else {
                        // No orders found - safe to release (stale taken flag from abandoned cart)
                        $product->delete_meta_taken_seat($seat_id, $selected_date);
                    }

                }
            }

            // Update the override
            $override_data = ['status' => $status];
            $product->update_manager_seat_override($seat_id, $override_data, $selected_date);

            return [
                'success' => true,
                'data'    => [
                    'message' => esc_html__('Seat override updated', 'stachethemes-seat-planner-lite'),
                    'seat_id' => $seat_id,
                    'status'  => $status,
                ],
                'error'   => null,
            ];
        } catch (\Throwable $th) {
            return [
                'success' => false,
                'data'    => null,
                'error'   => $th->getMessage(),
            ];
        }
    }

    /**
     * Get auditorium items from an order.
     *
     * Returns all order items that have seat_data meta, along with their
     * associated auditorium product information.
     *
     * @param int $order_id
     *
     * @return array
     */
    public static function get_order_auditorium_items(int $order_id): array {

        try {
            if ($order_id < 1) {
                throw new \Exception(esc_html__('Invalid order ID', 'stachethemes-seat-planner-lite'));
            }

            $order = wc_get_order($order_id);

            if (!$order) {
                throw new \Exception(esc_html__('Order not found', 'stachethemes-seat-planner-lite'));
            }

            $items        = [];
            $order_items = $order->get_items();

            foreach ($order_items as $item_id => $item) {
                $seat_data = $item->get_meta('seat_data');

                if (!$seat_data) {
                    continue;
                }

                $seat_discount = $item->get_meta('seat_discount');
                /** @var \WC_Order_Item_Product $item */
                $product_id = $item->get_product_id();
                /** @var Auditorium_Product $product */
                $product = wc_get_product($product_id);

                if (!$product || $product->get_type() !== 'auditorium') {
                    throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
                }

                $items[] = [
                    'item_id'       => $item_id,
                    'product_id'    => $product_id,
                    'product_name'  => $product ? $product->get_name() : __('Unknown Product', 'stachethemes-seat-planner-lite'),
                    'seat_data'     => $seat_data,
                    'seat_discount' => $seat_discount ?: null,
                    'has_dates'     => $product->has_dates(),
                ];
            }

            return [
                'success' => true,
                'data'    => [
                    'order_id'     => $order_id,
                    'order_status' => $order->get_status(),
                    'items'        => $items,
                ],
                'error'   => null,
            ];
        } catch (\Throwable $th) {
            return [
                'success' => false,
                'data'    => null,
                'error'   => $th->getMessage(),
            ];
        }
    }

    /**
     * Update order item metadata (seat_data) for auditorium products.
     *
     * Handles validation, sanitization, and updating taken seats when
     * seat ID or date changes for orders in 'completed' or 'processing' status.
     *
     * @param int   $order_id
     * @param array $updates Array of update objects, each with 'item_id' and 'seat_data'.
     *
     * @return array
     */
    public static function update_order_item_meta(int $order_id, array $updates): array {

        try {
            if ($order_id < 1) {
                throw new \Exception(esc_html__('Invalid order ID', 'stachethemes-seat-planner-lite'));
            }

            $order = wc_get_order($order_id);

            if (!$order) {
                throw new \Exception(esc_html__('Order not found', 'stachethemes-seat-planner-lite'));
            }

            $order_items   = $order->get_items();
            $updated_count = 0;
            $order_status  = $order->get_status();

            // Statuses where seats are considered "taken" in the product meta
            $taken_statuses            = ['completed', 'processing'];
            $should_update_taken_seats = in_array($order_status, $taken_statuses, true);

            // First pass: collect all the seat changes and build a list of seats being released
            // This is needed to allow swapping seats between items in the same order
            $processed_updates   = [];
            $seats_being_released = []; // key: product_id-seat_id-date, value: true

            foreach ($updates as $update) {
                $item_id   = isset($update['item_id']) ? (int) $update['item_id'] : 0;
                $seat_data = isset($update['seat_data']) ? $update['seat_data'] : null;

                if (!$item_id || !$seat_data) {
                    continue;
                }

                // Verify the item belongs to this order
                $item = null;
                foreach ($order_items as $oid => $oitem) {
                    if ((int) $oid === $item_id) {
                        $item = $oitem;
                        break;
                    }
                }

                if (!$item) {
                    continue;
                }

                // Get existing seat data for comparison
                $existing_seat_data = $item->get_meta('seat_data');
                $existing_array     = $existing_seat_data ? (is_object($existing_seat_data) ? (array) $existing_seat_data : $existing_seat_data) : [];

                $old_seat_id       = isset($existing_array['seatId']) ? $existing_array['seatId'] : '';
                $old_selected_date = isset($existing_array['selectedDate']) ? $existing_array['selectedDate'] : '';

                // Get the product to validate seat ID
                /** @var \WC_Order_Item_Product $item */
                $product_id = $item->get_product_id();
                /** @var Auditorium_Product $product */
                $product = wc_get_product($product_id);

                if (!$product || $product->get_type() !== 'auditorium') {
                    throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
                }

                // Sanitize seat_data fields (default to the existing seat data if it exists)
                $sanitized_seat_data = $existing_seat_data ? (is_object($existing_seat_data) ? (array) $existing_seat_data : $existing_seat_data) : [];

                if (isset($seat_data['seatId'])) {
                    $sanitized_seat_data['seatId'] = sanitize_text_field($seat_data['seatId']);

                    // Validate that the seat ID exists in the product's seat plan
                    $seat_exists = $product->get_seat_data($sanitized_seat_data['seatId']);
                    if (!$seat_exists) {
                        throw new \Exception(
                            sprintf(
                                // translators: %s - seat ID
                                __('Seat ID "%s" does not exist in the product\'s seat plan.', 'stachethemes-seat-planner-lite'),
                                esc_html($sanitized_seat_data['seatId'])
                            )
                        );
                    }
                }

                if (isset($seat_data['selectedDate'])) {
                    $sanitized_seat_data['selectedDate'] = sanitize_text_field($seat_data['selectedDate']);

                    // Validate date if product has dates
                    if ($product->has_dates()) {
                        // Don't allow empty date for products with dates
                        if (empty($sanitized_seat_data['selectedDate'])) {
                            throw new \Exception(__('Date cannot be empty for this product.', 'stachethemes-seat-planner-lite'));
                        }

                        // Validate that the date exists in product's dates
                        if (!$product->date_exists($sanitized_seat_data['selectedDate'])) {
                            throw new \Exception(
                                sprintf(
                                    // translators: %s - date
                                    __('Date "%s" does not exist for this product.', 'stachethemes-seat-planner-lite'),
                                    esc_html($sanitized_seat_data['selectedDate'])
                                )
                            );
                        }
                    }
                }

                if (isset($seat_data['customFields']) && is_array($seat_data['customFields'])) {
                    $sanitized_custom_fields = [];
                    foreach ($seat_data['customFields'] as $key => $value) {
                        $sanitized_custom_fields[sanitize_text_field($key)] = sanitize_text_field($value);
                    }
                    $sanitized_seat_data['customFields'] = (object) $sanitized_custom_fields;
                }

                $new_seat_id       = isset($sanitized_seat_data['seatId']) ? $sanitized_seat_data['seatId'] : $old_seat_id;
                $new_selected_date = isset($sanitized_seat_data['selectedDate']) ? $sanitized_seat_data['selectedDate'] : $old_selected_date;

                $seat_id_changed = $old_seat_id && $new_seat_id && $old_seat_id !== $new_seat_id;
                $date_changed    = $old_selected_date !== $new_selected_date;

                // Track seats being released for swap detection
                if ($should_update_taken_seats && ($seat_id_changed || $date_changed) && $old_seat_id) {
                    $release_key                        = $product_id . '-' . $old_seat_id . '-' . $old_selected_date;
                    $seats_being_released[$release_key] = true;
                }

                // Store processed data for second pass
                $processed_updates[] = [
                    'item'                 => $item,
                    'product'              => $product,
                    'product_id'           => $product_id,
                    'sanitized_seat_data'  => $sanitized_seat_data,
                    'old_seat_id'          => $old_seat_id,
                    'old_selected_date'    => $old_selected_date,
                    'new_seat_id'          => $new_seat_id,
                    'new_selected_date'    => $new_selected_date,
                    'seat_id_changed'      => $seat_id_changed,
                    'date_changed'         => $date_changed,
                ];
            }

            // Second pass: validate seat availability and process updates
            foreach ($processed_updates as $processed) {
                $item                = $processed['item'];
                $product             = $processed['product'];
                $product_id          = $processed['product_id'];
                $sanitized_seat_data = $processed['sanitized_seat_data'];
                $old_seat_id         = $processed['old_seat_id'];
                $old_selected_date   = $processed['old_selected_date'];
                $new_seat_id         = $processed['new_seat_id'];
                $new_selected_date   = $processed['new_selected_date'];
                $seat_id_changed     = $processed['seat_id_changed'];
                $date_changed        = $processed['date_changed'];

                // Handle seat ID or date change - release old seat and take new seat
                if ($should_update_taken_seats && ($seat_id_changed || $date_changed)) {
                    // Check if new seat is already taken on the new date
                    // BUT allow if the seat is being released by another item in this same batch (swap scenario)
                    $new_seat_key       = $product_id . '-' . $new_seat_id . '-' . $new_selected_date;
                    $is_being_released  = isset($seats_being_released[$new_seat_key]);

                    if ($product->is_seat_taken($new_seat_id, $new_selected_date) && !$is_being_released) {
                        throw new \Exception(
                            sprintf(
                                // translators: %s - seat ID
                                __('Seat %s is already taken on the selected date. Please choose a different seat or date.', 'stachethemes-seat-planner-lite'),
                                esc_html($new_seat_id)
                            )
                        );
                    }

                    // Release the old seat on the old date
                    $product->delete_meta_taken_seat($old_seat_id, $old_selected_date);

                    // Take the new seat on the new date
                    $product->add_meta_taken_seat($new_seat_id, $new_selected_date);
                    $product->save_meta_data();
                }

                $item->update_meta_data('seat_data', (object) $sanitized_seat_data);
                $item->save_meta_data();
                $updated_count++;
            }

            if ($updated_count > 0) {
                // Add order note for audit trail
                $order->add_order_note(
                    sprintf(
                        // translators: %1$d - number of items updated, %2$s - user name
                        esc_html__('Order item metadata updated for %1$d item(s) by %2$s via Seat Planner Admin Panel.', 'stachethemes-seat-planner-lite'),
                        $updated_count,
                        wp_get_current_user()->display_name
                    )
                );
            }

            return [
                'success' => true,
                'data'    => [
                    'message'       => esc_html__('Order items updated successfully.', 'stachethemes-seat-planner-lite'),
                    'updated_count' => $updated_count,
                ],
                'error'   => null,
            ];
        } catch (\Throwable $th) {
            return [
                'success' => false,
                'data'    => null,
                'error'   => $th->getMessage(),
            ];
        }
    }
}

