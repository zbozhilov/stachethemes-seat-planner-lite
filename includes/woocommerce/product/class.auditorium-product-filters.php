<?php

namespace Stachethemes\SeatPlannerLite;

use Automattic\WooCommerce\StoreApi\Exceptions\InvalidCartException;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Filters {

    public static function init() {

        // Checkout/Cart validation
        add_action('woocommerce_check_cart_items', [__CLASS__, 'validate_cart_items'], 10);

        // Order created
        add_action('woocommerce_checkout_order_created', [__CLASS__, 'checkout_order_processed'], 10, 1);
        add_action('woocommerce_store_api_checkout_order_processed', [__CLASS__, 'checkout_order_processed'], 10, 1);

        // Hide any meta data that is not needed to be shown
        add_filter('woocommerce_hidden_order_itemmeta', [__CLASS__, 'hide_order_itemmeta'], 10, 1);

        // Seat meta data
        add_filter('woocommerce_get_item_data', [__CLASS__, 'get_item_data'], 10, 3);
        add_action('woocommerce_checkout_create_order_line_item', array(__CLASS__, 'checkout_create_order_line_item'), 10, 4);

        add_action('woocommerce_after_order_itemmeta', [__CLASS__, 'after_order_itemmeta'], 10, 3);
        add_action('woocommerce_order_item_meta_end', [__CLASS__, 'order_item_meta_end'], 10, 3);

        // Price adjustment
        add_action('woocommerce_before_calculate_totals', [__CLASS__, 'before_calculate_totals'], 10, 1);

        // Order status change hooks
        add_action('woocommerce_order_status_changed', [__CLASS__, 'order_status_changed'], 10, 4);
        add_action('woocommerce_delete_order_items', [__CLASS__, 'before_delete_order_items'], 10);

        // Duplicate exclude meta
        add_filter('woocommerce_duplicate_product_exclude_meta', [__CLASS__, 'duplicate_exclude_meta'], 10, 2);

        // Admin product type
        add_filter('product_type_selector', [__CLASS__, 'register_product_type']);
        add_filter('woocommerce_product_class', [__CLASS__, 'add_custom_product_class'], 10, 2);
        add_filter('woocommerce_product_data_tabs', [__CLASS__, 'add_custom_product_tabs']);
        add_action('woocommerce_product_data_panels', [__CLASS__, 'add_custom_product_tab_content']);

        // Save product
        add_action('woocommerce_process_product_meta_auditorium', [__CLASS__, 'save_custom_fields']);

        // Add to cart templates 
        add_action('woocommerce_auditorium_add_to_cart', [__CLASS__, 'insert_single_add_to_cart_template'], 100);
        add_filter('woocommerce_loop_add_to_cart_link', [__CLASS__, 'insert_loop_to_cart_template'], 100, 3);
    }

    public static function validate_cart_items() {

        $cart = wc()->cart;

        if ($cart->is_empty()) {
            return;
        }

        $cart_items = $cart->get_cart();

        foreach ($cart_items as $cart_item) {

            if (!isset($cart_item['seat_data'])) {
                continue;
            }

            $seat_data  = $cart_item['seat_data'];
            $product_id = $cart_item['product_id'];
            $seat_id    = $seat_data->seatId;
            $product    = new Auditorium_Product($product_id);

            if ($product->is_seat_taken($seat_id)) {

                $error_message = sprintf(
                    // translators: %s: seat id
                    esc_html__(
                        'Seat %s is already taken. Please remove it from your cart and select a different seat.',
                        'stachethemes-seat-planner-lite'
                    ),
                    esc_html($seat_id)
                );

                throw new InvalidCartException(
                    'woocommerce_cart_error',
                    // phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped                  
                    new \WP_Error('woocommerce_cart_error', $error_message),
                    400
                );
            }
        }
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

            // Lets release the seat from reserve transient because the order is finalized
            // This is done because if the order, for some reason is reverted, the transient will still keep the seat reserved
            Slot_Reservation::release_transient($product_id, $seat_id);

        }
    }

    public static function hide_order_itemmeta($exclude_array) {
        return $exclude_array;
    }

    public static function register_product_type($types) {
        $types['auditorium'] = esc_html__('Auditorium Product', 'stachethemes-seat-planner-lite');

        // Place 'auditorium' product as the 3rd element
        $types = array_merge(
            array_slice($types, 0, 2, true),
            ['auditorium' => esc_html__('Auditorium Product', 'stachethemes-seat-planner-lite')],
            array_slice($types, 2, null, true)
        );

        return $types;
    }

    public static function add_custom_product_class($classname, $product_type) {
        if ($product_type === 'auditorium') {
            $classname = 'Stachethemes\\SeatPlannerLite\\Auditorium_Product';
        }

        return $classname;
    }

    public static function add_custom_product_tabs($tabs) {

        $tabs['st_seat_planner_general'] = [
            'label'    => esc_html__('General', 'stachethemes-seat-planner-lite'),
            'target'   => 'st_seat_planner_general_options',
            'class'    => ['show_if_auditorium', 'inventory_options'],
            'priority' => 10,
        ];

        $tabs['st_seat_planner_editor'] = [
            'label'    => esc_html__('Seat Planner', 'stachethemes-seat-planner-lite'),
            'target'   => 'st_seat_planner_editor_options',
            'class'    => ['show_if_auditorium'],
            'priority' => 21,
        ];

        $tabs['st_seat_planner_discounts'] = [
            'label'    => esc_html__('Discounts', 'stachethemes-seat-planner-lite'),
            'target'   => 'st_seat_planner_discounts_options',
            'class'    => ['show_if_auditorium', 'attribute_options'],
            'priority' => 21,
        ];

        $hide_unused = [
            'inventory',
            'shipping',
            'linked_product',
            'attribute',
        ];

        foreach ($hide_unused as $tab) {
            if (isset($tabs[$tab])) {
                $tabs[$tab]['class'][] = 'hide_if_auditorium';
            }
        }

        return $tabs;
    }

    public static function add_custom_product_tab_content() {

        $product = new Auditorium_Product(get_the_ID());

        $seat_planner_data           = $product->get_seat_plan_data();

        ob_start(); ?>

        <div id="st_seat_planner_general_options" class="panel woocommerce_options_panel hidden">

            <?php

            if (wc_product_sku_enabled()) {
                woocommerce_wp_text_input(
                    array(
                        'id'          => '_stmp_sku',
                        'value'       => $product->get_sku('edit'),
                        'label'       => '<abbr title="' . esc_attr__('Stock Keeping Unit', 'stachethemes-seat-planner-lite') . '">' . esc_html__('SKU', 'stachethemes-seat-planner-lite') . '</abbr>',
                        'desc_tip'    => true,
                        'description' => __('SKU refers to a Stock-keeping unit, a unique identifier for each distinct product and service that can be purchased.', 'stachethemes-seat-planner-lite'),
                    )
                );
            }

            do_action('woocommerce_product_options_sku');

            woocommerce_wp_checkbox(
                array(
                    'id'            => '_stsp_force_out_of_stock',
                    'label'         => esc_html__('Out of stock', 'stachethemes-seat-planner-lite'),
                    'value'         => get_post_meta(get_the_ID(), '_stsp_force_out_of_stock', true),
                    'description'   => esc_html__('Set product status to out of stock', 'stachethemes-seat-planner-lite'),
                )
            );

            woocommerce_wp_text_input(
                array(
                    'id'          => '_stsp_stop_date',
                    'label'       => esc_html__('Stop Date', 'stachethemes-seat-planner-lite'),
                    'placeholder' => '',
                    'desc_tip'    => true,
                    'description' => esc_html__('The date ( Server Time ) on which the product will become unavailable.', 'stachethemes-seat-planner-lite'),
                    'type'        => 'datetime-local',
                    'style'       => 'float: left;'
                )
            );

            ?>

        </div>

        <div id="st_seat_planner_editor_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <div id="st-seat-planner-editor"></div>
                <input
                    id="st-seat-planner-editor-data"
                    type="hidden"
                    name="stsp_seat_planner_data"
                    value="<?php echo esc_attr($seat_planner_data); ?>">
            </div>
        </div>

        <div id="st_seat_planner_discounts_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <div id="st-seat-planner-discounts"></div>
            </div>
        </div>

<?php
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo ob_get_clean();
    }

    public static function save_custom_fields($post_id) {

        // Check if nonce is set.
        if (!isset($_POST['woocommerce_meta_nonce']) || !wp_verify_nonce($_POST['woocommerce_meta_nonce'], 'woocommerce_save_data')) {
            return;
        }

        // Save force out of stock
        update_post_meta($post_id, '_stsp_force_out_of_stock', filter_input(INPUT_POST, '_stsp_force_out_of_stock', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

        // Save stop date
        update_post_meta($post_id, '_stsp_stop_date', filter_input(INPUT_POST, '_stsp_stop_date', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

        // Save sku
        update_post_meta($post_id, '_sku', filter_input(INPUT_POST, '_stmp_sku', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

        // Save seat planner data ( if any and is a valid json )
        $seat_planner_data = filter_input(INPUT_POST, 'stsp_seat_planner_data', FILTER_DEFAULT);

        if (!$seat_planner_data) {
            return;
        }

        $is_valid_json = json_decode($seat_planner_data);

        if (!$is_valid_json) {
            return;
        }

        // Save seat planner data
        update_post_meta($post_id, '_stsp_seat_planner_data', $seat_planner_data);

        // Save min and max price ranges for the product based on the seat planner data
        $objects = json_decode($seat_planner_data)->objects;

        $seats = array_filter($objects, function ($object) {
            return $object->type === 'seat';
        });

        $min_max_price = array_reduce($seats, function ($carry, $seat) {

            $price = $seat->price;

            if ($price <= 0) {
                return $carry;
            }

            if ($price < $carry['min']) {
                $carry['min'] = $price;
            }

            if ($price > $carry['max']) {
                $carry['max'] = $price;
            }

            return $carry;
        }, ['min' => INF, 'max' => 0]);

        update_post_meta($post_id, '_stsp_price_min', $min_max_price['min']);
        update_post_meta($post_id, '_stsp_price_max', $min_max_price['max']);
    }

    public static function insert_single_add_to_cart_template() {

        $template_src = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/woocommerce/product/templates/single/single.add-to-cart-template.php';

        include $template_src;
    }

    public static function insert_loop_to_cart_template($link, $product, $args) {

        if ($product->get_type() !== 'auditorium') {
            return $link;
        }

        $classes = isset($args['class']) ? $args['class'] : '';

        // Disable for block buttons since they have own div wrapper that is suitable
        if (strpos($classes, 'wp-block-button__link') !== false) {
            return $link;
        }

        // Span is added for creating of the react root element but it can by any valid tag
        return '<span>' . $link . '</span>';
    }

    public static function before_calculate_totals($cart) {

        if (is_admin() && !defined('DOING_AJAX')) {
            return;
        }

        foreach ($cart->get_cart() as $cart_item) {

            if (isset($cart_item['seat_data'])) {

                $price  = $cart_item['seat_data']->price;

                // Ensure the price is not negative
                $cart_item['data']->set_price(max(0, $price));
            }
        }
    }

    public static function get_item_data($item_data, $cart_item) {

        if (isset($cart_item['seat_data'])) {

            $seat_data = $cart_item['seat_data'];

            $item_data[] = [
                'name'  => esc_html__('Seat ID', 'stachethemes-seat-planner-lite'),
                'value' => sprintf(
                    '%s',
                    esc_html($seat_data->seatId ?? ''),
                ),
            ];
        }



        return $item_data;
    }

    public static function checkout_create_order_line_item($item, $cart_item_key, $values, $order) {

        if (!isset($values['seat_data'])) {
            return;
        }

        $seat_data     = $values['seat_data'];

        $item->update_meta_data('seat_data', $seat_data);
        $order->update_meta_data('has_auditorium_product', true);
    }


    public static function after_order_itemmeta($item_id, $item, $null) {

        $seat_data = $item->get_meta('seat_data');

        if ($seat_data) {
            echo '<div><strong>' . esc_html__('Seat ID', 'stachethemes-seat-planner-lite') . ':</strong> ' . esc_html($seat_data->seatId) . '</div>';
        }

    }

    public static function order_item_meta_end($item_id, $item, $order) {

        $seat_data = $item->get_meta('seat_data');

        if (!$seat_data) {
            return;
        }

        echo '<div><strong>' . esc_html__('Seat ID', 'stachethemes-seat-planner-lite') . ':</strong> ' . esc_html($seat_data->seatId) . '</div>';
      
    }

    public static function order_status_changed($id, $status_transition_from, $status_transition_to, $that) {

        if (!$that->get_meta('has_auditorium_product')) {
            return;
        }

        if ($status_transition_from === $status_transition_to) {
            return;
        }

        $items = $that->get_items();

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

            $insert_status_values = ['completed', 'processing', 'on-hold', 'pending'];
            $delete_status_values = ['cancelled', 'failed', 'refunded'];

            if (in_array($status_transition_to, $insert_status_values)) {

                delete_post_meta($product_id, '_taken_seat', $seat_id);
                add_post_meta($product_id, '_taken_seat', $seat_id);
            } elseif (in_array($status_transition_to, $delete_status_values)) {
                delete_post_meta($product_id, '_taken_seat', $seat_id);
            }
        }
    }

    public static function before_delete_order_items($order_id) {

        $order = wc_get_order($order_id);

        if (!$order || !$order->get_meta('has_auditorium_product')) {
            return;
        }

        $items = $order->get_items();

        foreach ($items as $item) {

            $seat_data = $item->get_meta('seat_data');

            if (!$seat_data) {
                continue;
            }

            if (!method_exists($item, 'get_product_id')) {
                continue;
            }

            $product_id = $item->get_product_id(); // this line is correct
            $seat_id    = $seat_data->seatId;

            if (!$seat_id) {
                continue;
            }

            delete_post_meta($product_id, '_taken_seat', $seat_id);
        }
    }

    public static function duplicate_exclude_meta($exclude_array, $array_map) {

        // When duplicating a product, this will make sure to not copy along the taken seats from the original product
        $exclude_array[] = '_taken_seat';

        return $exclude_array;
    }
}

Auditorium_Product_Filters::init();