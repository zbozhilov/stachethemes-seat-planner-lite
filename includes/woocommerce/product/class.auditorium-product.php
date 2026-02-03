<?php

namespace StachethemesSeatPlannerLite;

use StachethemesSeatPlannerLite\Product_Traits\Meta_Data;
use StachethemesSeatPlannerLite\Product_Traits\Manager_Overrides;
use StachethemesSeatPlannerLite\Product_Traits\Seat_Availability;
use StachethemesSeatPlannerLite\Product_Traits\Seat_Data;
use StachethemesSeatPlannerLite\Product_Traits\Custom_Fields;
use StachethemesSeatPlannerLite\Product_Traits\Cart_Operations;
use StachethemesSeatPlannerLite\Product_Traits\WooCommerce_Interface;

if (! defined('ABSPATH')) {
    exit;
}

class Auditorium_Product extends \WC_Product {

    use Meta_Data;
    use Manager_Overrides;
    use Seat_Availability;
    use Seat_Data;
    use Custom_Fields;
    use Cart_Operations;
    use WooCommerce_Interface;

    public function get_type() {
        return 'auditorium';
    }

    public function __construct($product) {
        parent::__construct($product);
    }

    public function is_sold_individually() {
        return true;
    }

    public function is_purchasable() {

        $condition = $this->exists() && ('publish' === $this->get_status() || current_user_can('edit_post', $this->get_id()));

        return apply_filters('woocommerce_is_purchasable', $condition, $this);
    }

    public function managing_stock() {
        return false;
    }

    public function backorders_allowed() {
        return false;
    }


    public function is_virtual() {
        return true;
    }

    public function set_virtual(mixed $virtual): void {
        $this->set_prop('virtual', true);
    }

    public function get_virtual($context = 'view') {
        return true;
    }

    public function get_stock_quantity($context = 'view') {
        return 0;
    }


}
