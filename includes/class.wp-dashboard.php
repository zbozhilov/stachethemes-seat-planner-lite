<?php 

namespace Stachethemes\SeatPlanner;

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
    }

    /**
     * Register the dashboard widget.
     */
    public static function register_widget() {
        wp_add_dashboard_widget(
            'stachethemes_seat_planner_seats_sold',
            esc_html__('Seats Sold & Revenue (Last 30 Days)', 'stachethemes-seat-planner'),
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
                        <span><?php echo esc_html__('Seats sold', 'stachethemes-seat-planner'); ?></span>
                    </div>
                    <div style="margin-top: 8px; font-size: 30px; line-height: 1.1; font-weight: 700; color: #1d2327;">
                        <?php echo esc_html($formatted_count); ?>
                    </div>
                </div>

                <div style="flex: 1; min-width: 180px; padding: 12px; background: #f6f7f7; border: 1px solid #dcdcde; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px; color: #50575e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .02em;">
                        <span class="dashicons dashicons-chart-line" aria-hidden="true"></span>
                        <span><?php echo esc_html__('Revenue', 'stachethemes-seat-planner'); ?></span>
                    </div>
                    <div style="margin-top: 8px; font-size: 30px; line-height: 1.1; font-weight: 700; color: #1d2327;">
                        <?php echo wp_kses_post($formatted_revenue); ?>
                    </div>
                </div>
            </div>

            <p style="margin: 10px 0 0 0; color: #50575e; font-size: 12px;">
                <?php echo esc_html__('Completed orders • Last 30 days', 'stachethemes-seat-planner'); ?>
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
}

WP_Dashboard::init();