<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

global $product;

// @see ref wc templates/single-product/add-to-cart/variation-add-to-cart-button.php

if (!$product->is_in_stock()) {
?>
    <p class="stock out-of-stock">
        <?php echo esc_html(apply_filters('woocommerce_out_of_stock_message', esc_html__('This product is currently out of stock and unavailable.', 'stachethemes-seat-planner-lite')
)); ?>
    </p>
<?php
    return;
}
?>

<?php do_action('stachesepl_before_select_seat_button', $product, 'single'); ?>

<div class="stachesepl-single-add-to-cart-button-wrapper">
    <?php do_action('woocommerce_before_add_to_cart_button'); ?>
    <p>
        <button
            type="button"
            data-product_id="<?php echo esc_attr($product->get_id()); ?>"
            class="product_type_auditorium add_to_cart_button single_add_to_cart_button button alt<?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' ' . wc_wp_theme_get_element_class_name('button') : ''); ?>">
            <?php echo esc_html($product->single_add_to_cart_text()); ?>
        </button>
    </p>
    <?php do_action('woocommerce_after_add_to_cart_button'); ?>
</div>

<?php do_action('stachesepl_after_select_seat_button', $product, 'single'); ?>