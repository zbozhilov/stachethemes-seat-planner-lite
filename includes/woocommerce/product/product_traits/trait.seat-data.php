<?php

namespace StachethemesSeatPlannerLite\Product_Traits;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Trait for handling seat data operations
 */
trait Seat_Data {

    /**
     * Get seat data for a specific seat
     * 
     * @param string $seat_id
     * @param string $context
     * @param string $modifier
     * @param string $selected_date
     * @return object|false
     */
    public function get_seat_data($seat_id, $context = '', $modifier = '', $selected_date = '') {

        $seat_data = $this->get_seat_plan_data('object');
        $objects   = $seat_data->objects;

        if (!is_array($objects) || empty($objects)) {
            return false;
        }

        foreach ($objects as $object) {

            if ($object->type !== 'seat') {
                continue;
            }

            if ($object->seatId === $seat_id) {

                if ($modifier === 'apply_seat_object_overrides') {
                    // $selected date is needed to apply the overrides properly
                    $object = $this->apply_seat_object_overrides($object, $selected_date);
                }

                if ($context === 'add_to_cart') {
                    // Filters out unnecessary keys from the seat data for the add to cart context
                    $keys_to_include       = ['id', 'seatId', 'group', 'price', 'status'];
                    $extra_keys_to_include = apply_filters('stachesepl_context_add_to_cart_keys', []);

                    if (is_array($extra_keys_to_include) && !empty($extra_keys_to_include)) {
                        $keys_to_include = array_merge($keys_to_include, $extra_keys_to_include);
                    }

                    $object = (object) array_intersect_key((array) $object, array_flip($keys_to_include));
                    return $object;
                }

                return $object;
            }
        }

        return false;
    }

    /**
     * Get seat price
     * 
     * @param string $seat_id
     * @return float
     */
    public function get_seat_price($seat_id) {

        $seat_data = $this->get_seat_data($seat_id);

        if (!$seat_data) {
            return 0;
        }

        /** @var \stdClass $seat_data */
        return (float) ($seat_data->price ?? 0);
    }

    /**
     * Get seat status
     * Retrieves the seat status from the seat data and 
     * optionally applies the seat object overrides
     * 
     * It does not take into account if the seat is sold or not
     * If you need to check if the seat is sold, use it along with is_seat_taken() method!
     * 
     * @param string $seat_id
     * @param string $modifier ( apply_seat_object_overrides )
     * @param string $selected_date
     * @return string|false
     */
    public function get_seat_status($seat_id, $modifier = '', $selected_date = '') {

        $seat_data = $this->get_seat_data($seat_id, '', $modifier, $selected_date);

        if (!$seat_data) {
            return false;
        }

        $status = isset($seat_data->status) ? $seat_data->status : '';

        return $status;
    }
}
