<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Auditorium_Product extends \WC_Product {

    public function get_type() {
        return 'auditorium';
    }

    public function __construct($product) {
        parent::__construct($product);
    }

    public function is_sold_individually() {
        return true;
    }

    public function is_purchasable() {

        $condition = $this->exists() && ('publish' === $this->get_status() || current_user_can('edit_post', $this->get_id()));

        return apply_filters('woocommerce_is_purchasable', $condition, $this);
    }

    public function managing_stock() {
        return false;
    }

    public function backorders_allowed() {
        return false;
    }

    public function has_stop_date_passed() {

        $stop_date = $this->get_meta('_stachesepl_stop_date', true); // datetime-local value

        if (! $stop_date) {
            return false;
        }

        $server_timezone = new \DateTimeZone(date_default_timezone_get());

        $stop_date_object = \DateTime::createFromFormat('Y-m-d\TH:i', $stop_date, $server_timezone);

        if (! $stop_date_object) {
            return false;
        }

        $now = new \DateTime('now', $server_timezone);

        return $now >= $stop_date_object;
    }

    public function is_cut_off_time_passed(string $selected_date = ''): bool {
        return false;
    }

    public function is_in_stock() {

        $is_forced_out_of_stock = 'yes' === $this->get_meta('_stachesepl_force_out_of_stock', true);

        if ($is_forced_out_of_stock) {
            return false;
        }

        if ($this->has_stop_date_passed()) {
            return false;
        }

        if (!$this->has_dates()) {
            $available_seats = $this->get_available_seats();
            if (empty($available_seats)) {
                return false;
            }
        }

        return true;
    }

    public function is_virtual() {
        return true;
    }

    public function set_virtual($virtual) {
        $this->set_prop('virtual', true);
    }

    public function get_virtual($context = 'view') {
        return true;
    }

    public function get_stock_quantity($context = 'view') {
        return 0;
    }

    public function get_price_html($context = 'view') {

        $min = (float) $this->get_meta('_stachesepl_price_min', true);
        $max = (float) $this->get_meta('_stachesepl_price_max', true);

        if ($min === $max) {

            if (! $min) {
                return esc_html__('Free', 'stachethemes-seat-planner-lite');
            }

            return wc_price($min);
        }


        return wc_price($min) . ' - ' . wc_price($max);
    }

    public function get_price($context = 'view') {
        return parent::get_price($context) ?: 0;
    }

    public function add_to_cart_description() {
        /* translators: %s: product name */
        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Add to cart: &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite') : esc_html__('Read more about &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_add_to_cart_description', sprintf($text, $this->get_name()), $this);
    }

    public function add_to_cart_url() {
        return apply_filters('woocommerce_product_add_to_cart_url', $this->get_permalink(), $this);
    }

    public function add_to_cart_text() {
        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Select Seat', 'stachethemes-seat-planner-lite') : esc_html__('Read more', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_add_to_cart_text', $text, $this);
    }

    public function single_add_to_cart_text() {
        $text = esc_html__('Select Seat', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_single_add_to_cart_text', $text, $this);
    }

    public function get_seat_plan_data($context = 'raw') {

        $data = $this->get_meta('_stachesepl_seat_planner_data', true);

        switch ($context) {

            case 'object': {

                    if (!$data) {

                        return [
                            'workflowProps' => [],
                            'objects'       => []
                        ];
                    }

                    return json_decode($data);
                }

            default: {
                    return $data;
                }
        }
    }

    public function get_seat_data($seat_id, $context = '') {

        $seat_data = $this->get_seat_plan_data('object');

        $objects = $seat_data->objects;

        if (!is_array($objects) || empty($objects)) {
            return false;
        }

        foreach ($objects as $object) {

            if ($object->type !== 'seat') {
                continue;
            }

            if ($object->seatId === $seat_id) {

                if ($context === 'add_to_cart') {
                    // Filters out unnecessary keys from the seat data for the add to cart context
                    $keys_to_include       = ['id', 'seatId', 'group', 'price'];
                    $extra_keys_to_include = apply_filters('stachesepl_context_add_to_cart_keys', []);

                    if (is_array($extra_keys_to_include) && !empty($extra_keys_to_include)) {
                        $keys_to_include = array_merge($keys_to_include, $extra_keys_to_include);
                    }

                    $object = (object) array_intersect_key((array) $object, array_flip($keys_to_include));
                    return $object;
                }

                return $object;
            }
        }

        return false;
    }

    public function is_seat_taken($seat_id, $selected_date = '') {

        $taken_seats_args = [];

        if ($selected_date) {
            $taken_seats_args['selected_date'] = $selected_date;
        }

        $taken_seats = $this->get_taken_seats($taken_seats_args);

        return in_array($seat_id, $taken_seats);
    }

    public function get_available_seats($selected_date = '') {

        $seat_data = $this->get_seat_plan_data('object');

        if (!$seat_data || !isset($seat_data->objects)) {
            return false;
        }

        // First check the cut-off time
        if ($this->is_cut_off_time_passed($selected_date)) {
            return false;
        }

        // Filter out objects that are not seats or don't have a seat ID or has seat status 'unavailable' or 'sold-out'
        $seats = array_filter($seat_data->objects, function ($object) {
            return $object->type === 'seat' &&
                !empty($object->seatId) &&
                (!isset($object->status) || $object->status !== 'unavailable' && $object->status !== 'sold-out');
        });

        // Retrieve open seats IDs by default as defined in the seat plan editor
        $open_seat_ids_by_default = array_column($seats, 'seatId');

        // Retrieve taken seats for the selected date
        $taken_seats              = $this->get_taken_seats(['selected_date' => $selected_date]);

        // Remove taken seats from open seats by default
        $available_seats          = array_diff($open_seat_ids_by_default, $taken_seats);

        // Return available for selection seats IDs
        return $available_seats;
    }

    public function add_to_cart($seat_id, $discount = '', $selected_date = '', $customFields = null) {

        if ($this->is_seat_taken($seat_id, $selected_date)) {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s is already taken', 'stachethemes-seat-planner-lite'), esc_html($seat_id)));
        }

        $seat_data = $this->get_seat_data($seat_id, 'add_to_cart');

        $seat_status = isset($seat_data->status) ? $seat_data->status : '';

        if ($seat_status === 'unavailable') {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s is unavailable', 'stachethemes-seat-planner-lite'), esc_html($seat_id)));
        }

        if ($seat_status === 'on-site') {
            // translators: %s: seat id
            throw new \Exception(sprintf(esc_html__('Seat %s can only be purchased at the venue.', 'stachethemes-seat-planner-lite'), esc_html($seat_id)));
        }

        if (!$seat_data) {
            throw new \Exception(esc_html__('Seat not found', 'stachethemes-seat-planner-lite'));
        }

        $validation_result = $this->validate_custom_fields($customFields);

        if (is_array($validation_result) && isset($validation_result['error'])) {
            throw new \Exception(esc_html($validation_result['error']));
        }

        $sanitized_custom_fields = $this->sanitize_custom_fields($customFields);

        if (is_array($sanitized_custom_fields) && isset($sanitized_custom_fields['error'])) {
            throw new \Exception(esc_html($sanitized_custom_fields['error']));
        }

        $cart = WC()->cart;

        foreach ($cart->get_cart() as $cart_item) {

            $cart_item_selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';

            if (
                isset($cart_item['seat_data']) &&
                $cart_item['seat_data']->seatId === $seat_id &&
                $cart_item_selected_date  === $selected_date
            ) {
                $cart->remove_cart_item($cart_item['key']);
            }
        }

        $cart_item_key = $cart->generate_cart_id($this->get_id());

        $cart_item_data = [
            'seat_data'          => $seat_data,
            'seat_discount'      => $this->get_discount_by_name($discount),
            'selected_date'      => $selected_date,
            'seat_custom_fields' => $sanitized_custom_fields
        ];

        // Check if transient exists for this seat and throw an exception if it does
        apply_filters('stachesepl_before_add_to_cart', $this, $seat_id, $selected_date);

        $cart_item_key = $cart->add_to_cart($this->get_id(), 1, 0, [], $cart_item_data, $cart_item_key);

        // Insert transient to reserve the seat temporarily
        apply_filters('stachesepl_after_add_to_cart', $this, $seat_id, $cart_item_key, $cart, $selected_date);

        return $cart_item_key;
    }

    public function get_taken_seats($args = []): array {

        $default_args = [
            'selected_date' => ''
        ];

        $args          = wp_parse_args($args, $default_args);
        $taken_seats   = $this->get_meta_taken_seat($args['selected_date']);

        if (!$taken_seats) {
            $taken_seats = [];
        }

        // Extract seat IDs from metadata if they are WC_Meta_Data objects
        $seat_ids = array_map(function ($seat) {
            if (is_a($seat, 'WC_Meta_Data')) {
                return $seat->value;
            }
            return $seat;
        }, $taken_seats);

        // Applying filter so that Slot Reservation class can add its own reserved seats to the list
        $taken_seats = array_unique(apply_filters('stachesepl_get_taken_seats', $seat_ids, $this, $args['selected_date']));

        // Retrieve seat plan data
        $seat_plan = $this->get_seat_plan_data('object');

        // Filter out seats that are not present in the seat plan
        // In situations where the seat plan has been updated after the product was created
        if ($seat_plan && isset($seat_plan->objects)) {
            $seat_plan_seats = array_filter(
                $seat_plan->objects,
                function ($object) {
                    return $object->type === 'seat' && !empty($object->seatId);
                }
            );

            $valid_seat_ids = array_column($seat_plan_seats, 'seatId');
            $taken_seats = array_values(array_intersect($taken_seats, $valid_seat_ids));
        }

        return $taken_seats;
    }

    public function get_seat_price($seat_id) {

        $seat_data = $this->get_seat_data($seat_id);

        if (!$seat_data) {
            return 0;
        }

        return (float) $seat_data->price;
    }

    public function get_dates_data() {
        return [];
    }

    public function date_exists($date) {
        return false;
    }

    /**
     * Checks if the product has any dates or is a no-dates product
     * 
     * @return bool
     * Returns true if the product has any dates
     * Returns false if the product is a no-dates product
     */
    public function has_dates(): bool {
        return false;
    }

    public function get_stop_selling_tickets_before() {
        $value = $this->get_meta('_stachesepl_stop_selling_tickets_before', true);

        return (int) $value;
    }

    /**
     * Returns the available dates for the product
     */
    public function get_available_dates() {
        return false; // Does not have option to Select Dates
    }

    public function get_discounts_data($args = []) {
        return [];
    }

    public function get_custom_fields_data($args = []) {
        return [];
    }

    /**
     * Validates that provided custom fields match admin-defined fields
     * and all required fields are present and non-empty.
     *
     * @param object $custom_fields
     * @return array|null  ['error' => string] on failure, null on success
     */
    public function validate_custom_fields($custom_fields) {
        return null; // valid
    }

    /**
     * Filters/sanitizes provided fields to only include those defined in admin settings.
     *
     * @param object $custom_fields
     * @return stdClass
     */
    public function sanitize_custom_fields($custom_fields) {
        return new \stdClass();
    }

    public function get_discount_by_name($name): array|false {
        return false;
    }

    public function validate_cart_item_discount($cart_item): bool {
        return true;
    }

    public function get_seat_status($seat_id) {

        $seat_data = $this->get_seat_data($seat_id);

        if (!$seat_data) {
            return false;
        }

        return isset($seat_data->status) ? $seat_data->status : '';
    }

    public function get_seats_in_cart($args = []) {

        $default_args = [
            'selected_date' => ''
        ];

        $args = wp_parse_args($args, $default_args);

        $cart = WC()->cart;

        $cart_items = $cart->get_cart();

        $seats_in_cart = [];

        foreach ($cart_items as $cart_item) {

            if (isset($cart_item['seat_data']) && $cart_item['product_id'] === $this->get_id()) {

                $cart_item_selected_date = isset($cart_item['selected_date']) ? $cart_item['selected_date'] : '';

                if (
                    $args['selected_date'] &&
                    $cart_item_selected_date !== $args['selected_date']
                ) {
                    continue;
                }
                $seats_in_cart[] = $cart_item['seat_data']->seatId;
            }
        }

        return $seats_in_cart;
    }

    public function delete_meta_taken_seat($seat_id, $selected_date = '') {
        $meta_key = '_taken_seat';
        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $this->delete_meta_data_value($meta_key, $seat_id);
    }

    /**
     * Add a seat to the taken meta. 
     * If the seat is already taken, it will not be added again.
     * 
     * @param string $seat_id
     * @param string $selected_date
     * @return void
     */
    public function add_meta_taken_seat($seat_id, $selected_date = ''): void {

        $meta_key = '_taken_seat';

        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        // Check if the seat is already taken
        $taken_seats = $this->get_meta_taken_seat($selected_date);
        if (in_array($seat_id, $taken_seats)) {
            return;
        }

        $unique_key = false; // These are multiple keys!

        $this->add_meta_data($meta_key, $seat_id, $unique_key);
    }

    public function get_meta_taken_seat($selected_date = '') {

        $meta_key = '_taken_seat';

        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $taken_seats = $this->get_meta($meta_key, false);

        return $taken_seats;
    }

    public function get_meta_taken_seat_keys() {

        $meta_keys = $this->get_meta_data();
        $taken_seat_keys = [];

        foreach ($meta_keys as $meta_key) {
            $key = $meta_key->key;

            if (strpos($key, '_taken_seat') === 0) {
                $taken_seat_keys[] = $key;
            }
        }

        return $taken_seat_keys;
    }

    public function get_add_to_cart_html($context = 'single') {

        ob_start();

        if (!$this->is_in_stock()) {
        ?>
            <p class="<?php printf('stachesepl-add-to-cart-button-out-of-stock stachesepl-add-to-cart-button-out-of-stock-%s', esc_attr($context)); ?>">
                <?php
                echo esc_html(
                    apply_filters(
                        'stachesepl_add_to_cart_button_out_of_stock_message',
                        __('This product is currently out of stock and unavailable.', 'stachethemes-seat-planner-lite'),
                        $this,
                        $context
                    )
                );
                ?>
            </p>
        <?php
            return ob_get_clean();
        }

        do_action('stachesepl_before_select_seat_button', $this, $context);

        $has_dates        = $this->has_dates() ? 'yes' : 'no';
        $add_to_cart_text = $this->single_add_to_cart_text();
        $product_id       = $this->get_id();

        ?>

        <div class="<?php printf('stachesepl-add-to-cart-button-wrapper stachesepl-add-to-cart-button-wrapper-%s', esc_attr($context)); ?>">
            <?php do_action('woocommerce_before_add_to_cart_button'); ?>
            <div
                class="stachesepl-add-to-cart-button-root"
                data-product-id="<?php echo esc_attr($product_id); ?>"
                data-has-dates="<?php echo esc_attr($has_dates); ?>"
                data-add-to-cart-text="<?php echo esc_attr($add_to_cart_text); ?>">

                <?php if ($has_dates === 'yes') { ?>
                    <div class="stachesepl-date-time-input-placeholder"><span class="stachesepl-date-time-input-placeholder-icon">&nbsp;</span>&nbsp;</div>
                <?php } ?>

                <div class="stachesepl-select-seat-placeholder"><?php echo esc_attr($add_to_cart_text); ?></div>

            </div>
            <?php do_action('woocommerce_after_add_to_cart_button'); ?>
        </div>
<?php

        do_action('stachesepl_after_select_seat_button', $this, $context);

        return ob_get_clean();
    }
}
