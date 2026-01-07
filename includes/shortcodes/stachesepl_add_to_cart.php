<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

function stachesepl_add_to_cart_shortcode($atts) {

    $atts = shortcode_atts(array(
        'product_id' => 0
    ), $atts);

    $product_id = intval($atts['product_id']);

    if ($product_id <= 0) {
        return '';
    }

    /** @var \Stachethemes\SeatPlanner\Auditorium_Product $product */
    $product = wc_get_product($product_id);

    // test if it is auditorium product
    if (!$product || !$product->is_type('auditorium')) {
        return '';
    }

    ob_start();

    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    echo $product->get_add_to_cart_html('shortcode');

    return ob_get_clean();
}

add_shortcode('stachesepl_add_to_cart', '\Stachethemes\SeatPlannerLite\stachesepl_add_to_cart_shortcode');