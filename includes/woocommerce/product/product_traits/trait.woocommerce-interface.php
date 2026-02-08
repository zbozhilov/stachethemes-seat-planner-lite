<?php

namespace StachethemesSeatPlannerLite\Product_Traits;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Trait for WooCommerce product interface methods
 */
trait WooCommerce_Interface {

    /**
     * Get price HTML
     * 
     * @param string $context
     * @return string
     */
    public function get_price_html($context = 'view') {

        $min = (float) $this->get_meta('_stachesepl_price_min', true);
        $max = (float) $this->get_meta('_stachesepl_price_max', true);

        if ($min === $max) {

            if (! $min) {
                return esc_html__('Free', 'stachethemes-seat-planner-lite');
            }

            return wc_price($min);
        }


        return wc_price($min) . ' - ' . wc_price($max);
    }

    /**
     * Get price
     * 
     * @param string $context
     * @return string
     */
    public function get_price($context = 'view') {
        return parent::get_price($context) ?: '0';
    }

    /**
     * Get add to cart description
     * 
     * @return string
     */
    public function add_to_cart_description() {
        /* translators: %s: product name */
        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Add to cart: &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite') : esc_html__('Read more about &ldquo;%s&rdquo;', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_add_to_cart_description', sprintf($text, $this->get_name()), $this);
    }

    /**
     * Get add to cart URL
     * 
     * @return string
     */
    public function add_to_cart_url() {
        return apply_filters('woocommerce_product_add_to_cart_url', $this->get_permalink(), $this);
    }

    /**
     * Get add to cart text
     * 
     * @return string
     */
    public function add_to_cart_text() {
        $text = $this->is_purchasable() && $this->is_in_stock() ? esc_html__('Select Seat', 'stachethemes-seat-planner-lite') : esc_html__('Read more', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_add_to_cart_text', $text, $this);
    }

    /**
     * Get single add to cart text
     * 
     * @return string
     */
    public function single_add_to_cart_text() {
        $text = esc_html__('Select Seat', 'stachethemes-seat-planner-lite');
        return apply_filters('woocommerce_product_single_add_to_cart_text', $text, $this);
    }

    /**
     * Get add to cart HTML
     * 
     * @param string $context
     * @param array $args
     * @return string
     */
    public function get_add_to_cart_html($context = 'single', $args = [
        'class' => '',
        'date'  => '',
    ]) {

        $date                = $args['date'] ?? '';
        $has_dates           = $this->has_dates() ? 'yes' : 'no';
        $add_to_cart_text    = $this->single_add_to_cart_text();
        $product_id          = $this->get_id();
        $force_out_of_stock  = false;

        if ($date) {

            $date_exists          = $this->date_exists($date);
            $date_available_seats = $date_exists ? $this->get_available_seats($date) : [];

            if (empty($date_available_seats)) {
                $force_out_of_stock = true;
            } else {
                $has_dates = 'no'; // Turn off date picker when user predefined a date
            }
        }

        ob_start();

        if ($force_out_of_stock || !$this->is_in_stock()) {
?>
            <p class="<?php
                        echo esc_attr(implode(' ', array_filter([
                            'stachesepl-add-to-cart-button-out-of-stock',
                            'stachesepl-add-to-cart-button-out-of-stock-' . $context,
                            $args['class'] ?? ''
                        ])));
                        ?>">

                <?php
                echo esc_html(
                    apply_filters(
                        'stachesepl_add_to_cart_button_out_of_stock_message',
                        __('This product is currently out of stock and unavailable.', 'stachethemes-seat-planner-lite'),
                        $this,
                        $context
                    )
                );
                ?>
            </p>
        <?php

            /** @var string $output */
            $output = ob_get_clean();
            return $output;
        }

        do_action('stachesepl_before_select_seat_button', $this, $context);

        ?>

        <div class="<?php echo esc_attr(implode(' ', array_filter([
                        'stachesepl-add-to-cart-button-wrapper',
                        'stachesepl-add-to-cart-button-wrapper-' . $context,
                        $args['class'] ?? ''
                    ]))); ?>">
            <?php do_action('woocommerce_before_add_to_cart_button'); ?>
            <div
                class="stachesepl-add-to-cart-button-root"
                data-product-id="<?php echo (int) $product_id; ?>"
                data-date="<?php echo esc_attr($date); ?>"
                data-has-dates="<?php echo esc_attr($has_dates); ?>"
                data-add-to-cart-text="<?php echo esc_attr($add_to_cart_text); ?>">

                <?php if ('yes' === $has_dates) { ?>
                    <div class="stachesepl-date-time-input-placeholder"><span class="stachesepl-date-time-input-placeholder-icon">&nbsp;</span>&nbsp;</div>
                <?php } ?>

                <div class="stachesepl-select-seat-placeholder"><?php echo esc_attr($add_to_cart_text); ?></div>

            </div>
            <?php do_action('woocommerce_after_add_to_cart_button'); ?>
        </div>
<?php

        do_action('stachesepl_after_select_seat_button', $this, $context);

        /** @var string $output */
        $output = ob_get_clean();
        return $output;
    }
}
