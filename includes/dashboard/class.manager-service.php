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
     * Allowed seat statuses for manager overrides.
     *
     * @var string[]
     */
    private const ALLOWED_SEAT_STATUSES = ['default', 'available', 'unavailable', 'sold-out', 'on-site'];

    /**
     * Order statuses where seats are considered "taken" in product meta.
     *
     * @var string[]
     */
    private const TAKEN_ORDER_STATUSES = ['completed', 'processing', 'on-hold'];

    /**
     * Load an Auditorium product by ID or throw an exception.
     *
     * @param int $product_id
     *
     * @return Auditorium_Product
     *
     * @throws \Exception When the product ID is invalid or product is not an auditorium product.
     */
    private static function get_auditorium_product_or_throw(int $product_id): Auditorium_Product {
        if ($product_id < 1) {
            throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
        }

        $product = wc_get_product($product_id);

        if (!$product || ! $product->is_type('auditorium')) {
            throw new \Exception(esc_html__('Product not found', 'stachethemes-seat-planner-lite'));
        }

        /** @var Auditorium_Product $product */
        return $product;
    }

    /**
     * Assert that a given date exists for the auditorium product.
     *
     * @param Auditorium_Product $product
     * @param string             $date
     * @param string             $error_message
     *
     * @return void
     * @throws \Exception When the date does not exist for the product.
     */
    private static function assert_product_date_exists(Auditorium_Product $product, string $date, string $error_message): void {
        if ($date && ! $product->date_exists($date)) {
            throw new \Exception(esc_html($error_message));
        }
    }

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
        return;
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
            $product  = self::get_auditorium_product_or_throw($product_id);
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
        $page     = max(1, $page);
        $per_page = max(1, min(100, $per_page));

        $query = wc_get_products([
            'type'      => 'auditorium',
            'status'    => 'publish',
            'limit'     => $per_page,
            'page'      => $page,
            'orderby'   => 'title',
            'order'     => 'DESC',
            's'         => $search,
            'paginate'  => true,
            'return'    => 'objects',
        ]);

        $formatted = [];

        if (is_array($query)) {
            return [
                'success' => false,
                'data'    => null,
                'error'   => esc_html__('Invalid query result', 'stachethemes-seat-planner-lite'),
            ]; // Expects stdClass object, not array
        };

        foreach ($query->products as $product) {
            $img_id = $product->get_image_id();
            $image  = $img_id ? wp_get_attachment_image_url($img_id, 'thumbnail') : '';

            $formatted[] = [
                'id'        => $product->get_id(),
                'name'      => $product->get_name(),
                'permalink' => $product->get_permalink(),
                'edit_link' => get_edit_post_link($product->get_id(), 'raw'),
                'has_dates' => $product->has_dates(),
                'image'     => $image,
            ];
        }

        return [
            'success' => true,
            'data'    => [
                'products'    => $formatted,
                'total'       => $query->total,
                'page'        => $page,
                'per_page'    => $per_page,
                'total_pages' => $query->max_num_pages,
            ],
            'error'   => null,
        ];
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
            if ($seat_id === '') {
                throw new \Exception(esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite'));
            }

            /** @var Auditorium_Product $product */
            $product   = self::get_auditorium_product_or_throw($product_id);
            $seat_data = $product->get_seat_data($seat_id);

            if (!$seat_data) {
                throw new \Exception(esc_html__('Seat not found in the product seat plan', 'stachethemes-seat-planner-lite'));
            }

            // Validate selected date if provided
            self::assert_product_date_exists($product, $selected_date, esc_html__('Invalid date', 'stachethemes-seat-planner-lite'));

            // Validate status
            if ($status !== '' && !in_array($status, self::ALLOWED_SEAT_STATUSES, true)) {
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
            throw new \Exception(esc_html__('Bulk update manager seat overrides is not supported in the Lite version. Upgrade to Pro to bulk update manager seat overrides.', 'stachethemes-seat-planner-lite'));
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

                // if refunded, skip
                if (Order_Helper::is_item_refunded($order, $item_id)) {
                    continue;
                }

                $seat_discount = $item->get_meta('seat_discount');
                /** @var \WC_Order_Item_Product $item */
                $product_id = $item->get_product_id();
                /** @var Auditorium_Product $product */
                $product = self::get_auditorium_product_or_throw($product_id);

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
     * @param bool                   $send_notifications When true, sends customer notification emails.
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function update_order_item_meta(int $order_id, array $updates, bool $send_notifications = false): array {

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
            $should_update_taken_seats = in_array($order_status, self::TAKEN_ORDER_STATUSES, true);

            // First pass: collect all the seat changes and build a list of seats being released
            // This is needed to allow swapping seats between items in the same order
            $processed_updates    = [];
            $seats_being_released = []; // key: product_id-seat_id-date, value: true

            foreach ($updates as $update) {
                $item_id       = isset($update['item_id']) ? (int) $update['item_id'] : 0;
                $seat_data     = isset($update['seat_data']) ? $update['seat_data'] : null;

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
                /** @var Auditorium_Product $product */
                $product   = self::get_auditorium_product_or_throw($product_id);

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
                                __('Seat ID %s does not exist in the product\'s seat plan.', 'stachethemes-seat-planner-lite'),
                                esc_html($sanitized_seat_data['seatId'])
                            )
                        );
                    }
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


                $item->update_meta_data('seat_data', $sanitized_seat_data);

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

                $seat_price = max(0.0, $seat_price);

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

                // Send customer notification when requested
                if ($send_notifications) {
                    $mailer = WC()->mailer();
                    $emails = $mailer->get_emails();
                    $order_status = $order->get_status();
                    $email_class  = '';

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
                        $customer_email_obj->trigger($order_id, $order);
                    }
                }
            }

            return [
                'success' => true,
                'data'    => [
                    'message'            => esc_html__('Order items updated successfully.', 'stachethemes-seat-planner-lite'),
                    'updated_count'      => $updated_count,
                    'notifications_sent' => ($send_notifications && $updated_count > 0) ? 1 : 0,
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
     * Bulk move bookings from one date to another.
     *
     * Moves all orders (or their seat statuses) for the specified seats from the source date to the target date.
     * Optionally sends notification emails to customers.
     *
     * @param int               $product_id
     * @param array<int, string> $seat_ids
     * @param string            $source_date
     * @param string            $target_date
     * @param bool              $send_notifications
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function bulk_move_bookings_to_date(
        int $product_id,
        array $seat_ids,
        string $source_date,
        string $target_date,
        bool $send_notifications = true
    ): array {

        try {
            throw new \Exception(esc_html__('Bulk move bookings to date is not supported in the Lite version. Upgrade to Pro to bulk move bookings to date.', 'stachethemes-seat-planner-lite'));
        } catch (\Throwable $th) {
            return [
                'success' => false,
                'data'    => null,
                'error'   => $th->getMessage(),
            ];
        }
    }

    /**
     * Bulk create a new order for multiple seats.
     *
     * Creates a single WooCommerce order with multiple line items (one per seat).
     *
     * @param int    $product_id
     * @param array<int, array{seat_id: string, seat_discount?: array{type: string, value: float, name?: string}|null, seat_custom_fields?: array<string, mixed>|null}> $seats_data Array of seat data objects.
     * @param string $selected_date
     * @param string $customer_name
     * @param string $customer_email
     * @param string $customer_phone
     * @param string $order_status
     * @param bool   $send_emails
     *
     * @return array{success: bool, data: array<string, mixed>|null, error: string|null}
     */
    public static function bulk_create_order_for_seats(
        int $product_id,
        array $seats_data,
        string $selected_date,
        string $customer_name,
        string $customer_email,
        string $customer_phone = '',
        string $order_status = 'processing',
        bool $send_emails = true
    ): array {

        try {
            throw new \Exception(esc_html__('Bulk create order for seats is not supported in the Lite version. Upgrade to Pro to bulk create order for seats.', 'stachethemes-seat-planner-lite'));
        } catch (\Throwable $th) {
            // If we created an order but failed later, we should probably void it or at least log it.
            // But for now, just return the error.
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

            /** @var Auditorium_Product $product */
            $product = self::get_auditorium_product_or_throw($product_id);

            // Validate that the seat exists in the product's seat plan
            $seat_data = $product->get_seat_data($seat_id);

            if (!$seat_data) {
                throw new \Exception(esc_html__('Seat not found in the product seat plan', 'stachethemes-seat-planner-lite'));
            }

            // Validate selected date if provided
            self::assert_product_date_exists($product, $selected_date, esc_html__('Invalid date', 'stachethemes-seat-planner-lite'));

            // Check if the seat is already taken
            if ($product->is_seat_taken($seat_id, $selected_date)) {

                // Check if the seat has order
                // We will allow to create a new order if the seat doesn't have an order associated with it
                $order_details = new Bookings_Data($product_id);
                $order_details = $order_details->get_order_details_by_seat_id($seat_id, $selected_date);
                if ($order_details) {
                    throw new \Exception(esc_html__('This seat isder', 'stachethemes-seat-planner-lite'));
                }
            }

            // Check if the email belongs to an existing customer and if so, use the customer ID
            $customer = get_user_by('email', $customer_email);
            if ($customer) {
                $customer_id = $customer->ID;
            } else {
                $customer_id = 0;
            }

            // Validate discount is available for this seat (group check)
            if ($seat_discount && (float) ($seat_discount['value'] ?? 0) > 0) {
                self::validate_discount_for_seat($product, $seat_id, $selected_date, $seat_discount);
            }

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
            } elseif (is_array($seat_custom_fields) && $seat_custom_fields !== []) {
                // Product has no editable custom fields but request sent some: reject.
                throw new \Exception(esc_html__('No seat options are configured for this product', 'stachethemes-seat-planner-lite'));
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
            // Already validated before order creation

            // Get seat price from the seat data
            $seat_price = isset($seat_data->price) ? (float) $seat_data->price : (float) $product->get_price();

            // Apply discount if provided
            $seat_price = Auditorium_Product_Price_Adjustment::apply_discount($seat_price, $seat_discount);
            $seat_price = max(0.0, $seat_price);

            $order_custom_fields = [];
            $editable_custom_fields = $product->get_custom_fields_data(['editable_only' => true]);

            if (!empty($editable_custom_fields)) {
                // Product has custom fields: sanitize values.
                // Validation was performed before order creation.
                $cf_object = (is_array($seat_custom_fields) && $seat_custom_fields !== [])
                    ? (object) $seat_custom_fields
                    : new \stdClass();

                $sanitized_custom_fields = $product->sanitize_custom_fields($cf_object);
                if ($sanitized_custom_fields instanceof \stdClass) {
                    $order_custom_fields = (array) $sanitized_custom_fields;
                    if ($order_custom_fields !== []) {
                        $surcharge = Auditorium_Product_Price_Adjustment::calculate_custom_fields_surcharge($product, $sanitized_custom_fields);
                        $seat_price = max(0.0, $seat_price + $surcharge);
                    }
                }
            }

            // Attach read-only Meta type custom fields (same as add-to-cart flow).
            $meta_fields = $product->get_custom_fields_data(['meta_only' => true]);
            foreach ($meta_fields as $meta_field) {
                /** @var \stdClass $meta_field */
                $label = isset($meta_field->label) ? trim((string) $meta_field->label) : '';
                if ($label !== '' && isset($meta_field->value)) {
                    $order_custom_fields[$label] = $meta_field->value;
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
