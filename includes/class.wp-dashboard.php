<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * This class displays cards on the WordPress dashboard.
 * It displays a card with the number of seats sold and revenue generated in the last 30 days.
 */
class WP_Dashboard {

    /**
     * Initialize the dashboard widget.
     */
    public static function init() {
        add_action('wp_dashboard_setup', [__CLASS__, 'register_widget']);
        add_action('admin_bar_menu', [__CLASS__, 'add_admin_bar_menu'], 100);
        add_action('admin_head', [__CLASS__, 'add_admin_bar_styles']);
        add_action('wp_head', [__CLASS__, 'add_admin_bar_styles']);
    }

    /**
     * Register the dashboard widget.
     */
    public static function register_widget() {
        wp_add_dashboard_widget(
            'stachethemes_seat_planner_seats_sold',
            esc_html__('Seats Sold & Revenue (Last 30 Days)', 'stachethemes-seat-planner-lite'),
            [__CLASS__, 'render_widget']
        );
    }

    /**
     * Render the dashboard widget content.
     */
    public static function render_widget() {
        $stats = self::get_seats_and_revenue_stats();
        $formatted_count = number_format_i18n($stats['seats_sold']);
        $formatted_revenue = wc_price($stats['revenue']);
?>
        <div class="stachethemes-seat-planner-dashboard-widget">
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 180px; padding: 12px; background: #f6f7f7; border: 1px solid #dcdcde; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px; color: #50575e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .02em;">
                        <span class="dashicons dashicons-groups" aria-hidden="true"></span>
                        <span><?php echo esc_html__('Seats sold', 'stachethemes-seat-planner-lite'); ?></span>
                    </div>
                    <div style="margin-top: 8px; font-size: 30px; line-height: 1.1; font-weight: 700; color: #1d2327;">
                        <?php echo esc_html($formatted_count); ?>
                    </div>
                </div>

                <div style="flex: 1; min-width: 180px; padding: 12px; background: #f6f7f7; border: 1px solid #dcdcde; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px; color: #50575e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .02em;">
                        <span class="dashicons dashicons-chart-line" aria-hidden="true"></span>
                        <span><?php echo esc_html__('Revenue', 'stachethemes-seat-planner-lite'); ?></span>
                    </div>
                    <div style="margin-top: 8px; font-size: 30px; line-height: 1.1; font-weight: 700; color: #1d2327;">
                        <?php echo wp_kses_post($formatted_revenue); ?>
                    </div>
                </div>
            </div>

            <p style="margin: 10px 0 0 0; color: #50575e; font-size: 12px;">
                <?php echo esc_html__('Completed orders • Last 30 days', 'stachethemes-seat-planner-lite'); ?>
            </p>
        </div>
    <?php
    }

    /**
     * Get both seats sold count and revenue for the last 30 days.
     * Results are cached for 5 minutes to improve performance.
     *
     * @return array{seats_sold: int, revenue: float} Array with seats_sold count and revenue total.
     */
    private static function get_seats_and_revenue_stats(): array {
        $transient_key = 'stachesepl_dashboard_stats_30days';
        $cached_stats = get_transient($transient_key);

        // Return cached data if available
        if (false !== $cached_stats && is_array($cached_stats)) {
            return $cached_stats;
        }

        // Calculate stats
        $date_after = strtotime('-30 days');

        $orders = wc_get_orders([
            'type'                   => 'shop_order',
            'status'                 => ['wc-completed'],
            'date_after'             => date_i18n('Y-m-d H:i:s', $date_after),
            'limit'                  => -1,
            'has_auditorium_product' => 1
        ]);

        if (empty($orders)) {
            $stats = [
                'seats_sold' => 0,
                'revenue'    => 0.0
            ];
        } else {
            $total_seats = 0;
            $total_revenue = 0.0;

            foreach ($orders as $order) {
                $order_items = $order->get_items();

                foreach ($order_items as $item) {
                    $seat_data_meta = $item->get_meta('seat_data');
                    $seat_data      = is_array($seat_data_meta) ? $seat_data_meta : (is_object($seat_data_meta) ? (array) $seat_data_meta : []);

                    if (empty($seat_data)) {
                        continue;
                    }

                    $seat_id = isset($seat_data['seatId']) ? $seat_data['seatId'] : '';

                    // Count each seat item that has a valid seatId and add its revenue
                    if ($seat_id) {
                        $total_seats++;
                        $total_revenue += (float) $item->get_total();
                    }
                }
            }

            $stats = [
                'seats_sold' => $total_seats,
                'revenue'    => $total_revenue
            ];
        }

        // Cache the results for 5 minutes (300 seconds)
        set_transient($transient_key, $stats, 5 * MINUTE_IN_SECONDS);

        return $stats;
    }

    /**
     * Add a menu item to the WordPress admin bar.
     *
     * @param \WP_Admin_Bar $wp_admin_bar The WordPress admin bar object.
     */
    public static function add_admin_bar_menu($wp_admin_bar) {
        // Only show to users who can manage options
        if (! apply_filters('stachesepl_can_read_qr_string_details', 'manage_woocommerce')) {
            return;
        }

        $svg_icon = '<svg class="stachesepl-scanner-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" data-testid="QrCodeScannerIcon"><path d="M9.5 6.5v3h-3v-3zM11 5H5v6h6zm-1.5 9.5v3h-3v-3zM11 13H5v6h6zm6.5-6.5v3h-3v-3zM19 5h-6v6h6zm-6 8h1.5v1.5H13zm1.5 1.5H16V16h-1.5zM16 13h1.5v1.5H16zm-3 3h1.5v1.5H13zm1.5 1.5H16V19h-1.5zM16 16h1.5v1.5H16zm1.5-1.5H19V16h-1.5zm0 3H19V19h-1.5zM22 7h-2V4h-3V2h5zm0 15v-5h-2v3h-3v2zM2 22h5v-2H4v-3H2zM2 2v5h2V4h3V2z"></path></svg>';

        $wp_admin_bar->add_menu([
            'id'    => 'stachesepl-scanner',
            'title' => $svg_icon . '<span class="ab-label">' . esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite') . '</span>',
            'href'  => admin_url('admin.php?page=stachesepl#scanner'),
            'meta'  => [
                'title' => esc_html__('Open Seat Planner QR Code Scanner', 'stachethemes-seat-planner-lite'),
            ],
        ]);
    }

    /**
     * Add custom styles for the admin bar menu item.
     */
    public static function add_admin_bar_styles() {
        // Only show styles to users who can read QR string details
        if (! apply_filters('stachesepl_can_read_qr_string_details', 'manage_woocommerce')) {
            return;
        }
    ?>
        <style>
            #wp-admin-bar-stachesepl-scanner .stachesepl-scanner-icon {
                display: inline-block;
                vertical-align: middle;
                fill: currentColor;
                margin-right: 6px;
                transition: opacity 0.2s ease;
            }

            #wp-admin-bar-stachesepl-scanner:hover .stachesepl-scanner-icon {
                opacity: 0.8;
            }

            #wp-admin-bar-stachesepl-scanner .ab-item {
                display: flex;
                align-items: center;
            }

            /* Ensure visibility on mobile devices */
            @media screen and (max-width: 782px) {
                #wp-admin-bar-stachesepl-scanner {
                    display: block !important;
                }

                #wp-admin-bar-stachesepl-scanner .ab-item {
                    display: flex !important;
                    align-items: center;
                    padding: 7px 10px;
                }

                #wp-admin-bar-stachesepl-scanner .stachesepl-scanner-icon {
                    display: inline-block !important;
                    margin-right: 8px;
                }

                #wp-admin-bar-stachesepl-scanner .ab-label {
                    display: inline-block !important;
                }

                #wp-admin-bar-stachesepl-scanner svg {
                    width: 32px;
                    height: 32px;
                    margin-left: 8px;
                    color: #c3c4c7;
                }

                #wp-admin-bar-stachesepl-scanner:hover svg {
                    color: #72aee6;
                }
            }
        </style>
<?php
    }
}

WP_Dashboard::init();
