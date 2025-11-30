<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

/** 
 * Appends dates selector to the "Select Seat" button
 */
class Auditorium_Product_Select_Seat_Dates {

    private static $did_init = false;

    public static function init() {
        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_action('stachesepl_before_select_seat_button', [__CLASS__, 'before_select_seat_button'], 10, 2);
        add_action('stachesepl_after_select_seat_button', [__CLASS__, 'after_select_seat_button'], 10, 2);
    }

    public static function get_formatted_date($date) {
        $dt_format = get_option('date_format') . ' ' . get_option('time_format');
        return date_i18n($dt_format, strtotime($date));
    }

    public static function before_select_seat_button($product, $context) {

        $availableDates = $product->get_available_dates();

        // Note: This div wraps the Select Seat button as well so getDateSelector() can target the input using `.closest()` in JS
        printf('<div class="stachesepl-product-actions %s">', esc_attr('stachesepl-product-actions-' . $context ?: 'default'));

        if (false === $availableDates) {
            return;
        }


        if (count($availableDates) === 1) {
            printf('<input class="stachesepl-date-selector-input" type="hidden" value="%s">', esc_attr($availableDates[0]));
        } else {
            echo '      <label class="stachesepl-product-select-date-label">';
            echo '          <span class="stachesepl-product-select-date-label-text">' . esc_html__('Choose a date', 'stachethemes-seat-planner-lite')
 . '</span>';
            echo '          <select class="stachesepl-date-selector-input" name="stachesepl_date_selector_input">';
            foreach ($availableDates as $date) {
                // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                echo '      <option value="' . esc_attr($date) . '">' . self::get_formatted_date($date) . '</option>';
            }
            echo '          </select>';
            echo '      </label>';
        }
    }

    public static function after_select_seat_button($product, $context) {
        echo '</div>';
    }
}
