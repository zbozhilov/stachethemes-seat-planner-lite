<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class PDF_Preview {

    public static bool $did_init = false;

    public static function init(): void {

        if (self::$did_init) {
            return;
        }

        self::$did_init = true;

        add_action('admin_post_stachesepl_pdf_preview', [__CLASS__, 'handle_preview']);

    }

    public static function render_page(): void {
        $error_message = '';

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading a sanitized, read-only error code from the query string to display an admin notice.
        $error_code = isset($_GET['stachesepl_pdf_preview_error']) ? sanitize_key(wp_unslash($_GET['stachesepl_pdf_preview_error'])) : '';
        if ($error_code === 'invalid_order_id') {
            $error_message = esc_html__('Please enter a valid order ID.', 'stachethemes-seat-planner-lite');
        } elseif ($error_code === 'order_not_found') {
            $error_message = esc_html__('Order not found.', 'stachethemes-seat-planner-lite');
        } elseif ($error_code === 'pdf_failed') {
            $error_message = esc_html__('Failed to generate PDF. The order may not contain auditorium products.', 'stachethemes-seat-planner-lite');
        } elseif ($error_code === 'forbidden') {
            $error_message = esc_html__('You do not have permission to preview PDFs.', 'stachethemes-seat-planner-lite');
        }

        // Display the form
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('PDF Preview', 'stachethemes-seat-planner-lite') . '</h1>';
        echo '<p>' . esc_html__('Enter an order ID to preview the PDF that would be generated for that order.', 'stachethemes-seat-planner-lite') . '</p>';

        // Display error message if any
        if ($error_message) {
            echo '<div class="notice notice-error"><p>' . esc_html($error_message) . '</p></div>';
        }

        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '" target="_blank">';
        wp_nonce_field('stachesepl_pdf_preview');
        echo '<input type="hidden" name="action" value="stachesepl_pdf_preview" />';

        echo '<table class="form-table" role="presentation">';
        echo '  <tbody>';
        echo '    <tr>';
        echo '      <th scope="row">';
        echo '        <label for="stachesepl-pdf-preview-order-id">' . esc_html__('Order ID', 'stachethemes-seat-planner-lite') . '</label>';
        echo '      </th>';
        echo '      <td>';
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading a sanitized, read-only order ID from the query string to pre-fill the admin form field.
        $order_id_value = isset($_GET['order_id']) ? absint($_GET['order_id']) : '';
        echo '        <input type="number" id="stachesepl-pdf-preview-order-id" name="stachesepl_pdf_preview_order_id" value="' . esc_attr((string) $order_id_value) . '" class="regular-text" min="1" step="1" required />';
        echo '        <p class="description">' . esc_html__('Enter the WooCommerce order ID to preview its PDF.', 'stachethemes-seat-planner-lite') . '</p>';
        echo '      </td>';
        echo '    </tr>';
        echo '  </tbody>';
        echo '</table>';

        echo '<p class="submit">';
        echo '  <input type="submit" name="stachesepl_pdf_preview_submit" id="submit" class="button button-primary" value="' . esc_attr__('Preview PDF', 'stachethemes-seat-planner-lite') . '" />';
        echo '</p>';

        echo '</form>';
        echo '</div>';
    }

    public static function handle_preview(): void {
        if (! current_user_can('manage_woocommerce')) {
            $redirect_url = add_query_arg(
                [
                    'page' => 'stachesepl',
                    'stachesepl_pdf_preview_error' => 'forbidden',
                ],
                admin_url('admin.php')
            );
            $redirect_url .= '#tools';
            wp_safe_redirect($redirect_url);
            exit;
        }

        check_admin_referer('stachesepl_pdf_preview');

        $order_id = isset($_POST['stachesepl_pdf_preview_order_id']) ? absint($_POST['stachesepl_pdf_preview_order_id']) : 0;

        if ($order_id <= 0) {
            $redirect_url = add_query_arg(
                [
                    'page' => 'stachesepl',
                    'stachesepl_pdf_preview_error' => 'invalid_order_id',
                    'order_id' => $order_id,
                ],
                admin_url('admin.php')
            );
            $redirect_url .= '#tools';
            wp_safe_redirect($redirect_url);
            exit;
        }

        $order = wc_get_order($order_id);
        if (! $order || ! ($order instanceof \WC_Order)) {
            $redirect_url = add_query_arg(
                [
                    'page' => 'stachesepl',
                    'order_id' => $order_id,
                ],
                admin_url('admin.php')
            );
            $redirect_url .= '#orderNotFound';
            wp_safe_redirect($redirect_url);
            exit;
        }

        $pdf = new PDF($order_id);
        $result = $pdf->print_test_pdf();

        if ($result === false) {
            $redirect_url = add_query_arg(
                [
                    'page' => 'stachesepl',
                    'stachesepl_pdf_preview_error' => 'pdf_failed',
                    'order_id' => $order_id,
                ],
                admin_url('admin.php')
            );
            $redirect_url .= '#tools';
            wp_safe_redirect($redirect_url);
            exit;
        }

        // If successful, print_test_pdf() streams the PDF and exits.
        exit;
    }
}

PDF_Preview::init();