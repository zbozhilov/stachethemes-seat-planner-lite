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
     * Validates that a discount is available for the given seat (checks seat group).
     *
     * @param Auditorium_Product $product
     * @param string             $seat_id
     * @param string             $selected_date
     * @param array{name?: string, type?: string, value?: float} $seat_discount
     * @return void
     * @throws \Exception When discount is invalid or not available for the seat group.
     */
    private static function validate_discount_for_seat(
        Auditorium_Product $product,
        string $seat_id,
        string $selected_date,
        array $seat_discount
    ): void {
        $name = isset($seat_discount['name']) ? trim((string) $seat_discount['name']) : '';
        if ($name === '') {
            throw new \Exception(esc_html__('Invalid discount: name is required.', 'stachethemes-seat-planner-lite'));
        }

        $discount = $product->get_discount_by_name($name);
        if (!$discount) {
            throw new \Exception(
                sprintf(
                    /* translators: %s: discount name */
                    esc_html__('Discount "%s" is not available for this product.', 'stachethemes-seat-planner-lite'),
                    esc_html($name)
                )
            );
        }

        $discount_group = isset($discount['group']) ? trim((string) $discount['group']) : '';
        if ($discount_group === '') {
            return;
        }

        $seat_obj = $product->get_seat_data($seat_id, '', 'apply_seat_object_overrides', $selected_date);
        if (!$seat_obj) {
            throw new \Exception(esc_html__('Seat not found.', 'stachethemes-seat-planner-lite'));
        }

        $seat_group = isset($seat_obj->group) ? trim((string) $seat_obj->group) : '';
        if ($discount_group !== $seat_group) {
            throw new \Exception(
                sprintf(
                    /* translators: %1$s: discount name, %2$s: seat group (or "none") */
                    esc_html__('Discount "%1$s" is not available for this seat (group: %2$s).', 'stachethemes-seat-planner-lite'),
                    esc_html($name),
                    $seat_group === '' ? esc_html__('none', 'stachethemes-seat-planner-lite') : esc_html($seat_group)
                )
            );
        }
    }

    /**
     * Get a single Auditorium product payload for the Manager UI.
     *
     * @param int    $product_id
     * @param bool   $include_dates Whether to include dates array when product has dates.
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function get_auditorium_product(int $product_id, bool $include_dates = false): array {

        try {
            if ($product_id < 1) {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            $product = wc_get_product($product_id);

            if (!$product || $product->get_type() !== 'auditorium') {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            /** @var Auditorium_Product $product */
            $has_dates = $product->has_dates();

            $image = $product->get_image_id() ? wp_get_attachment_image_src((int) $product->get_image_id(), 'thumbnail') : '';

            if (is_array($image)) {
                $image = $image[0];
            }

            $response_data = [
                'id'        => $product->get_id(),
                'name'      => $product->get_name(),
                'permalink' => $product->get_permalink(),
                'edit_link' => get_edit_post_link($product->get_id(), 'raw'),
                'has_dates' => $has_dates,
                'image'     => $image,
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
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
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

                    $image = $product->get_image_id() ? wp_get_attachment_image_src($product->get_image_id(), 'thumbnail') : '';

                    if (is_array($image)) {
                        $image = $image[0];
                    }

                    $formatted_products[] = [
                        /** @var Auditorium_Product $product */
                        'id'        => $product->get_id(),
                        'name'      => $product->get_name(),
                        'permalink' => $product->get_permalink(),
                        'edit_link' => get_edit_post_link($product->get_id(), 'raw'),
                        'has_dates' => $product->has_dates(),
                        'image'     => $image,
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
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function update_manager_seat_override(int $product_id, string $seat_id, string $selected_date, string $status): array {

        try {
            if ($product_id < 1) {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            if ($seat_id === '') {
                throw new \Exception(esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite'));
            }

            $product = wc_get_product($product_id);

            if (!$product || $product->get_type() !== 'auditorium') {
                throw new \Exception(esc_html__('Product not found', 'stachethemes-seat-planner-lite'));
            }

            // Validate that the seat exists in the product's seat plan
            /** @var Auditorium_Product $product */
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
             * For bulk updates (see bulk_update_manager_seat_overrides), we skip silently.
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
     * Bulk update Manager seat overrides for an Auditorium product.
     *
     * Applies the same status to multiple seats at once, following the same
     * validation logic as the single-seat method.
     *
     * @param int               $product_id
     * @param array<int, string> $seat_ids
     * @param string            $selected_date
     * @param string            $status
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function bulk_update_manager_seat_overrides(int $product_id, array $seat_ids, string $selected_date, string $status): array {

        try {
            if ($product_id < 1) {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            if (empty($seat_ids)) {
                throw new \Exception(esc_html__('No seats selected', 'stachethemes-seat-planner-lite'));
            }

            $product = wc_get_product($product_id);

            if (!$product || $product->get_type() !== 'auditorium') {
                throw new \Exception(esc_html__('Product not found', 'stachethemes-seat-planner-lite'));
            }

            // Validate selected date if provided
            /** @var Auditorium_Product $product */
            if ($selected_date && !$product->date_exists($selected_date)) {
                throw new \Exception(esc_html__('Invalid date', 'stachethemes-seat-planner-lite'));
            }

            // Validate status
            $allowed_statuses = ['default', 'available', 'unavailable', 'sold-out', 'on-site'];

            if ($status !== '' && !in_array($status, $allowed_statuses, true)) {
                throw new \Exception(esc_html__('Invalid status', 'stachethemes-seat-planner-lite'));
            }

            $success_count = 0;
            $skipped_count = 0;
            $failed_seats  = [];

            foreach ($seat_ids as $seat_id) {
                $seat_id = sanitize_text_field($seat_id);

                if (empty($seat_id)) {
                    $skipped_count++;
                    continue;
                }

                // Validate that the seat exists in the product's seat plan
                $seat_data = $product->get_seat_data($seat_id);

                if (!$seat_data) {
                    $failed_seats[] = $seat_id;
                    continue;
                }

                // Reset status to plan's default
                if ($status === 'default') {
                    $product->delete_manager_seat_override($seat_id, $selected_date);
                    $success_count++;
                    continue;
                }

                /**
                 * IMPORTANT: Order Protection Check
                 * ---------------------------------
                 * When setting status to 'available' or 'on-site', we MUST verify
                 * that the seat doesn't have existing orders. This prevents accidentally
                 * making already-sold seats available for purchase again (double booking).
                 *
                 * Logic:
                 * 1. Check if seat is marked as "taken" in product meta
                 * 2. If taken, query actual orders via Bookings_Data
                 * 3. If orders exist → SKIP this seat (do not change status)
                 * 4. If no orders → Safe to release (was likely an abandoned cart)
                 *
                 * Seats with orders can still be set to 'unavailable' or 'sold-out'
                 * since those statuses don't make the seat purchasable.
                 */
                if ($status === 'available' || $status === 'on-site') {
                    if ($product->is_seat_taken($seat_id, $selected_date)) {
                        $booking_data  = new Bookings_Data($product_id);
                        $seat_bookings = $booking_data->get_orders_with_seat($seat_id, $selected_date);

                        if (!empty($seat_bookings)) {
                            // Seat has actual orders - DO NOT change to available/on-site
                            $skipped_count++;
                            continue;
                        } else {
                            // No orders found - safe to release (stale taken flag from abandoned cart)
                            $product->delete_meta_taken_seat($seat_id, $selected_date);
                        }
                    }
                }

                // Update the override
                $override_data = ['status' => $status];
                $product->update_manager_seat_override($seat_id, $override_data, $selected_date);
                $success_count++;
            }

            $message = sprintf(
                // translators: %1$d - number of seats updated, %2$d - number of seats skipped
                esc_html__('Updated %1$d seats. Skipped %2$d seats (have orders or invalid).', 'stachethemes-seat-planner-lite'),
                $success_count,
                $skipped_count + count($failed_seats)
            );

            return [
                'success' => true,
                'data'    => [
                    'message'       => $message,
                    'success_count' => $success_count,
                    'skipped_count' => $skipped_count,
                    'failed_seats'  => $failed_seats,
                    'status'        => $status,
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
     * NOTE: Does not include refunded items.
     *
     * @param int $order_id
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function get_order_auditorium_items(int $order_id): array {

        try {
            if ($order_id < 1) {
                throw new \Exception(esc_html__('Invalid order ID', 'stachethemes-seat-planner-lite'));
            }

            $order = wc_get_order($order_id);

            if (!$order || !($order instanceof \WC_Order)) {
                throw new \Exception(esc_html__('Order not found', 'stachethemes-seat-planner-lite'));
            }

            $items       = [];
            $order_items = $order->get_items();

            foreach ($order_items as $item_id => $item) {
                $seat_data = Utils::normalize_seat_data_meta($item->get_meta('seat_data'));

                if (empty($seat_data)) {
                    continue;
                }

                // if is refunded, skip
                if (Order_Helper::is_item_refunded($order, $item_id)) {
                    continue;
                }

                $seat_discount = $item->get_meta('seat_discount');
                /** @var \WC_Order_Item_Product $item */
                $product_id = $item->get_product_id();
                $product = wc_get_product($product_id);

                if (!$product || $product->get_type() !== 'auditorium') {
                    throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
                }

                /** @var Auditorium_Product $product */

                $current_user_roles = wp_get_current_user()->roles;
                $discounts_data     = $product->get_discounts_data(['filter_by_roles' => $current_user_roles]);
                $custom_fields_data = $product->get_custom_fields_data(['editable_only' => true]);

                $item_data = [
                    'item_id'       => $item_id,
                    'product_id'    => $product_id,
                    'product_name'  => $product->get_name(),
                    'seat_data'     => $seat_data,
                    'seat_discount' => $seat_discount ?: null,
                    'seat_price'    => (float) $item->get_total(),
                    'has_dates'     => $product->has_dates(),
                ];

                if (!empty($discounts_data)) {
                    $item_data['discounts'] = $discounts_data;
                }

                if (!empty($custom_fields_data)) {
                    $item_data['customFields'] = $custom_fields_data;
                }

                $items[] = $item_data;
            }

            return [
                'success' => true,
                'data'    => [
                    'order_id'              => $order_id,
                    'order_status'          => $order->get_status(),
                    'order_total_formatted' => wc_price((float) $order->get_total() - (float) $order->get_total_tax()),
                    'items'                 => $items,
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
     * @param int                    $order_id
     * @param array<int, array<string, mixed>> $updates Array of update objects, each with 'item_id' and 'seat_data'.
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function update_order_item_meta(int $order_id, array $updates): array {

        try {
            if ($order_id < 1) {
                throw new \Exception(esc_html__('Invalid order ID', 'stachethemes-seat-planner-lite'));
            }

            $order = wc_get_order($order_id);

            if (!$order || !($order instanceof \WC_Order)) {
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
                $item_id       = isset($update['item_id']) ? (int) $update['item_id'] : 0;
                $seat_data     = isset($update['seat_data']) ? $update['seat_data'] : null;
                $seat_discount = isset($update['seat_discount']) ? $update['seat_discount'] : null;

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
                $existing_array = Utils::normalize_seat_data_meta($item->get_meta('seat_data'));

                $old_seat_id       = isset($existing_array['seatId']) ? $existing_array['seatId'] : '';
                $old_selected_date = isset($existing_array['selectedDate']) ? $existing_array['selectedDate'] : '';

                // Get the product to validate seat ID
                /** @var \WC_Order_Item_Product $item */
                $product_id = $item->get_product_id();
                $product = wc_get_product($product_id);

                if (!$product || $product->get_type() !== 'auditorium') {
                    throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
                }

                /** @var Auditorium_Product $product */

                // Sanitize seat_data fields (default to the existing seat data if it exists)
                $sanitized_seat_data = $existing_array;

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
                        $sanitized_key   = sanitize_text_field($key);
                        $sanitized_value = sanitize_text_field($value);
                        if (trim((string) $sanitized_value) !== '') {
                            $sanitized_custom_fields[$sanitized_key] = $sanitized_value;
                        }
                    }
                    $sanitized_seat_data['customFields'] = $sanitized_custom_fields;
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

                // Sanitize seat_discount if provided
                $sanitized_seat_discount = null;
                if ($seat_discount !== null) {
                    if (is_array($seat_discount) && !empty($seat_discount)) {
                        $discount_value = (float) ($seat_discount['value'] ?? 0);
                        if ($discount_value > 0) {
                            $sanitized_seat_discount = [
                                'name'  => sanitize_text_field($seat_discount['name'] ?? ''),
                                'type'  => in_array($seat_discount['type'] ?? '', ['percentage', 'fixed'], true) ? $seat_discount['type'] : 'percentage',
                                'value' => $discount_value,
                            ];
                        } else {
                            $sanitized_seat_discount = '';
                        }
                    } else {
                        // Empty array or non-array value - clear discount
                        $sanitized_seat_discount = '';
                    }
                }

                // Store processed data for second pass
                $processed_updates[] = [
                    'item'                    => $item,
                    'product'                 => $product,
                    'product_id'              => $product_id,
                    'sanitized_seat_data'     => $sanitized_seat_data,
                    'sanitized_seat_discount' => $sanitized_seat_discount,
                    'old_seat_id'             => $old_seat_id,
                    'old_selected_date'       => $old_selected_date,
                    'new_seat_id'             => $new_seat_id,
                    'new_selected_date'       => $new_selected_date,
                    'seat_id_changed'         => $seat_id_changed,
                    'date_changed'            => $date_changed,
                ];
            }

            // Validation pass: check discount and custom fields before any modifications
            foreach ($processed_updates as $processed) {
                $item                    = $processed['item'];
                $product                 = $processed['product'];
                $sanitized_seat_data     = $processed['sanitized_seat_data'];
                $sanitized_seat_discount = $processed['sanitized_seat_discount'];
                $new_seat_id             = $processed['new_seat_id'];
                $new_selected_date       = $processed['new_selected_date'];

                $effective_discount = null;

                if ($sanitized_seat_discount === '') {
                    $effective_discount = null;
                } elseif ($sanitized_seat_discount !== null) {
                    $effective_discount = $sanitized_seat_discount;
                } else {
                    $existing_discount = $item->get_meta('seat_discount');
                    if (is_array($existing_discount) && (float) ($existing_discount['value'] ?? 0) > 0) {
                        $effective_discount = $existing_discount;
                    }
                }

                if ($effective_discount !== null) {
                    $disc_val = (float) ($effective_discount['value'] ?? 0);
                    if ($disc_val > 0) {
                        self::validate_discount_for_seat($product, $new_seat_id, $new_selected_date, $effective_discount);
                    }
                }

                // Validate custom fields (required fields, visibility, mutual exclusivity)
                $editable_custom_fields = $product->get_custom_fields_data(['editable_only' => true]);
                if (!empty($editable_custom_fields)) {
                    $custom_fields = $sanitized_seat_data['customFields'] ?? [];
                    $cf_object     = (object) array_map('strval', is_array($custom_fields) ? $custom_fields : []);
                    $validation_result = $product->validate_custom_fields($cf_object);
                    if ($validation_result !== null && is_array($validation_result) && isset($validation_result['error'])) {
                        throw new \Exception($validation_result['error']);
                    }
                }
            }

            // Second pass: apply seat changes and process updates
            foreach ($processed_updates as $processed) {
                $item                    = $processed['item'];
                $product                 = $processed['product'];
                $product_id              = $processed['product_id'];
                $sanitized_seat_data     = $processed['sanitized_seat_data'];
                $sanitized_seat_discount = $processed['sanitized_seat_discount'];
                $old_seat_id             = $processed['old_seat_id'];
                $old_selected_date       = $processed['old_selected_date'];
                $new_seat_id             = $processed['new_seat_id'];
                $new_selected_date       = $processed['new_selected_date'];
                $seat_id_changed         = $processed['seat_id_changed'];
                $date_changed            = $processed['date_changed'];

                // Determine effective discount for price calculation
                $effective_discount = null;
                if ($sanitized_seat_discount !== null && is_array($sanitized_seat_discount)) {
                    // New discount was provided
                    $effective_discount = $sanitized_seat_discount;
                } elseif ($sanitized_seat_discount === null) {
                    // No discount change requested - use existing discount
                    $existing_discount = $item->get_meta('seat_discount');
                    if (is_array($existing_discount) && (float) ($existing_discount['value'] ?? 0) > 0) {
                        $effective_discount = $existing_discount;
                    }
                }
                // else: $sanitized_seat_discount is empty string - discount was explicitly removed, keep $effective_discount as null

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

                // Filter out conditionally hidden custom fields before saving.
                // This ensures that field values from conditionally-shown fields are not
                // persisted when those fields are no longer visible.
                if (isset($sanitized_seat_data['customFields']) && is_array($sanitized_seat_data['customFields'])) {
                    $cf_object = (object) $sanitized_seat_data['customFields'];
                    $sanitized_cf = $product->sanitize_custom_fields($cf_object);
                    $sanitized_seat_data['customFields'] = (array) $sanitized_cf;
                }

                // Attach read-only Meta type custom fields (same as create order / add-to-cart).
                if (!isset($sanitized_seat_data['customFields']) || !is_array($sanitized_seat_data['customFields'])) {
                    $sanitized_seat_data['customFields'] = [];
                }
                $meta_fields = $product->get_custom_fields_data(['meta_only' => true]);
                foreach ($meta_fields as $meta_field) {
                    /** @var \stdClass $meta_field */
                    $label = isset($meta_field->label) ? trim((string) $meta_field->label) : '';
                    if ($label !== '' && isset($meta_field->value)) {
                        $sanitized_seat_data['customFields'][ $label ] = $meta_field->value;
                    }
                }

                $item->update_meta_data('seat_data', $sanitized_seat_data);

                if ($sanitized_seat_discount !== null) {
                    $item->update_meta_data('seat_discount', $sanitized_seat_discount);
                }

                $item->save_meta_data();

                // Recalculate item price based on seat, discount, and custom fields
                $seat_obj = $product->get_seat_data(
                    $new_seat_id,
                    'add_to_cart',
                    'apply_seat_object_overrides',
                    $new_selected_date
                );
                $seat_price = $seat_obj && isset($seat_obj->price)
                    ? (float) $seat_obj->price
                    : (float) $product->get_price();

                $discount_to_apply = $effective_discount;

                if ($discount_to_apply) {
                    $seat_price = Auditorium_Product_Price_Adjustment::apply_discount($seat_price, $discount_to_apply);
                }

                $seat_price = max(0.0, $seat_price);

                $custom_fields = $sanitized_seat_data['customFields'] ?? [];
                if (!empty($custom_fields)) {
                    $cf_object = (object) array_map('strval', $custom_fields);
                    $surcharge = Auditorium_Product_Price_Adjustment::calculate_custom_fields_surcharge($product, $cf_object);
                    $seat_price = max(0.0, $seat_price + $surcharge);
                }

                $item->set_subtotal((string) $seat_price);
                $item->set_total((string) $seat_price);

                $updated_count++;
            }

            if ($updated_count > 0) {
                $order->calculate_totals();
                $order->save();

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

    /**
     * Create a new order for a seat.
     *
     * Creates a WooCommerce order with the specified auditorium product and seat,
     * marks the seat as taken, and optionally sends order emails.
     *
     * @param int    $product_id
     * @param string $seat_id
     * @param string $selected_date
     * @param string $customer_name
     * @param string $customer_email
     * @param string $customer_phone
     * @param string   $order_status
     * @param bool     $send_emails
     * @param array{type: string, value: float, name: string}|null $seat_discount Optional. Discount to apply (type: 'fixed'|'percentage', value, name).
     * @param array<string, mixed>|null $seat_custom_fields Optional. Custom field values keyed by field label.
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function create_order_for_seat(
        int $product_id,
        string $seat_id,
        string $selected_date,
        string $customer_name,
        string $customer_email,
        string $customer_phone = '',
        string $order_status = 'processing',
        bool $send_emails = true,
        ?array $seat_discount = null,
        ?array $seat_custom_fields = null
    ): array {

        try {
            // Validate product ID
            if ($product_id < 1) {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            // Validate seat ID
            if (empty($seat_id)) {
                throw new \Exception(esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite'));
            }

            // Validate customer data
            if (empty($customer_name)) {
                throw new \Exception(esc_html__('Customer name is required', 'stachethemes-seat-planner-lite'));
            }

            if (empty($customer_email)) {
                throw new \Exception(esc_html__('Customer email is required', 'stachethemes-seat-planner-lite'));
            }

            if (!is_email($customer_email)) {
                throw new \Exception(esc_html__('Invalid email address', 'stachethemes-seat-planner-lite'));
            }

            // Validate order status
            $allowed_statuses = ['pending', 'processing', 'on-hold', 'completed'];
            if (!in_array($order_status, $allowed_statuses, true)) {
                throw new \Exception(esc_html__('Invalid order status', 'stachethemes-seat-planner-lite'));
            }

            // Get and validate product
            $product = wc_get_product($product_id);

            if (!$product || ! $product->is_type('auditorium')) {
                throw new \Exception(esc_html__('Product not found', 'stachethemes-seat-planner-lite'));
            }

            /** @var Auditorium_Product $product */

            // Validate that the seat exists in the product's seat plan
            $seat_data = $product->get_seat_data($seat_id);

            if (!$seat_data) {
                throw new \Exception(esc_html__('Seat not found in the product seat plan', 'stachethemes-seat-planner-lite'));
            }

            // Validate selected date if provided
            if ($selected_date && !$product->date_exists($selected_date)) {
                throw new \Exception(esc_html__('Invalid date', 'stachethemes-seat-planner-lite'));
            }

            // Check if the seat is already taken
            if ($product->is_seat_taken($seat_id, $selected_date)) {

                // Check if the seat has order
                // We will allow to create a new order if the seat doesn't have an order associated with it
                $order_details = new Bookings_Data($product_id);
                $order_details = $order_details->get_order_details_by_seat_id($seat_id, $selected_date);
                if ($order_details) {
                    throw new \Exception(esc_html__('This seat is already taken by another order', 'stachethemes-seat-planner-lite'));
                }
            }

            // Check if the email belongs to an existing customer and if so, use the customer ID
            $customer = get_user_by('email', $customer_email);
            if ($customer) {
                $customer_id = $customer->ID;
            } else {
                $customer_id = 0;
            }

            // Temporarily disable emails during order creation to control when they're sent
            add_filter('woocommerce_email_enabled_new_order', '__return_false', 999);
            add_filter('woocommerce_email_enabled_customer_processing_order', '__return_false', 999);
            add_filter('woocommerce_email_enabled_customer_completed_order', '__return_false', 999);
            add_filter('woocommerce_email_enabled_customer_on_hold_order', '__return_false', 999);

            // Create the order with pending status first, then change it later
            $order = wc_create_order([
                'status'        => 'pending',
                'customer_id'   => $customer_id,
                'created_via'   => 'seat-planner-admin',
            ]);

            // Remove email filters immediately after order creation
            remove_filter('woocommerce_email_enabled_new_order', '__return_false', 999);
            remove_filter('woocommerce_email_enabled_customer_processing_order', '__return_false', 999);
            remove_filter('woocommerce_email_enabled_customer_completed_order', '__return_false', 999);
            remove_filter('woocommerce_email_enabled_customer_on_hold_order', '__return_false', 999);

            if (!$order || is_wp_error($order)) {
                throw new \Exception(esc_html__('Failed to create order', 'stachethemes-seat-planner-lite'));
            }

            // Set billing information - populate from existing customer if available
            if ($customer_id > 0) {
                $wc_customer = new \WC_Customer($customer_id);

                // Use provided name, but fall back to customer's stored name if available
                $billing_first_name = $customer_name;
                $billing_last_name  = '';

                // Try to get first/last name from customer
                $stored_first_name = $wc_customer->get_billing_first_name();
                $stored_last_name  = $wc_customer->get_billing_last_name();

                if (!empty($stored_first_name)) {
                    $billing_first_name = $stored_first_name;
                    $billing_last_name  = $stored_last_name;
                }

                $order->set_billing_first_name($billing_first_name);
                $order->set_billing_last_name($billing_last_name);
                $order->set_billing_email($customer_email);
                $order->set_billing_phone(!empty($customer_phone) ? $customer_phone : $wc_customer->get_billing_phone());
                $order->set_billing_company($wc_customer->get_billing_company());
                $order->set_billing_address_1($wc_customer->get_billing_address_1());
                $order->set_billing_address_2($wc_customer->get_billing_address_2());
                $order->set_billing_city($wc_customer->get_billing_city());
                $order->set_billing_state($wc_customer->get_billing_state());
                $order->set_billing_postcode($wc_customer->get_billing_postcode());
                $order->set_billing_country($wc_customer->get_billing_country());
            } else {
                // Guest customer - use provided data
                $order->set_billing_first_name($customer_name);
                $order->set_billing_email($customer_email);

                if (!empty($customer_phone)) {
                    $order->set_billing_phone($customer_phone);
                }
            }

            // Validate discount is available for this seat (group check)
            if ($seat_discount && (float) ($seat_discount['value'] ?? 0) > 0) {
                self::validate_discount_for_seat($product, $seat_id, $selected_date, $seat_discount);
            }

            // Get seat price from the seat data
            $seat_price = isset($seat_data->price) ? (float) $seat_data->price : (float) $product->get_price();

            // Apply discount if provided
            $seat_price = Auditorium_Product_Price_Adjustment::apply_discount($seat_price, $seat_discount);
            $seat_price = max(0.0, $seat_price);

            $order_custom_fields = [];
            $editable_custom_fields = $product->get_custom_fields_data(['editable_only' => true]);

            if (!empty($editable_custom_fields)) {
                // Product has custom fields: always validate integrity and values, then sanitize.
                $cf_object = (is_array($seat_custom_fields) && $seat_custom_fields !== [])
                    ? (object) $seat_custom_fields
                    : new \stdClass();

                $validation_result = $product->validate_custom_fields($cf_object);
                if ($validation_result !== null && is_array($validation_result) && isset($validation_result['error'])) {
                    throw new \Exception(esc_html($validation_result['error']));
                }

                $sanitized_custom_fields = $product->sanitize_custom_fields($cf_object);
                if ($sanitized_custom_fields instanceof \stdClass) {
                    $order_custom_fields = (array) $sanitized_custom_fields;
                    if ($order_custom_fields !== []) {
                        $surcharge = Auditorium_Product_Price_Adjustment::calculate_custom_fields_surcharge($product, $sanitized_custom_fields);
                        $seat_price = max(0.0, $seat_price + $surcharge);
                    }
                }
            } elseif (is_array($seat_custom_fields) && $seat_custom_fields !== []) {
                // Product has no editable custom fields but request sent some: reject.
                throw new \Exception(esc_html__('No seat options are configured for this product', 'stachethemes-seat-planner-lite'));
            }

            // Attach read-only Meta type custom fields (same as add-to-cart flow).
            $meta_fields = $product->get_custom_fields_data(['meta_only' => true]);
            foreach ($meta_fields as $meta_field) {
                /** @var \stdClass $meta_field */
                $label = isset($meta_field->label) ? trim((string) $meta_field->label) : '';
                if ($label !== '' && isset($meta_field->value)) {
                    $order_custom_fields[ $label ] = $meta_field->value;
                }
            }

            // Add product to order
            $item = new \WC_Order_Item_Product();
            $item->set_product($product);
            $item->set_quantity(1);
            $item->set_subtotal((string) $seat_price);
            $item->set_total((string) $seat_price);

            // Prepare seat data for the order item
            $order_seat_data = [
                'seatId'       => $seat_id,
                'selectedDate' => $selected_date,
                'customFields' => $order_custom_fields,
            ];

            // Add seat metadata
            $item->add_meta_data('seat_data', $order_seat_data, true);
            $item->add_meta_data('seat_discount', $seat_discount && (float) ($seat_discount['value'] ?? 0) > 0 ? $seat_discount : '', true);

            // Add item to order
            $order->add_item($item);

            // Set order meta for auditorium products
            $order->update_meta_data('has_auditorium_product', '1');
            $order->update_meta_data('auditorium_product_id', (string) $product_id);

            // Calculate totals
            $order->calculate_totals();

            // Save order to get item ID
            $order->save();

            // Generate QR code for the seat
            $item_id        = $item->get_id();
            $secret_key     = wp_generate_password(6, false);
            $qr_code_string = $order->get_order_key() . '-' . $product_id . '-' . $item_id . '-' . $secret_key;
            $qr_code_url    = QRCode::get_qr_code($qr_code_string);

            if ($qr_code_url) {
                $order_seat_data['qr_code']        = $qr_code_url;
                $order_seat_data['qr_code_secret'] = $secret_key;
                $item->update_meta_data('seat_data', $order_seat_data);
                $item->save_meta_data();
            }

            // Mark the seat as taken
            $product->add_meta_taken_seat($seat_id, $selected_date);
            $product->save_meta_data();

            // Add order note
            $current_user = wp_get_current_user();
            $order->add_order_note(
                sprintf(
                    // translators: %1$s - seat ID, %2$s - user name
                    esc_html__('Order created manually for seat %1$s by %2$s via Seat Planner Admin Panel.', 'stachethemes-seat-planner-lite'),
                    $seat_id,
                    $current_user->display_name
                )
            );

            // Save order again with all updates
            $order->save();

            // Always suppress automatic emails during status change so we have full control
            add_filter('woocommerce_email_enabled_new_order', '__return_false', 999);
            add_filter('woocommerce_email_enabled_customer_processing_order', '__return_false', 999);
            add_filter('woocommerce_email_enabled_customer_completed_order', '__return_false', 999);
            add_filter('woocommerce_email_enabled_customer_on_hold_order', '__return_false', 999);

            // Change status from pending to the requested status
            if ($order_status !== 'pending') {
                $order->update_status($order_status, __('Status set via Seat Planner Admin Panel.', 'stachethemes-seat-planner-lite'));
            }

            // Remove email filters
            remove_filter('woocommerce_email_enabled_new_order', '__return_false', 999);
            remove_filter('woocommerce_email_enabled_customer_processing_order', '__return_false', 999);
            remove_filter('woocommerce_email_enabled_customer_completed_order', '__return_false', 999);
            remove_filter('woocommerce_email_enabled_customer_on_hold_order', '__return_false', 999);

            // Send order emails only if requested
            if ($send_emails) {
                // Ensure WooCommerce mailer is loaded
                $mailer = WC()->mailer();
                $emails = $mailer->get_emails();

                // Trigger new order email to admin
                $new_order_email = isset($emails['WC_Email_New_Order']) ? $emails['WC_Email_New_Order'] : null;
                if ($new_order_email && method_exists($new_order_email, 'trigger')) {
                    /** @var \WC_Email_New_Order $new_order_email */
                    $new_order_email->trigger($order->get_id(), $order);
                }

                // Trigger customer notification based on order status
                $email_class = '';
                switch ($order_status) {
                    case 'processing':
                        $email_class = 'WC_Email_Customer_Processing_Order';
                        break;
                    case 'completed':
                        $email_class = 'WC_Email_Customer_Completed_Order';
                        break;
                    case 'on-hold':
                        $email_class = 'WC_Email_Customer_On_Hold_Order';
                        break;
                }

                $customer_email_obj = ($email_class && isset($emails[$email_class])) ? $emails[$email_class] : null;
                if ($customer_email_obj && method_exists($customer_email_obj, 'trigger')) {
                    /** @var \WC_Email_Customer_Processing_Order|\WC_Email_Customer_Completed_Order|\WC_Email_Customer_On_Hold_Order $customer_email_obj */
                    $customer_email_obj->trigger($order->get_id(), $order);
                }
            }

            return [
                'success' => true,
                'data'    => [
                    'message'        => esc_html__('Order created successfully', 'stachethemes-seat-planner-lite'),
                    'order_id'       => $order->get_id(),
                    'order_status'   => $order->get_status(),
                    'order_edit_url' => get_edit_post_link($order->get_id(), 'raw'),
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
