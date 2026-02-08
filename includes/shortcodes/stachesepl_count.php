<?php

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Shortcode to count the total number of seats for given product(s).
 * Returns only the number, no markup or styles.
 *
 * @param array<string, mixed>|string $atts Shortcode attributes.
 * @return string The total number of seats.
 */
function stachesepl_count_shortcode(array|string $atts): string {

    $atts = shortcode_atts([
        'product_id'  => '',          // Product ID or list of product IDs separated by commas.
        'date'        => '',          // Date(s) of the seats to count. Format: Y-m-d\TH:i. Separated by commas. Empty = all dates.
        'status'      => 'available,on-site', // Status(es) of the seats to count. Comma-separated. Available values: available, unavailable, sold-out, on-site. Default: available,on-site.
        'class'       => '',          // Class to add to the container
        'wrapper'     => 'span',      // Wrapper element to use. Supported values: span, div, p
        'p'           => '',          // Alias of product_id
        's'           => '',          // Alias of status
        'd'           => '',          // Alias of date
        'c'           => '',          // Alias of class
        'w'           => '',          // Alias of wrapper
    ], (array) $atts);

    $atts['product_id'] = $atts['p'] ?: $atts['product_id'];
    $atts['status']     = $atts['s'] ?: $atts['status'];
    $atts['date']       = $atts['d'] ?: $atts['date'];
    $atts['class']      = $atts['c'] ?: $atts['class'];
    $atts['wrapper']    = $atts['w'] ?: $atts['wrapper'];

    $product_id_array = array_map('intval', explode(',', $atts['product_id']));
    $dates_array      = array_map('sanitize_text_field', explode(',', $atts['date']));
    $valid_statuses   = ['available', 'unavailable', 'sold-out', 'on-site'];
    $filter_statuses  = array_filter(
        array_map('trim', explode(',', $atts['status'])),
        fn(string $s) => in_array($s, $valid_statuses, true)
    );
    if (empty($filter_statuses)) {
        $filter_statuses = ['available'];
    }
    $total = 0;

    foreach ($product_id_array as $pid) {

        $product = wc_get_product($pid);
        /** @var Auditorium_Product $product */
        if (!$product || !$product->is_type('auditorium')) {
            continue;
        }
        foreach ($dates_array as $selected_date) {

            if ($selected_date === '' && $product->has_dates()) {
                $available_dates = $product->get_available_dates();
                if (empty($available_dates)) {
                    continue;
                }
                $selected_date = $available_dates[0];
            }

            $seat_plan_data = Seat_Plan_Data::get_seat_plan_data($product, $selected_date);

            if ($seat_plan_data['success'] === false) {
                continue;
            }

            foreach ($seat_plan_data['data']->objects as $object) {

                if ($object->type !== 'seat') {
                    continue;
                }

                $seat_status = isset($object->status) && $object->status !== '' ? $object->status : 'available';

                if (!in_array($seat_status, $filter_statuses, true)) {
                    continue;
                }

                $total++;
            }
        }
    }

    if (!in_array($atts['wrapper'], ['span', 'div', 'p'], true)) {
        $atts['wrapper'] = 'span';
    }

    return sprintf(
        '<%s class="%s">%d</%s>',
        esc_html($atts['wrapper']),
        esc_attr(
            implode(' ', array_filter([
                'stachesepl-count',
                $atts['class'],
            ]))
        ),
        (int) $total,
        esc_html($atts['wrapper'])
    );
}

add_shortcode('stachesepl_count', __NAMESPACE__ . '\stachesepl_count_shortcode');
