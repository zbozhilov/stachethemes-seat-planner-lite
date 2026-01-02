<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

global $product;

// @see ref wc templates/single-product/add-to-cart/variation-add-to-cart-button.php

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
echo $product->get_add_to_cart_html('single');
?>