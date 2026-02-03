<?php

namespace StachethemesSeatPlannerLite;

class Seat_Plan_Data {

    /**
     * Retrieves the front-end seat plan data, seats, discounts, etc... for a given product and date.
     */
    public static function get_seat_plan_data(int $product_id, string $selected_date = '') {

        try {

            if ($product_id < 1) {
                throw new \Exception(esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite'));
            }

            $auditorium_product = wc_get_product($product_id);

            if (!$auditorium_product || $auditorium_product->get_type() !== 'auditorium') {
                throw new \Exception(esc_html__('Product not found', 'stachethemes-seat-planner-lite'));
            }

            /** @var Auditorium_Product $auditorium_product */

            if (!$auditorium_product->get_id()) {
                throw new \Exception(esc_html__('Product not found', 'stachethemes-seat-planner-lite'));
            }

            if ($selected_date) {
                if (!$auditorium_product->date_exists($selected_date)) {
                    throw new \Exception(esc_html__('Invalid date', 'stachethemes-seat-planner-lite'));
                }
            }

            $seat_plan_data = $auditorium_product->get_seat_plan_data('object');

            if (!is_object($seat_plan_data) || !isset($seat_plan_data->objects)) {
                throw new \Exception(esc_html__('Failed to retrieve seat plan data', 'stachethemes-seat-planner-lite'));
            }

            /** @var \stdClass $seat_plan_data */

            // Normalize to stdClass so we can assign discounts, minSeatsPerPurchase, etc.
            $taken_seats_args = [];

            if ($selected_date) {
                $taken_seats_args['selected_date'] = $selected_date;
            }

            $taken_seats = $auditorium_product->get_taken_seats($taken_seats_args);

            $seat_plan_data->objects = array_map(function ($object) use ($taken_seats, $selected_date, $auditorium_product) {
               
                /** @var \stdClass $object */
                if ($object->type !== 'seat') {
                    return $object;
                }

                // Applied Manager Overrides to the seat object
                $object = $auditorium_product->apply_seat_object_overrides($object, $selected_date);
                /** @var \stdClass $object */

                $object->taken =
                    (isset($object->status) && $object->status === 'sold-out')
                    || (isset($object->seatId) && in_array($object->seatId, $taken_seats, true));

                if ($object->taken) {
                    // Enforce sold-out status if the seat is flagged as taken
                    // since taken assumes this seat was already sold to an order
                    $object->status = 'sold-out';
                }

                // Cast seat price to float
                $object->price = (float) $object->price;

                return $object;
            }, $seat_plan_data->objects);

            $current_user_roles = wp_get_current_user()->roles;

            $discounts_data = $auditorium_product->get_discounts_data([
                'filter_by_roles' => $current_user_roles
            ]);

            if (!empty($discounts_data)) {
                $seat_plan_data->discounts = $discounts_data;
            }

            $min_seats_per_purchase = (int) $auditorium_product->get_meta('_stachesepl_min_seats_per_purchase', true);
            $max_seats_per_purchase = (int) $auditorium_product->get_meta('_stachesepl_max_seats_per_purchase', true);

            if ($min_seats_per_purchase) {
                $seat_plan_data->minSeatsPerPurchase = $min_seats_per_purchase;
            }

            if ($max_seats_per_purchase) {
                $seat_plan_data->maxSeatsPerPurchase = $max_seats_per_purchase;
            }

            // Custom fields data 
            // We exclude the Meta type fields because they are read only and not editable
            // They are attached later during the add to cart process via the back-end
            $custom_fields_data = $auditorium_product->get_custom_fields_data([
                'editable_only' => true
            ]);

            if (!empty($custom_fields_data)) {
                $seat_plan_data->customFields = $custom_fields_data;
            }

            return [
                'success' => true,
                'data'    => $seat_plan_data,
            ];
        } catch (\Throwable $th) {

            return [
                'success' => false,
                'error'   => $th->getMessage(),
            ];
        }
    }
}
