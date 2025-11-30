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

    }

    public static function add_settings($settings) {

        $settings[] = [
            'title' => esc_html__('Seat Planner Attachments', 'stachethemes-seat-planner-lite'),
            'type'  => 'title',
            'desc'  => '',
            'id'    => 'stachesepl_pdf_attachments',
        ];

        $settings[] = [
            'title'    => esc_html__('Enable PDF Attachments', 'stachethemes-seat-planner-lite'),
            'desc'     => esc_html__('Attach a PDF with ticket details and a QR code to each Completed Order email. (Not available in Lite version)', 'stachethemes-seat-planner-lite'),
            'id'       => 'stachesepl_pdf_attachments_lite',
            'type'     => 'checkbox',
            'default'  => 'no',
            'disabled' => true,
        ];

        $settings[] = [
            'type' => 'sectionend',
            'id'   => 'stachesepl_pdf_attachments_lite',
        ];

        return $settings;
    }

}

PDF_Attachments::init();
