<?php

namespace Stachethemes\SeatPlannerLite;

class Ajax {

    public static function init() {
        add_action('wp_ajax_seatplanner', array(__CLASS__, 'handle_ajax_requests'));
        add_action('wp_ajax_nopriv_seatplanner', array(__CLASS__, 'handle_ajax_requests'));
    }

    public static function handle_ajax_requests() {

        $task = filter_input(INPUT_POST, 'task', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        try {

            switch ($task) {

                case 'get_seat_plan_data': {

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        if (!$product_id) {
                            wp_send_json_error(['error' => esc_html__('Product ID not specified', 'stachethemes-seat-planner-lite')]);
                            return;
                        }

                        $auditorium_product = new Auditorium_Product($product_id);

                        if (!$auditorium_product->get_id()) {
                            wp_send_json_error(['error' => esc_html__('Product not found', 'stachethemes-seat-planner-lite')]);
                            return;
                        }

                        $seat_plan_data = $auditorium_product->get_seat_plan_data('object');
                        $taken_seats = $auditorium_product->get_taken_seats();

                        $seat_plan_data->objects = array_map(function ($object) use ($taken_seats) {

                            if ($object->type !== 'seat') {
                                return $object;
                            }

                            $seat = $object;

                            $seat->taken = in_array($seat->seatId, $taken_seats);

                            return $seat;
                        }, $seat_plan_data->objects);

                        wp_send_json_success($seat_plan_data);

                        break;
                    }

                case 'add_seats_to_cart': {

                        if (!check_ajax_referer('seat_planner_add_to_cart', 'nonce', false)) {
                            wp_send_json_error(['error' => esc_html__('Invalid nonce', 'stachethemes-seat-planner-lite')]);
                            return;
                        }

                        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);

                        if (!$product_id) {
                            wp_send_json_error(['error' => esc_html__('Product ID not specified', 'stachethemes-seat-planner-lite')]);
                            return;
                        }

                        $seats_string = filter_input(INPUT_POST, 'selected_seats', FILTER_UNSAFE_RAW);
                        $seats_object = json_decode($seats_string);

                        if (!$seats_object) {
                            wp_send_json_error(['error' => esc_html__('No seats selected', 'stachethemes-seat-planner-lite')]);
                            return;
                        }

                        $auditorium_product = new Auditorium_Product($product_id);

                        foreach ($seats_object as $seat_data) {

                            $seat_id       = $seat_data->seatId;

                            $auditorium_product->add_to_cart($seat_id);
                        }

                        ob_start();
                        woocommerce_mini_cart();
                        $mini_cart = ob_get_clean();

                        $cart_fragments = apply_filters(
                            'woocommerce_add_to_cart_fragments',
                            array(
                                'div.widget_shopping_cart_content' => '<div class="widget_shopping_cart_content">' . $mini_cart . '</div>',
                            )
                        );

                        wp_send_json_success(
                            [
                                'message'        => esc_html__('Seats added to cart', 'stachethemes-seat-planner-lite'),
                                'cart_fragments' => $cart_fragments
                            ]
                        );
                    }

                default: {
                        throw new \Exception(esc_html__('No action specified', 'stachethemes-seat-planner-lite'));
                    }
            }
        } catch (\Exception $e) {
            wp_send_json_error(array('error' => $e->getMessage()));
        }

        exit;
    }
}

Ajax::init();
