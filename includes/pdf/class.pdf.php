<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

use Dompdf\Dompdf;
use Dompdf\Options;

class PDF {

    private int $order_id;
    /** @var \WC_Order|false */
    private $order;
    private const PDF_BODY_TEMPLATE_PATH = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/pdf/templates/pdf-body.php';
    private const PDF_LOOP_TEMPLATE_PATH = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/pdf/templates/pdf-loop.php';
    private const PDF_TEMPLATES_DIR      = STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'includes/pdf/templates/';
    private const THEME_OVERRIDE_BODY_FILENAME = 'stachesepl-pdf-body.php';
    private const THEME_OVERRIDE_LOOP_FILENAME = 'stachesepl-pdf-loop.php';

    function __construct(int $order_id) {
        $this->order_id = $order_id;

        $order = \wc_get_order($this->order_id);
        
        if (!$order || !($order instanceof \WC_Order)) {
            $this->order = false;
            return;
        }

        $this->order = $order;
    }

    private function get_template_content(string $path): string {
        $resolved_template_path = $this->resolve_template_path($path);

        if ($resolved_template_path === false) {
            return '';
        }

        // Additional safety check: verify path is still valid before inclusion
        if (!is_file($resolved_template_path) || !is_readable($resolved_template_path)) {
            return '';
        }

        // Final validation: ensure basename is in allowed list
        $basename = basename($resolved_template_path);
        $allowed_basenames = [
            'pdf-body.php',
            'pdf-loop.php',
            self::THEME_OVERRIDE_BODY_FILENAME,
            self::THEME_OVERRIDE_LOOP_FILENAME
        ];
        if (!in_array($basename, $allowed_basenames, true)) {
            return '';
        }

        ob_start();
        include $resolved_template_path;
        $content = ob_get_clean();
        return is_string($content) ? $content : '';
    }

    private function get_theme_template_path(string $filename): string|false {
        if ($filename === '') {
            return false;
        }

        // Prefer child theme, then parent theme
        if (function_exists('\locate_template')) {
            $path = \locate_template([$filename], false, false);
            if ($path !== '' && is_file($path) && is_readable($path)) {
                return $path;
            }
        }

        return false;
    }

    private function resolve_template_path(string $path): string|false {
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

    private function get_html_content(): string {

        if (!($this->order instanceof \WC_Order)) {
            return '';
        }

        $order = $this->order;

        if (!$order->get_meta('has_auditorium_product')) {
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
        $order_items   = $order->get_items();

        $auditorium_products = array_filter($order_items, function ($item) use ($order) {

            if (!($item instanceof \WC_Order_Item_Product)) {
                return false;
            }

            $product = $item->get_product();

            if (!$product || !($product instanceof Auditorium_Product)) {
                return false;
            }

            // If item is refunded, skip
            if (Order_Helper::is_item_refunded($order, $item->get_id())) {
                return false;
            }

            return true;
        });

        if (empty($auditorium_products)) {
            return '';
        }

        $products_html_array = [];

        foreach ($auditorium_products as $product) {

            $product_html  = $template_loop;
            $product_title = $product->get_name();
            $seat_data     = Utils::normalize_seat_data_meta($product->get_meta('seat_data'));
            $seat_id       = $seat_data['seatId'] ?? '';

            // Custom fields data
            $seat_cfs      = $seat_data['customFields'] ?? null;
            /** @var \WC_Order_Item_Product $product */
            $seat_price     = \wc_price( (float) $product->get_total() + (float) $product->get_total_tax());
            $qr_code        = isset($seat_data['qr_code']) ? $seat_data['qr_code'] : '';
            $selected_date  = isset($seat_data['selectedDate']) && $seat_data['selectedDate'] ? Utils::get_formatted_date_time($seat_data['selectedDate']) : '';

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

            $product_html = str_replace(
                array_map('strval', array_keys($product_placeholders)), // ensure all keys are strings
                array_values($product_placeholders),
                $product_html
            );
            
            $products_html_array[] = $product_html;
        }

        $body_placholders = apply_filters('stachesepl_pdf_template_body_placeholders', [
            '{template_loop}' => implode('', $products_html_array)
        ], $this->order);

        $html = str_replace(
            array_map('strval', array_keys($body_placholders)), // ensure all keys are strings
            array_values($body_placholders),
            $template_body
        );

        return $html;
    }

    public function build(): string|false {

        if (!class_exists('\Dompdf\Dompdf')) {
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

        $pdf_file_name = apply_filters(
            'stachesepl_pdf_file_name',
            'ticket-details.pdf',
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

    public function print_test_pdf(): string|false {

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

        $default_filename = get_option(
            'stachesepl_pdf_file_name',
            'order_details.pdf'
        );

        $filename = apply_filters(
            'stachesepl_pdf_file_name',
            $default_filename,
            $this->order_id
        );

        $dompdf->stream($filename, ['Attachment' => false]);
        exit;
    }
}
