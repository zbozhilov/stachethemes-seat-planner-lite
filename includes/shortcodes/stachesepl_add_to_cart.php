<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * @param array<string, mixed>|string $atts Shortcode attributes.
 */
function stachesepl_add_to_cart_shortcode(array|string $atts): string {

    $atts = shortcode_atts([
        'product_id'    => 0,
        'date'          => '', // Expects Y-m-dTH:i format (e.g. 2026-01-01T10:00)
        'class'         => '', // Class to add to the container
        'p'             => '', // Alias of product_id
        'd'             => '', // Alias of date
        'c'             => '', // Alias of class
    ], is_array($atts) ? $atts : []);

    $atts['product_id'] = $atts['p'] ?: $atts['product_id'];
    $atts['date']       = $atts['d'] ?: $atts['date'];
    $atts['class']      = $atts['c'] ?: $atts['class'];

    $product_id = intval($atts['product_id']);
    $date       = sanitize_text_field($atts['date']);

    if ($product_id <= 0) {
        return '';
    }

    $product = wc_get_product($product_id);

    // test if it is auditorium product
    if (!$product || !$product->is_type('auditorium')) {
        return '';
    }

    /** @var \StachethemesSeatPlannerLite\Auditorium_Product $product */

    ob_start();

    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    echo $product->get_add_to_cart_html('shortcode', [
        'class' => esc_attr($atts['class']),
        'date'  => esc_attr($date)
    ]);

    $content = ob_get_clean();
    return is_string($content) ? $content : '';
}

add_shortcode('stachesepl_add_to_cart', __NAMESPACE__ . '\stachesepl_add_to_cart_shortcode');