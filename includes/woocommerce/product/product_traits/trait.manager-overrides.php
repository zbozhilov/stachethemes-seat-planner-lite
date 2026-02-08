<?php

namespace StachethemesSeatPlannerLite\Product_Traits;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Trait for handling manager overrides
 * Allows managers to override seat availability and status
 */
trait Manager_Overrides {

    /**
     * Cache for manager overrides
     * 
     * @var array
     */
    protected $manager_overrides = [];

    /**
     * Get manager overrides for a selected date
     * 
     * Expect array structure: 
     * Array
     * (
     *      // override- is prefixed to ensure the key is a string
     *      ['override-' . $seat_id] => [
     *          'status' => 'available' | 'unavailable' | 'sold-out' | 'on-site'
     *      ]
     *      ...
     * )
     * 
     * @param string $selected_date
     * @return array|null
     */
    public function get_manager_overrides($selected_date = '') {
        
        if (isset($this->manager_overrides[$selected_date])) {
            return $this->manager_overrides[$selected_date];
        }

        $meta_key = '_stachesepl_manager_overrides';
        
        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $overrides = $this->get_meta($meta_key, true);

        if (!is_array($this->manager_overrides)) {
            $this->manager_overrides = [];
        }

        // Cache the result before returning
        $this->manager_overrides[$selected_date] = $overrides;
        
        return $overrides;
    }

    /**
     * Get manager seat overrides for a specific seat
     * 
     * @param string $seat_id
     * @param string $selected_date
     * @return array|null
     */
    public function get_manager_seat_overrides($seat_id, $selected_date = '') {
        $overrides = $this->get_manager_overrides($selected_date);
        if (!is_array($overrides)) {
            $overrides = [];
        }
        return $overrides['override-' . $seat_id] ?? null;
    }

    /**
     * Get a specific manager seat override value
     * 
     * @param string $seat_id
     * @param string $key
     * @param string $selected_date
     * @return mixed
     */
    public function get_manager_seat_override($seat_id, $key, $selected_date = '') {
        $overrides = $this->get_manager_overrides($selected_date);
        if (!is_array($overrides)) {
            $overrides = [];
        }
        return $overrides['override-' . $seat_id][$key] ?? null;
    }

    /**
     * Update a seat override. Used by the Manager
     * 
     * @param string $seat_id
     * @param array $override_data
     * @param string $selected_date
     * @return void
     */
    public function update_manager_seat_override($seat_id, $override_data = [], $selected_date = '') {

        if (empty($override_data)) {
            $this->delete_manager_seat_override($seat_id, $selected_date);
            return;
        }

        $current_overrides = $this->get_manager_overrides($selected_date);
        if (!is_array($current_overrides)) {
            $current_overrides = [];
        }

        $current_overrides['override-' . $seat_id] = $override_data;
        $this->set_manager_overrides($selected_date, $current_overrides);
        $this->manager_overrides = []; // reset cache
    }

    /**
     * Delete a seat override. Used by the Manager
     * 
     * @param string $seat_id
     * @param string $selected_date
     * @return void
     */
    public function delete_manager_seat_override($seat_id, $selected_date = '') {
        $current_overrides = $this->get_manager_overrides($selected_date);
        if (!is_array($current_overrides)) {
            $current_overrides = [];
        }

        unset($current_overrides['override-' . $seat_id]);
        $this->set_manager_overrides($selected_date, $current_overrides);
        $this->manager_overrides = []; // reset cache
    }

    /**
     * Set the manager overrides. Used by the Manager
     * 
     * @param string $selected_date
     * @param array $overrides
     * @return void
     * @throws \Exception If override data structure is invalid
     */
    public function set_manager_overrides($selected_date = '', $overrides = []) {

        $meta_key = '_stachesepl_manager_overrides';
        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        // Validate overrides structure
        if (!is_array($overrides)) {
            throw new \Exception(esc_html__('Manager overrides must be an array', 'stachethemes-seat-planner-lite'));
        }

        // Allowed status values
        $allowed_statuses = ['available', 'unavailable', 'sold-out', 'on-site'];

        // Validate each override entry
        $validated_overrides = [];
        foreach ($overrides as $key => $override_data) {
            if (!is_array($override_data)) {
                // Skip invalid entries (non-array override data)
                continue;
            }

            // Validate status if present
            if (isset($override_data['status'])) {
                if (!in_array($override_data['status'], $allowed_statuses, true)) {
                    throw new \Exception(
                        sprintf(
                            // translators: %1$s - invalid status value, %2$s - allowed values
                            esc_html__('Invalid override status "%1$s". Allowed values: %2$s', 'stachethemes-seat-planner-lite'),
                            esc_html($override_data['status']),
                            esc_html(implode(', ', $allowed_statuses))
                        )
                    );
                }
            }

            // Store validated override (allows for future extension with other keys)
            $validated_overrides[$key] = $override_data;
        }

        $this->update_meta_data($meta_key, $validated_overrides);
        $this->save_meta_data();
        $this->manager_overrides = []; // reset cache
    }

    /**
     * Get all meta keys for manager overrides (including date-specific ones)
     * 
     * @return array List of meta keys
     */
    public function get_manager_override_meta_keys() {
        $meta_keys = $this->get_meta_data();
        $override_keys = [];

        foreach ($meta_keys as $meta_key) {
            $key = $meta_key->key;

            if (strpos($key, '_stachesepl_manager_overrides') === 0) {
                $override_keys[] = $key;
            }
        }

        return $override_keys;
    }

    /**
     * Cleanup manager overrides for seats that no longer exist in the seat plan.
     * Should be called after saving the seat plan data.
     * 
     * @param array $valid_seat_ids Array of seat IDs that exist in the current seat plan
     * @return void
     */
    public function cleanup_stale_manager_overrides(array $valid_seat_ids) {
        $override_meta_keys = $this->get_manager_override_meta_keys();

        if (empty($override_meta_keys)) {
            return;
        }

        $has_any_changes = false;
        $dates_data = $this->get_dates_data();
        $base_meta_key   = '_stachesepl_manager_overrides';

        foreach ($override_meta_keys as $meta_key) {

            // 1) Remove overrides for dates that no longer exist
            if ($meta_key !== $base_meta_key && strpos($meta_key, $base_meta_key . '_') === 0) {
                $date_suffix = substr($meta_key, strlen($base_meta_key) + 1);

                // If this date is no longer part of the product dates, drop the whole override entry
                if (!in_array($date_suffix, $dates_data, true)) {
                    $this->delete_meta_data($meta_key);
                    $has_any_changes = true;
                    continue;
                }
            }

            $overrides = $this->get_meta($meta_key, true);

            if (!is_array($overrides) || empty($overrides)) {
                continue;
            }

            $cleaned_overrides = [];
            $has_changes = false;

            foreach ($overrides as $key => $value) {
                // Extract seat ID from the key (format: 'override-{seatId}')
                if (strpos($key, 'override-') !== 0) {
                    // Keep non-override keys as-is (future-proofing)
                    $cleaned_overrides[$key] = $value;
                    continue;
                }

                $seat_id = substr($key, strlen('override-'));

                if (in_array($seat_id, $valid_seat_ids, true)) {
                    // Seat still exists, keep the override
                    $cleaned_overrides[$key] = $value;
                } else {
                    // Seat no longer exists, skip it (don't add to cleaned overrides)
                    $has_changes = true;
                }
            }

            if ($has_changes) {
                $this->update_meta_data($meta_key, $cleaned_overrides);
                $has_any_changes = true;
            }
        }

        if ($has_any_changes) {
            $this->save_meta_data();
        }
    }

    /**
     * Apply seat object overrides
     * 
     * @param \stdClass $seat_object
     * @param string $selected_date
     * @return object
     */
    public function apply_seat_object_overrides($seat_object, $selected_date = '') {
        
        $manager_override_seat_status = $this->get_manager_seat_override($seat_object->seatId, 'status', $selected_date);
     
        if ($manager_override_seat_status) {
            $seat_object->status = $manager_override_seat_status;
        }

        return $seat_object;
    }
}
