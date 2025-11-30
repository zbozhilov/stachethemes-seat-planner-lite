<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Templates {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_action('woocommerce_auditorium_add_to_cart', [__CLASS__, 'insert_single_add_to_cart_template'], 100);
        add_filter('woocommerce_loop_add_to_cart_link', [__CLASS__, 'insert_loop_to_cart_template'], 100, 3);
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

        $is_block_button = (
            is_array($classes) && in_array('wp-block-button__link', $classes, true)
        ) || (
            is_string($classes) && strpos($classes, 'wp-block-button__link') !== false
        );

        $context = $is_block_button ? 'loop_block' : 'loop';    
        
        ob_start();
        do_action('stachesepl_before_select_seat_button', $product, $context);
        $before_link_html = ob_get_clean();

        ob_start();
        do_action('stachesepl_after_select_seat_button', $product, $context);
        $after_link_html = ob_get_clean();

        if ($is_block_button) {
            return $before_link_html . $link . $after_link_html;
        }

        $wrapped_link = sprintf('<span>%s</span>', $link);
        return $before_link_html . $wrapped_link . $after_link_html;
    }
}


