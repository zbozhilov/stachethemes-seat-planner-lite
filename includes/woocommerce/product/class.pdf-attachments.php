<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class PDF_Attachments {

    private static $did_init = false;

    public static function init() {

        if (self::$did_init) { // Prevent double initialization
            return;
        }

        self::$did_init = true;

        // WooCommerce Settings > Emails
        add_filter('woocommerce_get_settings_email', [__CLASS__, 'add_settings'], 10, 1);
        add_action('woocommerce_update_options_email', [__CLASS__, 'save_settings'], 10, 1);

        if (get_option('stachesepl_pdf_attachments', 'yes') === 'yes') {
            add_filter('woocommerce_email_attachments', [__CLASS__, 'attach_pdf_to_completed_order_email'], 10, 3);
        }

    }

    public static function attach_pdf_to_completed_order_email($attachments, $email_id, $order) {

        if (!$order->get_meta('has_auditorium_product')) {
            return $attachments;
        }

        if (isset($email_id) && $email_id === 'customer_completed_order') {

            $order_id       = $order->get_id();
            $pdf            = new PDF($order_id);
            $pdf_attachment = $pdf->build();

            if ($pdf_attachment) {
                $attachments[] = $pdf_attachment;
            }
        }
        return $attachments;
    }

    public static function add_settings($settings) {

        $settings[] = [
            'title' => esc_html__('Seat Planner Attachments', 'stachethemes-seat-planner-lite')
,
            'type'  => 'title',
            'desc'  => '',
            'id'    => 'stachesepl_pdf_attachments',
        ];

        $settings[] = [
            'title'    => esc_html__('Enable PDF Attachments', 'stachethemes-seat-planner-lite')
,
            'desc'     => esc_html__('Attach a PDF with ticket details and a QR code to each Completed Order email.', 'stachethemes-seat-planner-lite')
,
            'id'       => 'stachesepl_pdf_attachments',
            'type'     => 'checkbox',
            'default'  => 'yes',
        ];

        $settings[] = [
            'type' => 'sectionend',
            'id'   => 'stachesepl_pdf_attachments',
        ];

        return $settings;
    }

    public static function save_settings($settings) {

        $nonce_value = isset($_POST['_wpnonce']) ? wp_unslash($_POST['_wpnonce']) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

        if (!wp_verify_nonce($nonce_value, 'woocommerce-settings')) {
            return;
        }

        $pdf_attachments = isset($_POST['stachesepl_pdf_attachments']) ? 'yes' : 'no';

        update_option('stachesepl_pdf_attachments', $pdf_attachments);

    }
}

PDF_Attachments::init();
