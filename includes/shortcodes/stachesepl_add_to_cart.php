<?php

function stachesepl_add_to_cart_shortcode($atts) {

    $atts = shortcode_atts(array(
        'product_id' => 0
    ), $atts);

    $product_id = intval($atts['product_id']);

    if ($product_id <= 0) {
        return '';
    }

    /** @var \Stachethemes\SeatPlannerLite\Auditorium_Product $product */
    $product = wc_get_product($product_id);

    // test if it is auditorium product
    if ($product->get_type() !== 'auditorium') {
        return '';
    }

    ob_start();

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

    <?php do_action('stachesepl_before_select_seat_button', $product, 'shortcode'); ?>

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

    <?php do_action('stachesepl_after_select_seat_button', $product, 'shortcode'); ?>
    
<?php

    return ob_get_clean();
}

add_shortcode('stachesepl_add_to_cart', 'stachesepl_add_to_cart_shortcode');
