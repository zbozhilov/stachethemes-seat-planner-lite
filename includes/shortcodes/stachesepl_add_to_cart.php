<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * @param array<string, mixed>|string $atts Shortcode attributes.
 */
function stachesepl_add_to_cart_shortcode(array|string $atts): string {

    $atts = shortcode_atts(array(
        'product_id'    => 0,
        'date'          => '' // Expects Y-m-dTH:i format (e.g. 2026-01-01T10:00)
    ), is_array($atts) ? $atts : []);

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
        'date' => esc_attr($date)
    ]);

    $content = ob_get_clean();
    return is_string($content) ? $content : '';
}

add_shortcode('stachesepl_add_to_cart', '\StachethemesSeatPlannerLite\stachesepl_add_to_cart_shortcode');