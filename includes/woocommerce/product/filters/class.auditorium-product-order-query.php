<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

use Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController;

class Auditorium_Product_Order_Query_Filters {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        if (self::is_hpos_enabled()) {
            add_filter('woocommerce_order_query_args', [__CLASS__, 'handle_order_custom_meta_query_hpos'], 10);
        } else {
            add_filter('woocommerce_order_data_store_cpt_get_orders_query', [__CLASS__, 'handle_order_custom_meta_query'], 10, 2);
        }
    }

    private static function is_hpos_enabled() {
        return wc_get_container()
            ->get(CustomOrdersTableController::class)
            ->custom_orders_table_usage_is_enabled();
    }

    public static function handle_order_custom_meta_query($query, $query_vars) {
        if (!empty($query_vars['auditorium_product_id'])) {
            $value = $query_vars['auditorium_product_id'];
            if (is_array($value)) {
                $value = array_map('esc_attr', $value);
            } else {
                $value = esc_attr($value);
            }
            $query['meta_query'][] = array(
                'key'     => 'auditorium_product_id',
                'value'   => $value,
                'compare' => is_array($value) ? 'IN' : '='
            );
        }

        if (!empty($query_vars['has_auditorium_product'])) {
            $value = esc_attr($query_vars['has_auditorium_product']);
            $query['meta_query'][] = array(
                'key'     => 'has_auditorium_product',
                'value'   => $value,
                'compare' => '='
            );
        }

        return $query;
    }

    public static function handle_order_custom_meta_query_hpos($query_vars) {
        if (!empty($query_vars['auditorium_product_id'])) {
            $value = $query_vars['auditorium_product_id'];
            if (is_array($value)) {
                $value = array_map('esc_attr', $value);
            } else {
                $value = esc_attr($value);
            }
            $query_vars['meta_query'][] = array(
                'key'     => 'auditorium_product_id',
                'value'   => $value,
                'compare' => is_array($value) ? 'IN' : '='
            );
        }

        if (!empty($query_vars['has_auditorium_product'])) {
            $value = esc_attr($query_vars['has_auditorium_product']);
            $query_vars['meta_query'][] = array(
                'key'     => 'has_auditorium_product',
                'value'   => $value,
                'compare' => '='
            );
        }

        return $query_vars;
    }
}


