<?php

namespace StachethemesSeatPlannerLite;

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

        if (Settings::get_setting('stachesepl_pdf_attachments') === 'yes') {
            add_filter('woocommerce_email_attachments', [__CLASS__, 'attach_pdf_to_completed_order_email'], 10, 3);
            add_filter('stachesepl_pdf_file_name', [__CLASS__, 'customize_pdf_filename'], 10, 2);
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

    public static function customize_pdf_filename($filename, $order_id) {
        $custom_name = Settings::get_setting('stachesepl_pdf_attachment_name');
        
        if (empty($custom_name)) {
            return $filename;
        }

        // Remove .pdf extension if user added it, we'll add it back
        $custom_name = preg_replace('/\.pdf$/i', '', $custom_name);
        
        // Sanitize filename to prevent directory traversal and invalid characters
        $custom_filename = sanitize_file_name($custom_name);
        
        // Always append .pdf extension
        $custom_filename .= '.pdf';

        return $custom_filename;
    }

}

PDF_Attachments::init();
