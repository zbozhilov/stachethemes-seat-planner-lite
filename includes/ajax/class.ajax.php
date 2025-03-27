<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Ajax {

    public static function init() {
        add_action('wp_ajax_seatplanner', array(__CLASS__, 'handle_ajax_requests'));
        add_action('wp_ajax_nopriv_seatplanner', array(__CLASS__, 'handle_ajax_requests'));
    }

    public static function handle_ajax_requests() {

        check_ajax_referer('stachethemes_seat_planner', 'nonce', true);

        $task = isset($_POST['task']) ? sanitize_key(wp_unslash($_POST['task'])) : '';

        $allowed_tasks = ['get_seat_plan_data', 'add_seats_to_cart'];

        if (empty($task) || !in_array($task, $allowed_tasks, true)) {
            wp_send_json_error(['error' => esc_html__('Invalid task', 'stachethemes-seat-planner-lite')]); 
        }

        try {
            switch ($task) {

                case 'get_seat_plan_data': {

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        if (false === $product_id || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]); 
                        }

                        $auditorium_product = new Auditorium_Product($product_id);

                        if (!$auditorium_product->get_id()) {
                            wp_send_json_error(['error' => esc_html__('Product not found', 'stachethemes-seat-planner-lite')]);
                        }

                        $seat_plan_data = $auditorium_product->get_seat_plan_data('object');

                        if (!is_object($seat_plan_data) || !isset($seat_plan_data->objects)) {
                            wp_send_json_error(['error' => esc_html__('Failed to retrieve seat plan data', 'stachethemes-seat-planner-lite')]);
                        }

                        $taken_seats = $auditorium_product->get_taken_seats();

                        if (!is_array($taken_seats)) {
                            wp_send_json_error(['error' => esc_html__('Failed to retrieve taken seats', 'stachethemes-seat-planner-lite')]);
                        }

                        $seat_plan_data->objects = array_map(function ($object) use ($taken_seats) {
                            if ($object->type !== 'seat') {
                                return $object;
                            }
                            $object->taken = isset($object->seatId) ? in_array($object->seatId, $taken_seats) : false;
                            return $object;
                        }, $seat_plan_data->objects);

                        wp_send_json_success($seat_plan_data);

                        break;
                    }

                case 'add_seats_to_cart': {

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        if ($product_id === false || $product_id < 1) {
                            wp_send_json_error(['error' => esc_html__('Invalid product ID', 'stachethemes-seat-planner-lite')]);
                        }

                        $seats_string = isset($_POST['selected_seats']) ? sanitize_text_field(wp_unslash($_POST['selected_seats'])) : '';
                        $seats_object = json_decode($seats_string);

                        if (json_last_error() !== JSON_ERROR_NONE || !is_array($seats_object)) {
                            wp_send_json_error(['error' => esc_html__('Invalid seat data format', 'stachethemes-seat-planner-lite')]);
                        }

                        if (empty($seats_object)) {
                            wp_send_json_error(['error' => esc_html__('No seats selected', 'stachethemes-seat-planner-lite')]);
                        }

                        $auditorium_product = new Auditorium_Product($product_id);

                        foreach ($seats_object as $seat_data) {

                            if (!isset($seat_data->seatId) || !is_string($seat_data->seatId) || '' === $seat_data->seatId) {
                                wp_send_json_error(['error' => esc_html__('Invalid seat ID', 'stachethemes-seat-planner-lite')]);
                            }

                            $seat_id = sanitize_text_field($seat_data->seatId);

                            if (!$auditorium_product->add_to_cart($seat_id)) {
                                wp_send_json_error(['error' => esc_html__('Failed to add seat to cart', 'stachethemes-seat-planner-lite')]);
                            }
                        }

                        ob_start();
                        woocommerce_mini_cart();
                        $mini_cart = ob_get_clean();

                        if (empty($mini_cart)) {
                            wp_send_json_error(['error' => esc_html__('Failed to generate mini cart', 'stachethemes-seat-planner-lite')]);
                        }

                        $cart_fragments = apply_filters(
                            'woocommerce_add_to_cart_fragments',
                            array(
                                'div.widget_shopping_cart_content' => '<div class="widget_shopping_cart_content">' . wp_kses_post($mini_cart) . '</div>',
                            )
                        );

                        wp_send_json_success(
                            [
                                'message'        => esc_html__('Seats added to cart', 'stachethemes-seat-planner-lite'),
                                'cart_fragments' => $cart_fragments
                            ]
                        );

                        break;
                    }
            }
        } catch (\Exception $e) {

            // do not expose getMessage() to the user
            wp_send_json_error(array('error' => esc_html__('Sorry, something went wrong.', 'stachethemes-seat-planner-lite')));
        }

        wp_die(); // Safety net for future changes
    }
}

Ajax::init();
