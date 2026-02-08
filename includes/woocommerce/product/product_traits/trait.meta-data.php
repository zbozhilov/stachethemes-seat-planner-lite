<?php

namespace StachethemesSeatPlannerLite\Product_Traits;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Trait for handling meta data operations
 * Includes legacy meta key support and basic data retrieval
 */
trait Meta_Data {

    /**
     * Get dates data
     * @return array
     */
    public function get_dates_data() {
        return [];
    }

    /**
     * Check if a date exists in the dates data
     * 
     * @param string $date
     * @return bool
     */
    public function date_exists($date) {
        return false;
    }

    /**
     * Checks if the product has any dates or is a no-dates product
     * 
     * @return bool
     * Returns true if the product has any dates
     * Returns false if the product is a no-dates product
     */
    public function has_dates(): bool {
        return false;
    }

    /**
     * Get stop selling tickets before minutes
     * 
     * @return int (minutes) or 0 if not set
     */
    public function get_stop_selling_tickets_before() {
        return 0;
    }

    /**
     * Get discounts data
     */
    public function get_discounts_data($args = []) {
        return [];
    }

    /**
     * Get discount by name
     * 
     * @param string $name
     * @return array|false
     */
    public function get_discount_by_name($name): array|false {
        return false;
    }

    /**
     * Get custom fields data
     * 
     * @param array $args
     * @return array<object>
     */
    public function get_custom_fields_data($args = []) {
        return [];
    }

    /**
     * Get seat plan data
     * 
     * @param string $context 'raw' or 'object'
     * @return mixed
     */
    public function get_seat_plan_data($context = 'raw') {
        $data = $this->get_meta('_stachesepl_seat_planner_data', true);

        switch ($context) {

            case 'object': {

                    if (!$data) {

                        return [
                            'workflowProps' => [],
                            'objects'       => []
                        ];
                    }

                    return json_decode($data);
                }

            default: {
                    return $data;
                }
        }
    }
}
