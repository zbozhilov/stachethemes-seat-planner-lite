<?php

namespace Stachethemes\SeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Adds a "time remaining" notice for reserved seats in the WooCommerce cart
 * and renders a small inline script to convert the static value into
 * a live countdown timer on cart / checkout pages.
 */
class Auditorium_Product_Cart_Timer {

    private static $display_cart_timer = false;

    /**
     * Whether the hooks for this class have already been registered.
     *
     * @var bool
     */
    private static $did_init = false;


    /**
     * Register WooCommerce filters / actions for the cart timer.
     *
     * Intended to be called once via `Auditorium_Product_Cart_Timer::init()`.
     *
     * @return void
     */
    public static function init() {

        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        add_filter('woocommerce_add_cart_item_data', [__CLASS__, 'add_cart_item_data'], 10, 3);

        self::$display_cart_timer = get_option('stachesepl_cart_timer', 'yes') === 'yes' && Slot_Reservation::get_reserve_time() > 0;

        if (!self::$display_cart_timer) {
            return;
        }

        // Use a high priority so this runs after other item data filters,
        // ensuring the reservation notice appears as the last line.
        add_filter('woocommerce_get_item_data', [__CLASS__, 'attach_item_timer_data'], 100, 3);

        // Enqueue cart timer assets (script + styles) in the document head.
        add_action('wp_enqueue_scripts', [__CLASS__, 'register_cart_timer_scripts']);
    }

    /**
     * Register cart timer scripts and styles.
     *
     * @return void
     */
    public static function register_cart_timer_scripts() {

        $handle     = 'stachesepl-cart-timer';
        $asset_path = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/front/cart_timer/cart-timer.bundle.asset.php';
        $style_path = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/front/cart_timer/cart-timer.css';

        $asset = [
            'dependencies' => [],
            'version'      => STACHETHEMES_SEAT_PLANNER_LITE_VERSION,
        ];

        if (file_exists($asset_path)) {
            $asset_file = include $asset_path;
            if (is_array($asset_file)) {
                $asset = array_merge($asset, $asset_file);
            }
        }

        wp_register_script(
            $handle,
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . 'assets/front/cart_timer/cart-timer.bundle.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        // Pass the translated label to the script so it can stay in sync with PHP.
        wp_localize_script(
            $handle,
            'stacheseplCartTimer',
            [
                'label' => esc_html__('Time remaining', 'stachethemes-seat-planner-lite')
,
            ]
        );

        wp_enqueue_script($handle);

        $style_version = $asset['version'];
        if (file_exists($style_path)) {
            $style_version = filemtime($style_path);
        }

        wp_register_style(
            $handle,
            STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . 'assets/front/cart_timer/cart-timer.css',
            [],
            $style_version
        );

        wp_enqueue_style($handle);
    }

    /**
     * Attach reservation meta to the cart item so it can later be used to
     * calculate the remaining time in the cart.
     *
     * @param array $cart_item_data
     * @param int   $product_id
     * @param int   $variation_id
     *
     * @return array Filtered cart item data.
     */
    public static function add_cart_item_data($cart_item_data, $product_id, $variation_id) {

        $reserve_time = Slot_Reservation::get_reserve_time();

        if (!$reserve_time) {
            return $cart_item_data; // No need to continue if reservation time is 0
        }

        if (!isset($cart_item_data['seat_data'])) {
            return $cart_item_data;
        }

        $cart_item_data['stachesepl_reserve_time'] = $reserve_time;
        $cart_item_data['stachesepl_added_at']     = time();
        $cart_item_data['stachesepl_expires_at']   = time() + ($reserve_time * 60);

        return $cart_item_data;
    }

    /**
     * Add a "time remaining" line to the cart item details, based on the
     * reservation meta previously stored in `add_cart_item_data()`.
     *
     * @param array $item_data Existing item display data.
     * @param array $cart_item Raw cart item array.
     *
     * @return array Filtered item display data.
     */
    public static function attach_item_timer_data($item_data, $cart_item) {

        // Use the same keys that are set in add_cart_item_data()
        if (isset($cart_item['stachesepl_added_at'], $cart_item['stachesepl_reserve_time'], $cart_item['stachesepl_expires_at'])) {

            $reserve_time = (int) $cart_item['stachesepl_reserve_time'];
            $expires_at  = (int) $cart_item['stachesepl_expires_at'];

            if ($reserve_time <= 0) {
                return $item_data; // No need to continue if reservation time is 0
            }

            $item_data[] = [
                'name'  => esc_html__('Time remaining', 'stachethemes-seat-planner-lite')
,
                // Store the raw expiration timestamp (escaped for HTML) so the
                // JavaScript can calculate the remaining time on init.
                'value' => esc_html((string) $expires_at),
            ];
        }

        return $item_data;
    }

    /**
     * A helper function to get the timer html for a cart item
     */
    public static function get_timer_html($cart_item, $echo = true) {

        if (
            !self::$display_cart_timer ||
            !isset($cart_item['stachesepl_expires_at']) ||
            !isset($cart_item['stachesepl_reserve_time']) ||
            (int) $cart_item['stachesepl_reserve_time'] <= 0
        ) {
            return;
        }

        ob_start();
?>

        <div class="stachesepl-cart-timer-row">
            <span class="stachesepl-cart-timer-label"><?php esc_html_e('Time remaining', 'stachethemes-seat-planner-lite'); ?>:</span>
            <span class="stachesepl-cart-timer"><?php echo (int) $cart_item['stachesepl_expires_at']; ?></span>
        </div>

<?php

        if ($echo) {
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo ob_get_clean();
        } else {
            return ob_get_clean();
        }
    }
}
