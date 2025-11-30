<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

class Auditorium_Product_Filters {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        $base_dir = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/woocommerce/product/filters/';

        require_once $base_dir . 'class.auditorium-product-order-query.php';
        require_once $base_dir . 'class.auditorium-product-cart-validation.php';
        require_once $base_dir . 'class.auditorium-product-cart-timer.php';
        require_once $base_dir . 'class.auditorium-product-checkout.php';
        require_once $base_dir . 'class.auditorium-product-order-itemmeta.php';
        require_once $base_dir . 'class.auditorium-product-price.php';
        require_once $base_dir . 'class.auditorium-product-order-status.php';
        require_once $base_dir . 'class.auditorium-product-duplicate.php';
        require_once $base_dir . 'class.auditorium-product-admin.php';
        require_once $base_dir . 'class.auditorium-product-templates.php';
        require_once $base_dir . 'class.auditorium-product-shop-order.php';
        require_once $base_dir . 'class.auditorium-product-select-seat-dates.php';

        Auditorium_Product_Order_Query_Filters::init();
        Auditorium_Product_Cart_Validation::init();
        Auditorium_Product_Cart_Timer::init();
        Auditorium_Product_Checkout::init();
        Auditorium_Product_Order_Itemmeta::init();
        Auditorium_Product_Price_Adjustment::init();
        Auditorium_Product_Order_Status::init();
        Auditorium_Product_Duplicate::init();
        Auditorium_Product_Admin::init();
        Auditorium_Product_Templates::init();
        Auditorium_Product_Shop_Order_Admin::init();
        Auditorium_Product_Select_Seat_Dates::init();
    }
}

Auditorium_Product_Filters::init();


