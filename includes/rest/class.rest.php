<?php

namespace StachethemesSeatPlannerLite\Rest;

use StachethemesSeatPlannerLite\Settings;

if (! defined('ABSPATH')) {
    exit;
}

class Rest_Register {

    private const ROUTE_NAMESPACE = 'stachesepl';

    public static function init(): void {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    /**
     * @param \WP_REST_Request<array<string, mixed>> $request
     * @return bool|\WP_Error
     */
    public static function get_permission_callback(\WP_REST_Request $request) {
        
        $enabled    = Settings::get_setting('stachesepl_app_enabled');
        $secret_key = Settings::get_setting('stachesepl_app_secret_key');

        if ($enabled !== 'yes' || $secret_key === '') {
            return new \WP_Error('stachesepl_disabled', esc_html__('Seat Planner app access is disabled.', 'stachethemes-seat-planner-lite'), ['status' => 403]);
        }

        $header = $request->get_header('x-stachesepl-secret-key');
        $provided_secret = trim(is_string($header) ? $header : '');

        if (!hash_equals($secret_key, $provided_secret)) {
            return new \WP_Error('invalid_secret_key', esc_html__('Invalid secret key.', 'stachethemes-seat-planner-lite'), ['status' => 403]);
        }

        return true;
    }

    public static function register_routes(): void {
        register_rest_route(
            self::ROUTE_NAMESPACE,
            '/status',
            [
                'methods'  => 'GET',
                'callback' => [__CLASS__, 'handle_status'],
                'permission_callback' => [__CLASS__, 'get_permission_callback'],
            ]
        );

        register_rest_route(
            self::ROUTE_NAMESPACE,
            '/validate-qrcode',
            [
                'methods'  => 'POST',
                'callback' => [__CLASS__, 'handle_validate_qrcode'],
                'permission_callback' => [__CLASS__, 'get_permission_callback'],
                'args'     => [
                    'qrcode' => [
                        'required' => true,
                        'type'     => 'string',
                    ],
                ],
            ]
        );
    }

    /**
     * @param \WP_REST_Request<array<string, mixed>> $request
     */
    public static function handle_status(\WP_REST_Request $request): \WP_REST_Response {
        return rest_ensure_response([
            'plugin' => 'stachethemes-seat-planner-lite',
            'status' => 'ok',
            'time'   => time(),
        ]);
    }

    /**
     * @param \WP_REST_Request<array<string, mixed>> $request
     * @return \WP_REST_Response|\WP_Error
     */
    public static function handle_validate_qrcode(\WP_REST_Request $request) {

        $qrcode_text = (string) $request->get_param('qrcode');

        if ($qrcode_text === '') {
            return new \WP_Error('missing_qrcode', esc_html__('Missing qrcode.', 'stachethemes-seat-planner-lite'), ['status' => 400]);
        }

        $provided_admin_name = trim((string) $request->get_header('x-stachesepl-admin-name'));
        $decoded             = \StachethemesSeatPlannerLite\QRCode::get_decode_qr_code_text($qrcode_text, true, $provided_admin_name);

        if ((int) ($decoded['order_id'] ?? 0) <= 0) {
            return new \WP_Error('invalid_qrcode', esc_html__('Invalid QR code.', 'stachethemes-seat-planner-lite'), ['status' => 400]);
        }

        return rest_ensure_response([
            'ok'   => true,
            'data' => $decoded,
        ]);

    }
}

Rest_Register::init();
