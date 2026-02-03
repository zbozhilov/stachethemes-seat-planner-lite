<?php

namespace StachethemesSeatPlannerLite;

use WC_Product;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Slot Reservation class
 * This class is responsible for reserving seats in the cart for a certain amount of time
 * By default when a customer adds a seat to the cart, it will be reserved for 24 hours
 * If the customer doesn't complete the order in that time, the seat will be available again
 */
class Slot_Reservation {

    private static bool $did_init = false;
    private static int $minimum_reserve_time = 5; // 5 minutes
    private static int $reserve_time = 0;
    private static string $transient_prefix = 'stachesepl_sr_';

    // Bootstrap & settings
    public static function init(): void {

        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init     = true;
        self::$reserve_time = self::get_reserve_time();

        add_action('stachesepl_before_add_to_cart', [__CLASS__, 'verify_seat_not_reserved'], 10, 3);
        add_action('stachesepl_after_add_to_cart', [__CLASS__, 'reserve_seat'], 10, 5);
        add_filter('stachesepl_get_taken_seats', [__CLASS__, 'attach_reserved_seats_to_taken_seats'], 10, 3);
        add_action('woocommerce_remove_cart_item', [__CLASS__, 'maybe_release_transient'], 10, 2);
    }

    public static function get_reserve_time(): int {

        $min_time = self::$minimum_reserve_time;

        return max(
            $min_time,
            (int) apply_filters(
                'stachesepl_reserve_time',
                Settings::get_setting('stachesepl_reserve_time')
            )
        );
    }

    // Public API - validation and cart hooks
    public static function verify_seat_not_reserved(WC_Product $product, string $seat_id, string $selected_date = ''): void {

        if (!$product->is_type('auditorium')) {
            return;
        }

        $product_id = $product->get_id();

        if (self::is_seat_reserved($product_id, $seat_id, $selected_date)) {
            throw new \Exception(esc_html__('This seat was just added to another cart. Please select another seat or try again later.', 'stachethemes-seat-planner-lite'));
        }
    }

    public static function reserve_seat(WC_Product $product, string $seat_id, string $cart_item_key, \WC_Cart $cart, string $selected_date = ''): void {

        if (!$product->is_type('auditorium')) {
            return;
        }

        if (!$cart_item_key) {
            return;
        }

        $product_id = $product->get_id();
        $session_id = self::get_session_id();

        self::insert_transient($product_id, $seat_id, [
            'session_id'    => $session_id,
            'selected_date' => $selected_date
        ]);
    }

    public static function maybe_release_transient(string $cart_item_key, \WC_Cart $cart): void {

        if (!isset($cart->cart_contents[$cart_item_key]['seat_data'])) {
            return;
        }

        $seat_data     = Utils::normalize_seat_data_meta($cart->cart_contents[$cart_item_key]['seat_data']);
        $product_id    = $cart->cart_contents[$cart_item_key]['product_id'];
        $seat_id       = $seat_data['seatId'] ?? '';
        $selected_date = $cart->cart_contents[$cart_item_key]['selected_date'] ?? '';
        $transient     = self::get_slot_transient($product_id, $seat_id, $selected_date);

        // Let's first verify if the seat is reserved by another user
        // If it is, don't release the seat
        if ($transient) {

            $session_id         = $transient['session_id'];
            $current_session_id = self::get_session_id();

            if ((string) $session_id !== (string) $current_session_id) {
                return;
            }
        }

        self::release_transient($product_id, $seat_id, $selected_date);
    }

    /**
     * @param list<string> $taken_seats
     * @return list<string>
     */
    public static function attach_reserved_seats_to_taken_seats(array $taken_seats, WC_Product $product, string $selected_date = ''): array {

        if (!$product->is_type('auditorium')) {
            return $taken_seats;
        }

        if (!self::$reserve_time) {
            return $taken_seats;
        }

        $current_session_id = self::get_session_id();
        $transients         = self::get_reserved_transients_by_product_id($product->get_id(), $selected_date);

        if (!$transients) {
            return $taken_seats;
        }

        foreach ($transients as $transient) {

            if (!isset($transient['seat_id']) || !isset($transient['session_id'])) {
                continue;
            }

            $seat_id          = $transient['seat_id'];
            $session_id       = $transient['session_id'];

            // If the transient is not for the current session, assume the seat is taken by someone else
            if ((string) $session_id !== (string) $current_session_id) {
                $taken_seats[] = $seat_id;
            }
        }

        return array_values(array_unique($taken_seats));
    }

    /**
     * Get all reserved seats for a product, grouped by date.
     *
     * @param Auditorium_Product|int $product
     * @return array<string, list<string>>
     */
    public static function get_product_reserved_seats(\WC_Product|int $product): array {

        $product = is_int($product) ? wc_get_product($product) : $product;

        if (!$product || !$product->is_type('auditorium')) {
            return [];
        }

        /** @var Auditorium_Product $product */
        $dates = $product->get_dates_data();
        $dates = !empty($dates) ? $dates : [''];

        $result = [];

        foreach ($dates as $date) {

            $transients = self::get_reserved_transients_by_product_id($product->get_id(), $date);

            if (!$transients) {
                continue;
            }

            foreach ($transients as $row) {

                if (empty($row['seat_id'])) {
                    continue;
                }

                $result[$date][] = $row['seat_id'];
            }
        }

        return $result;
    }

    public static function is_seat_reserved(int $product_id, string $seat_id, string $selected_date = ''): bool {

        $transient = self::get_slot_transient($product_id, $seat_id, $selected_date);

        if ($transient) {

            if ($transient['session_id'] !== self::get_session_id()) {
                return true;
            }
        }

        return false;
    }

    public static function release_transient(int $product_id, string $seat_id, string $selected_date = ''): void {
        self::delete_slot_transient($product_id, $seat_id, $selected_date);
        self::remove_from_index($product_id, $seat_id, $selected_date);
    }

    /**
     * @param array<string, mixed> $args
     */
    public static function insert_transient(int $product_id, string $seat_id, array $args = []): void {

        $default_args = [
            'session_id'    => self::get_session_id(),
            'reserve_time'  => self::$reserve_time,
            'selected_date' => ''
        ];

        $args = wp_parse_args($args, $default_args);

        // Do not insert transient if reserve time is 0
        if ($args['reserve_time'] === 0) {
            return;
        }

        $transient_data = [
            'seat_id'       => $seat_id,
            'session_id'    => $args['session_id'],
            'selected_date' => $args['selected_date']
        ];

        self::set_slot_transient($product_id, $seat_id, $transient_data, $args['reserve_time'], $args['selected_date']);
        self::add_to_index($product_id, $seat_id, $args['selected_date']);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function get_reserved_transients_by_product_id(int $product_id, string $selected_date = ''): array {

        $key = self::$transient_prefix . "index_{$product_id}";

        if ($selected_date) {
            $key .= "_{$selected_date}";
        }

        $index = get_option($key, []);

        if (empty($index)) {
            return [];
        }

        $transients = [];

        foreach (array_keys($index) as $seat_hash) {

            $transient_string = self::$transient_prefix . "{$product_id}_{$seat_hash}";

            if ($selected_date) {
                $transient_string .= "_{$selected_date}";
            }

            $t = get_transient($transient_string);
            if ($t) {
                $transients[] = $t;
            } else {
                // prune dead entries
                unset($index[$seat_hash]);
            }
        }

        update_option($key, $index, false);
        return $transients;
    }

    /**
     * @return array<string, mixed>|false
     */
    public static function get_slot_transient(int $product_id, string $seat_id, string $selected_date = ''): array|false {
        $safe_seat_id = self::get_hash_seat_id($seat_id);

        $transient_string = self::$transient_prefix . "{$product_id}_{$safe_seat_id}";

        if ($selected_date) {
            $transient_string .= "_{$selected_date}";
        }

        return get_transient($transient_string);
    }

    /**
     * @param array<string, mixed> $transient_data
     */
    private static function set_slot_transient(int $product_id, string $seat_id, array $transient_data, int $reserve_time, string $selected_date = ''): void {
        $safe_seat_id = self::get_hash_seat_id($seat_id);

        $transient_string = self::$transient_prefix . "{$product_id}_{$safe_seat_id}";

        if ($selected_date) {
            $transient_string .= "_{$selected_date}";
        }

        set_transient($transient_string, $transient_data, $reserve_time * 60);
    }

    private static function delete_slot_transient(int $product_id, string $seat_id, string $selected_date = ''): void {
        $safe_seat_id = self::get_hash_seat_id($seat_id);

        $transient_string = self::$transient_prefix . "{$product_id}_{$safe_seat_id}";

        if ($selected_date) {
            $transient_string .= "_{$selected_date}";
        }

        delete_transient($transient_string);
    }

    private static function add_to_index(int $product_id, string $seat_id, string $selected_date = ''): void {
        $seat_id_hash = self::get_hash_seat_id($seat_id);
        $key = self::$transient_prefix . "index_{$product_id}";

        if ($selected_date) {
            $key .= "_{$selected_date}";
        }

        $index = get_option($key, []);
        $index[$seat_id_hash] = time();
        update_option($key, $index, false);
    }

    private static function remove_from_index(int $product_id, string $seat_id, string $selected_date = ''): void {
        $seat_id_hash = self::get_hash_seat_id($seat_id);
        $key = self::$transient_prefix . "index_{$product_id}";

        if ($selected_date) {
            $key .= "_{$selected_date}";
        }

        $index = get_option($key, []);
        if (isset($index[$seat_id_hash])) {
            unset($index[$seat_id_hash]);
            update_option($key, $index, false);
        }
    }

    // Helpers: session and identifiers
    private static function get_session_id(): string|int {
        if (is_user_logged_in()) return get_current_user_id();

        if (function_exists('\WC') && \WC()->session) {

            $cid = \WC()->session->get_customer_id();

            if (!empty($cid)) {
                return $cid;
            }
        }

        return self::get_guest_cookie_id();
    }

    private static function get_guest_cookie_id(): string {
        $cookie      = 'stachesepl_sid';
        $cookie_val  = isset($_COOKIE[$cookie]) ? sanitize_text_field(wp_unslash($_COOKIE[$cookie])) : '';

        if (empty($cookie_val) || !preg_match('/^[a-f0-9\-]{36}$/', $cookie_val)) {
            $uuid = wp_generate_uuid4();
            setcookie($cookie, $uuid, time() + YEAR_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true);
            $_COOKIE[$cookie] = $uuid;
            $cookie_val = $uuid;
        }

        return $cookie_val;
    }

    private static function get_hash_seat_id(string $seat_id): string {
        return hash_hmac('sha256', $seat_id, 'stachesepl');
    }
}

Slot_Reservation::init();
