<?php

/**
 * Plugin Name: Stachethemes Seat Planner Lite
 * Plugin URI: https://woocommerce.com/products/stachethemes-seat-planner/
 * Description: A WooCommerce extension that adds a custom product type for selecting seats with a drag & drop seat planner. Easily create and manage seating arrangements for events, venues, or any seat-based products.
 * Author: Stachethemes
 * Author URI:  https://woocommerce.com/vendor/stachethemes/
 * Version: 1.0.4
 * domain Path: /languages
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: stachethemes-seat-planner-lite
 * Requires at least: 6.7
 * Requires PHP: 8.2
 */

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

define('STACHETHEMES_SEAT_PLANNER_LITE_VERSION', '1.0.4');
define('STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL', plugin_dir_url(__FILE__));
define('STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_FILE', __FILE__);

class Stachethemes_Seat_Planner_Lite {

    private static $instance;

    public static function instance(): Stachethemes_Seat_Planner_Lite {
        if (!isset(self::$instance) && !(self::$instance instanceof Stachethemes_Seat_Planner_Lite)) {
            self::$instance = new Stachethemes_Seat_Planner_Lite();
        }
        return self::$instance;
    }

    public function __construct() {

        add_action('init', [$this, 'init']);

        add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
            $links[] = '<a href="https://woocommerce.com/products/stachethemes-seat-planner/" target="_self" style="color: green; font-weight: bold;">' . esc_html__('Get Full Version', 'stachethemes-seat-planner-lite') . '</a>';
            return $links;
        });
    }

    public function init(): void {


        if (class_exists('Stachethemes\SeatPlanner\Main')) {

            add_action('admin_notices', function () {
?>
                <div class="notice notice-success is-dismissible">
                    <p><?php esc_html_e('Thank you for purchasing the full version of Stachethemes Seat Planner!', 'stachethemes-seat-planner-lite'); ?></p>
                    <p><a href="<?php echo esc_url(wp_nonce_url(admin_url('plugins.php?action=deactivate&plugin=stachethemes-seat-planner-lite/index.php'), 'deactivate-plugin_stachethemes-seat-planner-lite/index.php')); ?>" class="button"><?php esc_html_e('Deactivate Lite Version', 'stachethemes-seat-planner-lite'); ?></a></p>
                </div>
            <?php
            });

            return;
        }

        if (class_exists('WooCommerce')) {
            require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/load.php';
        } else {

            add_action('admin_notices', function () {
            ?>
                <div class="notice notice-error is-dismissible">
                    <p><?php esc_html_e('Stachethemes Seat Planner Lite requires WooCommerce to be installed and activated.', 'stachethemes-seat-planner-lite'); ?></p>

                    <?php

                    if (is_plugin_inactive('woocommerce/woocommerce.php')) {
                        printf(
                            '<p><a href="%1$s" class="button">%2$s</a></p>',
                            esc_url(wp_nonce_url(admin_url('plugins.php?action=activate&plugin=woocommerce/woocommerce.php'), 'activate-plugin_woocommerce/woocommerce.php')),
                            esc_html__('Activate WooCommerce', 'stachethemes-seat-planner-lite')
                        );
                    } else {
                        printf(
                            '<p><a href="%1$s" target="_blank" class="button">%2$s</a></p>',
                            esc_url('https://woocommerce.com/'),
                            esc_html__('Get WooCommerce', 'stachethemes-seat-planner-lite')
                        );
                    }

                    ?>
                </div>
<?php
            });
        }
    }
}

Stachethemes_Seat_Planner_Lite::instance();