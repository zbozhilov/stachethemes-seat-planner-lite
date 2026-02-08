<?php

namespace StachethemesSeatPlannerLite\Product_Traits;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Trait for handling seat availability and stock management
 */
trait Seat_Availability {

    /**
     * Check if stop date has passed
     * 
     * @return bool
     */
    public function has_stop_date_passed() {

        $stop_date = $this->get_meta('_stachesepl_stop_date', true);

        if (! $stop_date) {
            return false;
        }

        $server_timezone  = wp_timezone();
        $stop_date_object = \DateTime::createFromFormat('Y-m-d\TH:i', $stop_date, $server_timezone);

        if (! $stop_date_object) {
            return false;
        }

        $now = current_datetime();

        return $now >= $stop_date_object;
    }

    /**
     * Check if cut-off time has passed for a selected date
     * 
     * @param string $selected_date
     * @return bool
     */
    public function is_cut_off_time_passed(string $selected_date = ''): bool {
        return false;
    }

    /**
     * Check if product is in stock
     * 
     * @return bool
     */
    public function is_in_stock() {

        $is_forced_out_of_stock = 'yes' === $this->get_meta('_stachesepl_force_out_of_stock', true);

        if ($is_forced_out_of_stock) {
            return false;
        }

        if ($this->has_stop_date_passed()) {
            return false;
        }

        if (!$this->has_dates()) {
            $available_seats = $this->get_available_seats();
            if (empty($available_seats)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if a seat is taken
     * NOTE: This doesn't take into account the seat manager overrides
     * 
     * @param string $seat_id
     * @param string $selected_date
     * @return bool
     */
    public function is_seat_taken($seat_id, $selected_date = '') {

        $taken_seats_args = [];

        if ($selected_date) {
            $taken_seats_args['selected_date'] = $selected_date;
        }

        $taken_seats = $this->get_taken_seats($taken_seats_args);

        return in_array($seat_id, $taken_seats);
    }

    /**
     * Get available seats for a selected date
     * 
     * @param string $selected_date
     * @return array|false
     */
    public function get_available_seats($selected_date = '') {

        $seat_data = $this->get_seat_plan_data('object');

        if (!$seat_data || !isset($seat_data->objects)) {
            return false;
        }

        // First check the cut-off time
        if ($this->is_cut_off_time_passed($selected_date)) {
            return false;
        }


        // Filter out objects that are not seats or don't have a seat ID or has seat status 'unavailable' or 'sold-out'
        $seats = array_filter($seat_data->objects, function ($object) use ($selected_date) {

            if ($object->type !== 'seat') {
                return false;
            }

            $object = $this->apply_seat_object_overrides($object, $selected_date);

            if (!isset($object->seatId) || empty($object->seatId)) {
                return false;
            }

            $seat_status = isset($object->status) ? $object->status : '';

            if ($seat_status === 'unavailable' || $seat_status === 'sold-out') {
                return false;
            }

            return true;
        });

        // Retrieve open seats IDs by default as defined in the seat plan editor
        $open_seat_ids_by_default = array_column($seats, 'seatId');

        // Retrieve taken seats for the selected date
        $taken_seats              = $this->get_taken_seats(['selected_date' => $selected_date]);

        // Remove taken seats from open seats by default
        $available_seats          = array_diff($open_seat_ids_by_default, $taken_seats);

        // Return available for selection seats IDs
        return $available_seats;
    }

    /**
     * Returns the available dates for the product
     * 
     * @return array|false
     * Returns false if the product does not have option to Select Dates
     * Returns an array of available dates if the product has option to Select Dates
     * The array is in the following format:
     * Array
     * (
     *     [0] => 2025-11-28T10:00 [1] => 2025-11-29T10:00 [2] 
     * )
     */
    public function get_available_dates() {
        $date_now  = current_datetime();
        $dates     = $this->get_dates_data();

        if (empty($dates)) {
            return false; // Does not have option to Select Dates
        }

        // Stores non-expired dates that have available seats
        $available_dates = [];
        $server_timezone = wp_timezone();

        foreach ($dates as $date_string) {
            $date_object = \DateTime::createFromFormat('Y-m-d\TH:i', $date_string, $server_timezone);

            if ($date_object && $date_object > $date_now) {

                $available_seats = $this->get_available_seats($date_string);

                if (empty($available_seats)) {
                    continue;
                }

                $available_dates[] = $date_string;
            } 
        }

        return $available_dates;
    }

    /**
     * Get taken seats
     * Note: This method does not apply seat object overrides
     * 
     * @param array $args
     * @return array
     */
    public function get_taken_seats($args = []): array {

        $default_args = [
            'selected_date' => ''
        ];

        $args          = wp_parse_args($args, $default_args);
        $taken_seats   = $this->get_meta_taken_seat($args['selected_date']);

        if (!$taken_seats) {
            $taken_seats = [];
        }

        // Extract seat IDs from metadata if they are WC_Meta_Data objects
        $seat_ids = array_map(function ($seat) {
            if (is_a($seat, '\WC_Meta_Data') && isset($seat->value)) {
                return $seat->value;
            }
            return $seat;
        }, $taken_seats);

        // Applying filter so that Slot Reservation class can add its own reserved seats to the list
        $taken_seats = array_unique(apply_filters('stachesepl_get_taken_seats', $seat_ids, $this, $args['selected_date']));

        // Retrieve seat plan data
        $seat_plan = $this->get_seat_plan_data('object');

        // Filter out seats that are not present in the seat plan
        // In situations where the seat plan has been updated after the product was created
        if ($seat_plan && isset($seat_plan->objects)) {
            $seat_plan_seats = array_filter(
                $seat_plan->objects,
                function ($object) {
                    return $object->type === 'seat' && !empty($object->seatId);
                }
            );

            $valid_seat_ids = array_column($seat_plan_seats, 'seatId');
            $taken_seats = array_values(array_intersect($taken_seats, $valid_seat_ids));
        }

        return $taken_seats;
    }

    /**
     * Add a seat to the taken meta. 
     * If the seat is already taken, it will not be added again.
     * 
     * @param string $seat_id
     * @param string $selected_date
     * @return void
     */
    public function add_meta_taken_seat($seat_id, $selected_date = ''): void {

        $meta_key = '_taken_seat';

        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        // Check if the seat is already taken
        $taken_seats = $this->get_meta_taken_seat($selected_date);
        if (in_array($seat_id, $taken_seats)) {
            return;
        }

        $unique_key = false; // These are multiple keys!

        $this->add_meta_data($meta_key, $seat_id, $unique_key);
    }

    /**
     * Delete a taken seat from meta
     * 
     * @param string $seat_id
     * @param string $selected_date
     * @return void
     */
    public function delete_meta_taken_seat($seat_id, $selected_date = '') {
        $meta_key = '_taken_seat';
        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $this->delete_meta_data_value($meta_key, $seat_id);
    }

    /**
     * Get taken seats from meta
     * 
     * @param string $selected_date
     * @return array
     */
    public function get_meta_taken_seat($selected_date = '') {

        $meta_key = '_taken_seat';

        if ($selected_date) {
            $meta_key .= "_{$selected_date}";
        }

        $taken_seats = $this->get_meta($meta_key, false);

        return $taken_seats;
    }

    /**
     * Get all meta keys for taken seats
     * 
     * @return array
     */
    public function get_meta_taken_seat_keys() {

        $meta_keys = $this->get_meta_data();
        $taken_seat_keys = [];

        foreach ($meta_keys as $meta_key) {
            $key = $meta_key->key;

            if (strpos($key, '_taken_seat') === 0) {
                $taken_seat_keys[] = $key;
            }
        }

        return $taken_seat_keys;
    }
}
