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
     * 
     * Expects a data in the following format:
     * Array
     * (
     *     [0] => 2025-11-28T10:00 [1] => 2025-11-29T10:00 [2] 
     * )
     * 
     * @return array
     */
    public function get_dates_data() {
        $data = $this->get_meta('_stachesepl_seat_planner_dates_data', true);

        if (!is_array($data)) {
            return [];
        }

        return $data;
    }

    /**
     * Check if a date exists in the dates data
     * 
     * @param string $date
     * @return bool
     */
    public function date_exists($date) {
        if (! $date) {
            return false;
        }

        $dates = $this->get_dates_data();

        return in_array($date, $dates);
    }

    /**
     * Checks if the product has any dates or is a no-dates product
     * 
     * @return bool
     * Returns true if the product has any dates
     * Returns false if the product is a no-dates product
     */
    public function has_dates(): bool {
        $has_dates_flag = $this->get_meta('_stachesepl_has_dates', true);

        // If not yet set, check if there are any dates and set the flag accordingly
        if ($has_dates_flag !== 'no' && $has_dates_flag !== 'yes') {
            $dates = $this->get_dates_data();
            $has_dates = !empty($dates);
            $this->update_meta_data('_stachesepl_has_dates', $has_dates ? 'yes' : 'no');
            $this->save_meta_data();
            return $has_dates;
        }

        return $has_dates_flag === 'yes';
    }

    /**
     * Get stop selling tickets before minutes
     * 
     * @return int (minutes) or 0 if not set
     */
    public function get_stop_selling_tickets_before() {

        if ($this->meta_exists('_stachesepl_cutoff_time')) {
            $value = $this->get_meta('_stachesepl_cutoff_time', true);
            return (int) $value;
        }

        // Legacy meta key is stored as hours
        // This key is deprecated and will be removed in a future version
        $legacy_value = $this->get_meta('_stachesepl_stop_selling_tickets_before', true);

        if ($legacy_value !== '') {
            return (int) $legacy_value * 60; // convert to minutes
        }

        return 0;
    }

    /**
     * Get discounts data
     * 
     * Expects a data in the following format:
     * Array
     * (
     *     [0] => stdClass Object
     *         (
     *             [group] => string
     *             [name] => string
     *             [type] => percentage | fixed
     *             [value] => float
     *         )
     * )
     * 
     * @param array $args
     * @return array
     */
    public function get_discounts_data($args = []) {
        $default_args = [
            'filter_by_roles' => null // Null means no filtering by roles
        ];

        $args = wp_parse_args($args, $default_args);

        $data = $this->get_meta('_stachesepl_seat_planner_discounts_data', true);

        if (!is_array($data)) {
            return [];
        }

        if ($args['filter_by_roles'] !== null) {
            $data = array_filter($data, function ($discount) use ($args) {

                // If the discount has no role, it's valid. Assumes it is "Any"
                if (empty($discount->role)) {
                    return true;
                }

                return in_array($discount->role, $args['filter_by_roles'], true);
            });
        }

        $data = array_values($data); // Normalize keys [0] [1]...

        return $data;
    }

    /**
     * Get discount by name
     * 
     * @param string $name
     * @return array|false
     */
    public function get_discount_by_name($name): array|false {
        if (empty($name)) {
            return false;
        }

        $discounts = $this->get_discounts_data();

        if (empty($discounts)) {
            return false;
        }

        // Find the discount by name
        $found = array_filter($discounts, function ($discount) use ($name) {
            return isset($discount->name) && $discount->name === $name;
        });

        if (empty($found)) {
            return false;
        }

        // Get the first matching discount
        $discount = reset($found);

        /** @var \stdClass $discount */
        return [
            'group' => $discount->group ?? '',
            'name'  => $discount->name,
            'value' => max(0, (float)$discount->value),
            'type'  => $discount->type,
            'role'  => $discount->role ?? null
        ];
    }

    /**
     * Get custom fields data
     * 
     * @param array $args
     * @return array<object>
     */
    public function get_custom_fields_data($args = []) {
        $default_args = [
            'visible_only'  => false, // front visible only fields
            'editable_only' => false, // excludes meta fields
            'meta_only'     => false // includes read only type Meta fields
        ];

        $args = wp_parse_args($args, $default_args);

        $data = $this->get_meta('_stachesepl_seat_planner_custom_fields_data', true);

        if (!is_array($data) || empty($data)) {
            return [];
        }

        $data = array_filter($data, function ($custom_field) use ($args) {

            $type    = is_object($custom_field) ? ($custom_field->type ?? null) : ($custom_field['type'] ?? null);
            $visible = is_object($custom_field) ? ($custom_field->visible ?? null) : ($custom_field['visible'] ?? null);

            if (true === $args['meta_only'] && $type !== 'meta') {
                return false;
            }

            if (true === $args['visible_only'] && $visible !== true) {
                return false;
            }

            if (true === $args['editable_only'] && $type === 'meta') {
                return false;
            }

            return true;
        });

        $data = array_values($data);

        // Normalize so callers always receive objects (stored data may be array after unserialize).
        $data = array_map(function ($item) {
            return is_object($item) ? $item : (object) $item;
        }, $data);

        return $data;
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
