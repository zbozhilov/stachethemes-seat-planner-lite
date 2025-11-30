<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

use Dompdf\Dompdf;
use Dompdf\Options;

class PDF {

    private $order_id;
    private $order;
    private const PDF_BODY_TEMPLATE_PATH = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/pdf/templates/pdf-body.php';
    private const PDF_LOOP_TEMPLATE_PATH = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/pdf/templates/pdf-loop.php';
    private const PDF_TEMPLATES_DIR      = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/pdf/templates/';
    private const THEME_OVERRIDE_BODY_FILENAME = 'stachesepl-pdf-body.php';
    private const THEME_OVERRIDE_LOOP_FILENAME = 'stachesepl-pdf-loop.php';

    function __construct(int $order_id) {
        $this->order_id = $order_id;
        $this->order    = \wc_get_order($this->order_id);
    }

    private function get_template_content($path) {
        $resolved_template_path = $this->resolve_template_path($path);

        if ($resolved_template_path === false) {
            return '';
        }

        ob_start();
        include $resolved_template_path;
        return ob_get_clean();
    }

    private function get_theme_template_path($filename) {
        if (!is_string($filename) || $filename === '') {
            return false;
        }

        // Prefer child theme, then parent theme
        if (function_exists('\locate_template')) {
            $path = \locate_template([$filename], false, false);
            if (is_string($path) && $path !== '' && is_file($path) && is_readable($path)) {
                return $path;
            }
        }

        return false;
    }

    private function resolve_template_path($path) {
        if (!is_string($path)) {
            return false;
        }

        $resolved_path = realpath($path);
        $templates_dir = realpath(self::PDF_TEMPLATES_DIR);
        $child_theme_dir = function_exists('\get_stylesheet_directory') ? realpath(\get_stylesheet_directory()) : false;
        $parent_theme_dir = function_exists('\get_template_directory') ? realpath(\get_template_directory()) : false;

        if ($resolved_path === false || $templates_dir === false) {
            return false;
        }

        if (!is_file($resolved_path) || !is_readable($resolved_path)) {
            return false;
        }

        // Allow only specific template filenames to be included
        $basename = basename($resolved_path);
        $allowed_basenames = [
            'pdf-body.php',
            'pdf-loop.php',
            self::THEME_OVERRIDE_BODY_FILENAME,
            self::THEME_OVERRIDE_LOOP_FILENAME
        ];
        if (!in_array($basename, $allowed_basenames, true)) {
            return false;
        }

        // Ensure the template resides within the plugin's templates directory or an active theme directory
        $allowed_base_dirs = array_filter([$templates_dir, $child_theme_dir, $parent_theme_dir]);
        $is_within_allowed = false;

        foreach ($allowed_base_dirs as $base_dir) {
            if ($base_dir && strpos($resolved_path, $base_dir) === 0) {
                $is_within_allowed = true;
                break;
            }
        }

        if (!$is_within_allowed) {
            return false;
        }

        return $resolved_path;
    }

    private function get_html_content() {

        if (!is_a($this->order, 'WC_Order')) {
            return '';
        }

        if (!$this->order->get_meta('has_auditorium_product')) {
            return '';
        }

        // Determine template paths with theme override support (child theme -> parent theme -> plugin default)
        $theme_body = $this->get_theme_template_path(self::THEME_OVERRIDE_BODY_FILENAME);
        $theme_loop = $this->get_theme_template_path(self::THEME_OVERRIDE_LOOP_FILENAME);

        $selected_body_path = $theme_body ? $theme_body : self::PDF_BODY_TEMPLATE_PATH;
        $selected_loop_path = $theme_loop ? $theme_loop : self::PDF_LOOP_TEMPLATE_PATH;

        // Still pass through filters for final control
        $template_body_path = apply_filters('stachesepl_pdf_template_body', $selected_body_path);
        $template_loop_path = apply_filters('stachesepl_pdf_template_loop', $selected_loop_path);

        if (!file_exists($template_body_path) || !file_exists($template_loop_path)) {
            return '';
        }

        $template_body = $this->get_template_content($template_body_path);
        $template_loop = $this->get_template_content($template_loop_path);

        $order_items = $this->order->get_items();

        $auditorium_products = array_filter($order_items, function ($item) {
            /** @var \WC_Product_Item $item */
            return $item->get_product()->get_type() === 'auditorium';
        });

        if (empty($auditorium_products)) {
            return '';
        }

        $products_html_array = [];

        foreach ($auditorium_products as $product) {

            $product_html  = $template_loop;
            $product_title = $product->get_name();
            $seat_data     = $product->get_meta('seat_data');
            $seat_id       = $seat_data->seatId;

            /** @var \WC_Product_Item $product */
            $seat_price     = \wc_price($product->get_total());
            $qr_code        = isset($seat_data->qr_code) ? $seat_data->qr_code : '';
            $selected_date  = isset($seat_data->selectedDate) && $seat_data->selectedDate ? Utils::get_formatted_date_time($seat_data->selectedDate) : '';

            $date_or_price_row =
                '<tr>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border: none;"><strong style="color: #000;">' . ($selected_date ? esc_html_x('Date', 'PDF Template', 'stachethemes-seat-planner-lite') : esc_html_x('Price', 'PDF Template', 'stachethemes-seat-planner-lite')) . ':</strong></td>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border: none; text-align: right;"><span style="color: #000;">' . ($selected_date ? esc_html($selected_date) : $seat_price) . '</span></td>
                </tr>';

            $product_placeholders = apply_filters(
                'stachesepl_pdf_template_loop_placeholders',
                [
                    '{product_title}'      => $product_title,
                    '{order_id}'           => $this->order_id,
                    '{customer_name}'      => $this->order->get_billing_first_name() . ' ' . $this->order->get_billing_last_name(),
                    '{seat_id}'            => $seat_id,
                    '{seat_price}'         => $seat_price,
                    '{qrcode}'             => $qr_code,
                    '{selected_date}'      => $selected_date,
                    '{date_or_price_row}'  => $date_or_price_row
                ],
                $product,
                $this->order
            );

            $product_html          = str_replace(array_keys($product_placeholders), array_values($product_placeholders), $product_html);
            $products_html_array[] = $product_html;
        }

        $body_placholders = apply_filters('stachesepl_pdf_template_body_placeholders', [
            '{template_loop}' => implode('', $products_html_array)
        ], $this->order);

        $html = str_replace(array_keys($body_placholders), array_values($body_placholders), $template_body);

        return $html;
    }

    public function build() {

        if (!class_exists('Dompdf\Dompdf')) {
            require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'libs/dompdf/vendor/autoload.php';
        }

        $html    = self::get_html_content();
        $options = new Options();

        if (!$html) {
            return false;
        }

        $options->set(
            apply_filters('stachesepl_dompdf_options',  [
                'isHtml5ParserEnabled'    => true,
                'isRemoteEnabled'         => true,
                'defaultFont'             => 'DejaVu Sans',
                'defaultPaperSize'        => 'A4',
                'defaultPaperOrientation' => 'portrait'
            ])
        );

        $upload_dir = wp_get_upload_dir();
        $pdf_dir    = trailingslashit($upload_dir['basedir']) . 'stachesepl_pdf';

        if (!file_exists($pdf_dir) && !wp_mkdir_p($pdf_dir)) {
            return false;
        }

        $order_key = $this->order->get_order_key();

        $pdf_file_name = apply_filters(
            'stachesepl_pdf_file_name',
            'ticket_details_' . $order_key . '.pdf',
            $this->order_id
        );

        $pdf_file_path = $pdf_dir . '/' . $pdf_file_name;
        $dompdf        = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->render();

        $success = file_put_contents($pdf_file_path, $dompdf->output());

        if (!$success) {
            return false;
        }

        return $pdf_file_path;
    }

    public function print_test_pdf() {

        if (!class_exists('Dompdf\Dompdf')) {
            require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'libs/dompdf/vendor/autoload.php';
        }

        $html    = self::get_html_content();
        $options = new Options();

        if (!$html) {
            return false;
        }

        $options->set(
            apply_filters('stachesepl_dompdf_options',  [
                'isHtml5ParserEnabled'    => true,
                'isRemoteEnabled'         => true,
                'defaultFont'             => 'DejaVu Sans',
                'defaultPaperSize'        => 'A4',
                'defaultPaperOrientation' => 'portrait'
            ])
        );

        $dompdf  = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->render();

        $filename = apply_filters(
            'stachesepl_test_pdf_file_name',
            'stachesepl_test_' . $this->order_id . '.pdf',
            $this->order_id
        );

        $dompdf->stream($filename, ['Attachment' => false]);
        exit;
    }
}
