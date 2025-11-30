<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

use Automattic\WooCommerce\Enums\ProductTaxStatus;

class Auditorium_Product_Admin {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_filter('product_type_selector', [__CLASS__, 'register_product_type']);
        add_filter('woocommerce_product_class', [__CLASS__, 'add_custom_product_class'], 10, 2);
        add_filter('woocommerce_product_data_tabs', [__CLASS__, 'add_custom_product_tabs']);
        add_action('woocommerce_product_data_panels', [__CLASS__, 'add_custom_product_tab_content']);
        add_action('woocommerce_process_product_meta_auditorium', [__CLASS__, 'save_custom_fields'], 10);
    }

    public static function register_product_type($types) {
        $types['auditorium'] = esc_html__('Auditorium Product', 'stachethemes-seat-planner-lite')
;
        $types = array_merge(
            array_slice($types, 0, 2, true),
            ['auditorium' => esc_html__('Auditorium Product', 'stachethemes-seat-planner-lite')
],
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
            'label'    => esc_html__('General', 'stachethemes-seat-planner-lite')
,
            'target'   => 'st_seat_planner_general_options',
            'class'    => ['show_if_auditorium', 'inventory_options'],
            'priority' => 21,
        ];

        $tabs['st_seat_planner_editor'] = [
            'label'    => esc_html__('Seat Planner', 'stachethemes-seat-planner-lite')
,
            'target'   => 'st_seat_planner_editor_options',
            'class'    => ['show_if_auditorium'],
            'priority' => 21,
        ];

        $tabs['st_seat_planner_dates'] = [
            'label'    => esc_html__('Dates', 'stachethemes-seat-planner-lite')
,
            'target'   => 'st_seat_planner_dates_options',
            'class'    => ['show_if_auditorium'],
            'priority' => 21,
        ];

        $tabs['st_seat_planner_discounts'] = [
            'label'    => esc_html__('Discounts', 'stachethemes-seat-planner-lite')
,
            'target'   => 'st_seat_planner_discounts_options',
            'class'    => ['show_if_auditorium', 'attribute_options'],
            'priority' => 21,
        ];

        $tabs['st_seat_planner_reserved'] = [
            'label'    => esc_html__('In-Cart Seats', 'stachethemes-seat-planner-lite')
,
            'target'   => 'st_seat_planner_reserved_options',
            'class'    => ['show_if_auditorium', 'stachesepl_reserved_options'],
            'priority' => 21,
        ];

        $tabs['st_seat_planner_export_bookings'] = [
            'label'    => esc_html__('Export Bookings', 'stachethemes-seat-planner-lite')
,
            'target'   => 'st_seat_planner_export_bookings_options',
            'class'    => ['show_if_auditorium', 'stachesepl_export_bookings_options'],
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
        $product = wc_get_product(get_the_ID());
        /** @var Auditorium_Product $product */
        $is_auditorium_product = $product && $product->get_type() === 'auditorium';

        $seat_planner_data           = $is_auditorium_product ? $product->get_seat_plan_data() : [];
        $seat_planner_discounts_data = $is_auditorium_product ? $product->get_discounts_data() : [];
        $seat_planner_dates_data     = $is_auditorium_product ? $product->get_dates_data() : [];
        $seat_planner_reserved_seats = Slot_Reservation::get_product_reserved_seats($product);

        ob_start(); ?>

        <div id="st_seat_planner_general_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <?php
                if (wc_product_sku_enabled()) {
                    woocommerce_wp_text_input(
                        [
                            'id'          => '_stachesepl_sku',
                            'value'       => $product->get_sku('edit'),
                            'label'       => '<abbr title="' . esc_attr__('Stock Keeping Unit', 'stachethemes-seat-planner-lite')
 . '">' . esc_html__('SKU', 'stachethemes-seat-planner-lite')
 . '</abbr>',
                            'desc_tip'    => true,
                            'description' => esc_html__('SKU refers to a Stock-keeping unit, a unique identifier for each distinct product and service that can be purchased.', 'stachethemes-seat-planner-lite'),
                        ]
                    );
                }

                do_action('woocommerce_product_options_sku');

                woocommerce_wp_checkbox(
                    [
                        'id'          => '_stachesepl_force_out_of_stock',
                        'label'       => esc_html__('Out of stock', 'stachethemes-seat-planner-lite')
,
                        'value'       => $product->get_meta('_stachesepl_force_out_of_stock', true),
                        'description' => esc_html__('Set product status to out of stock', 'stachethemes-seat-planner-lite')
,
                    ]
                );

                woocommerce_wp_text_input(
                    [
                        'id'          => '_stachesepl_stop_date',
                        'label'       => esc_html__('Stop Date', 'stachethemes-seat-planner-lite')
,
                        'placeholder' => '',
                        'desc_tip'    => true,
                        'description' => esc_html__('The date ( Server Time ) on which the product will become unavailable.', 'stachethemes-seat-planner-lite')
,
                        'type'        => 'datetime-local',
                        'style'       => 'float: left;'
                    ]
                );

                ?>
            </div>

            <div class="options_group">

                <?php
                woocommerce_wp_text_input(
                    [
                        'id'                => '_stachesepl_min_seats_per_purchase',
                        'label'             => esc_html__('Minimum seats per purchase', 'stachethemes-seat-planner-lite')
,
                        'placeholder'       => '',
                        'desc_tip'          => true,
                        'description'       => esc_html__('Require customers to select at least this many seats in a single order. Leave empty or 0 for no minimum.', 'stachethemes-seat-planner-lite')
,
                        'type'              => 'number',
                        'custom_attributes' => [
                            'min'  => '0',
                            'step' => '1',
                        ],
                        'value'             => $product->get_meta('_stachesepl_min_seats_per_purchase', true),
                    ]
                );

                woocommerce_wp_text_input(
                    [
                        'id'                => '_stachesepl_max_seats_per_purchase',
                        'label'             => esc_html__('Maximum seats per purchase', 'stachethemes-seat-planner-lite')
,
                        'placeholder'       => '',
                        'desc_tip'          => true,
                        'description'       => esc_html__('Limit the maximum number of seats a customer can purchase in a single order. Leave empty or 0 for no maximum.', 'stachethemes-seat-planner-lite')
,
                        'type'              => 'number',
                        'custom_attributes' => [
                            'min'  => '0',
                            'step' => '1',
                        ],
                        'value'             => $product->get_meta('_stachesepl_max_seats_per_purchase', true),
                    ]
                );
                ?>
            </div>

            <?php if (wc_tax_enabled()) : ?>
                <div class="options_group">
                    <?php
                    woocommerce_wp_select(
                        array(
                            'id'          => '_tax_status',
                            'value'       => $product->get_tax_status('edit'),
                            'label'       => esc_html__('Tax status', 'stachethemes-seat-planner-lite')
,
                            'options'     => array(
                                ProductTaxStatus::TAXABLE  => esc_html__('Taxable', 'stachethemes-seat-planner-lite')
,
                                ProductTaxStatus::SHIPPING => esc_html__('Shipping only', 'stachethemes-seat-planner-lite')
,
                                ProductTaxStatus::NONE     => esc_html_x('None', 'Tax status', 'stachethemes-seat-planner-lite'),
                            ),
                            'desc_tip'    => 'true',
                            'description' => esc_html__('Define whether or not the entire product is taxable, or just the cost of shipping it.', 'stachethemes-seat-planner-lite'),
                        )
                    );

                    woocommerce_wp_select(
                        array(
                            'id'          => '_tax_class',
                            'value'       => $product->get_tax_class('edit'),
                            'label'       => esc_html__('Tax class', 'stachethemes-seat-planner-lite')
,
                            'options'     => wc_get_product_tax_class_options(),
                            'desc_tip'    => 'true',
                            'description' => esc_html__('Choose a tax class for this product. Tax classes are used to apply different tax rates specific to certain types of product.', 'stachethemes-seat-planner-lite')
,
                        )
                    );

                    do_action('woocommerce_product_options_tax');
                    ?>
                </div>
            <?php endif; ?>
        </div>

        <div id="st_seat_planner_editor_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <div id="stachesepl-seat-planner-editor"></div>
                <input
                    id="stachesepl-seat-planner-editor-data"
                    type="hidden"
                    name="stachesepl_seat_planner_data"
                    value="<?php echo esc_attr($seat_planner_data ?: '[]'); ?>">
            </div>
        </div>

        <div id="st_seat_planner_dates_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <div id="stachesepl-seat-planner-dates"></div>
                <input
                    id="stachesepl-seat-planner-dates-data"
                    type="hidden"
                    name="stachesepl_seat_planner_dates_data"
                    value="<?php echo esc_attr(wp_json_encode($seat_planner_dates_data)); ?>">
            </div>
        </div>

        <div id="st_seat_planner_discounts_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <div id="stachesepl-seat-planner-discounts"></div>
                <input
                    id="stachesepl-seat-planner-discounts-data"
                    type="hidden"
                    name="stachesepl_seat_planner_discounts_data"
                    value="<?php echo esc_attr(wp_json_encode($seat_planner_discounts_data)); ?>">
            </div>
        </div>

        <div id="st_seat_planner_reserved_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <div id="stachesepl-seat-planner-reserved-seats"></div>
                <input
                    id="stachesepl-seat-planner-reserved-seats-data"
                    type="hidden"
                    name="stachesepl_seat_planner_reserved_seats_data"
                    value="<?php echo esc_attr(wp_json_encode($seat_planner_reserved_seats)); ?>">
                <input
                    id="stachesepl-seat-planner-reserved-seats-data-remove"
                    type="hidden"
                    name="stachesepl_seat_planner_reserved_seats_data_remove"
                    value="">
            </div>
        </div>

        <div id="st_seat_planner_export_bookings_options" class="panel woocommerce_options_panel hidden">
            <div class="options_group">
                <input
                    id="stachesepl-export-bookings-product-id"
                    type="hidden"
                    name="stachesepl_export_bookings_product_id"
                    value="<?php echo esc_attr(get_the_ID()); ?>">
                <div id="stachesepl-export-bookings"></div>
            </div>
        </div>

<?php
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo ob_get_clean();
    }

    public static function save_custom_fields($post_id) {
        $nonce_value = isset($_POST['woocommerce_meta_nonce']) ? sanitize_text_field(wp_unslash($_POST['woocommerce_meta_nonce'])) : '';
        if (!wp_verify_nonce($nonce_value, 'woocommerce_save_data')) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $product = wc_get_product($post_id);

        $product->update_meta_data('_stachesepl_force_out_of_stock', filter_input(INPUT_POST, '_stachesepl_force_out_of_stock', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
        $product->update_meta_data('_stachesepl_stop_date', filter_input(INPUT_POST, '_stachesepl_stop_date', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

        $min_seats_per_purchase_raw = filter_input(INPUT_POST, '_stachesepl_min_seats_per_purchase', FILTER_SANITIZE_NUMBER_INT);
        $max_seats_per_purchase_raw = filter_input(INPUT_POST, '_stachesepl_max_seats_per_purchase', FILTER_SANITIZE_NUMBER_INT);

        $min_seats_per_purchase = max(0, (int) $min_seats_per_purchase_raw);
        $max_seats_per_purchase = max(0, (int) $max_seats_per_purchase_raw);

        $adjusted_max_seats = false;
        if ($max_seats_per_purchase > 0 && $min_seats_per_purchase > 0 && $max_seats_per_purchase < $min_seats_per_purchase) {
            $max_seats_per_purchase = $min_seats_per_purchase;
            $adjusted_max_seats = true;
        }

        $product->update_meta_data('_stachesepl_min_seats_per_purchase', $min_seats_per_purchase);
        $product->update_meta_data('_stachesepl_max_seats_per_purchase', $max_seats_per_purchase);

        if ($adjusted_max_seats && is_admin() && class_exists('\WC_Admin_Meta_Boxes')) {
            \WC_Admin_Meta_Boxes::add_error(
                sprintf(
                    // translators: %d: maximum seats per purchase
                    esc_html__('Maximum seats per purchase was less than the minimum and has been set to %d.', 'stachethemes-seat-planner-lite')
,
                    $max_seats_per_purchase
                )
            );
        }

        $product->set_sku(filter_input(INPUT_POST, '_stachesepl_sku', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

        $clear_reserved_seats = isset($_POST['stachesepl_seat_planner_reserved_seats_data_remove']) ? sanitize_text_field(wp_unslash($_POST['stachesepl_seat_planner_reserved_seats_data_remove'])) : '';
        if ($clear_reserved_seats) {
            // Format: timeSlot::seatId||timeSlot::seatId
            $entries = explode('||', $clear_reserved_seats);
            foreach ($entries as $entry) {
                if (empty($entry)) {
                    continue;
                }
                $parts = explode('::', $entry, 2);
                if (count($parts) === 2) {
                    $selected_date = $parts[0];
                    $seat_id = $parts[1];
                    Slot_Reservation::release_transient($post_id, $seat_id, $selected_date);
                }
            }
        }

        $dates_data = isset($_POST['stachesepl_seat_planner_dates_data']) ? sanitize_text_field(wp_unslash($_POST['stachesepl_seat_planner_dates_data'])) : '';
        if ($dates_data) {
            $dates_data_decoded = json_decode($dates_data);
            if (is_array($dates_data_decoded)) {
                // Remove duplicates while preserving array keys
                $dates_data_decoded = array_values(array_unique($dates_data_decoded, SORT_STRING));
                $product->update_meta_data('_stachesepl_seat_planner_dates_data', $dates_data_decoded);
            }
        }

        $discounts_data         = isset($_POST['stachesepl_seat_planner_discounts_data']) ? sanitize_text_field(wp_unslash($_POST['stachesepl_seat_planner_discounts_data'])) : '';
        $discounts_data_decoded = json_decode($discounts_data);

        if (is_array($discounts_data_decoded)) {
            $used_names = [];
            foreach ($discounts_data_decoded as $key => $discount) {
                $discount_name = $discount->name;
                if (isset($used_names[$discount_name])) {
                    $suffix    = 1;
                    $base_name = $discount_name;
                    while (isset($used_names[$base_name . '-' . $suffix])) {
                        $suffix++;
                    }
                    $discount_name = $base_name . '-' . $suffix;
                    $discounts_data_decoded[$key]->name = $discount_name;
                }
                $used_names[$discount_name] = true;
            }
        }

        $product->update_meta_data('_stachesepl_seat_planner_discounts_data', $discounts_data_decoded);

        $seat_planner_data = isset($_POST['stachesepl_seat_planner_data']) ? sanitize_text_field(wp_unslash($_POST['stachesepl_seat_planner_data'])) : '';
        if (!$seat_planner_data) {
            $product->save();
            return;
        }

        $seat_planner_data_decoded = json_decode($seat_planner_data);
        if (!$seat_planner_data_decoded) {
            $product->save();
            return;
        }

        $seat_planner_data_decoded->objects = array_map(function ($object) {
            if (!isset($object->type) || $object->type !== 'seat') {
                return $object;
            }
            $object->label  = trim($object->label);
            $object->seatId = trim($object->seatId);
            $object->group  = trim($object->group);
            $object->price  = trim($object->price);
            return $object;
        }, $seat_planner_data_decoded->objects);

        $product->update_meta_data('_stachesepl_seat_planner_data', wp_json_encode($seat_planner_data_decoded, JSON_UNESCAPED_UNICODE));

        $objects = $seat_planner_data_decoded->objects;
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

        $product->update_meta_data('_stachesepl_price_min', $min_max_price['min']);
        $product->update_meta_data('_stachesepl_price_max', $min_max_price['max']);

        $product->save();
    }
}
