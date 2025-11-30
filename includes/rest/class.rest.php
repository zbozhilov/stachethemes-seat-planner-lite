<?php

namespace Stachethemes\SeatPlannerLite\Rest;

if (! defined('ABSPATH')) {
    exit;
}

class Rest_Register {

    private const ROUTE_NAMESPACE = 'stachesepl';

    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    public static function get_permission_callback($request) {
        
        $enabled    = get_option('stachesepl_app_enabled', 'yes');
        $secret_key = get_option('stachesepl_app_secret_key', '');

        if ($enabled !== 'yes' || $secret_key === '') {
            return new \WP_Error('stachesepl_disabled', esc_html__('Seat Planner app access is disabled.', 'stachethemes-seat-planner-lite')
, ['status' => 403]);
        }

        $provided_secret = trim((string) $request->get_header('x-stachesepl-secret-key'));

        if (!hash_equals($secret_key, $provided_secret)) {
            return new \WP_Error('invalid_secret_key', esc_html__('Invalid secret key.', 'stachethemes-seat-planner-lite')
, ['status' => 403]);
        }

        return true;
    }

    public static function register_routes() {
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

    public static function handle_status($request) {
        return rest_ensure_response([
            'plugin' => 'stachethemes-seat-planner',
            'status' => 'ok',
            'time'   => time(),
        ]);
    }

    public static function handle_validate_qrcode($request) {

        $qrcode_text = (string) $request->get_param('qrcode');

        if ($qrcode_text === '') {
            return new \WP_Error('missing_qrcode', esc_html__('Missing qrcode.', 'stachethemes-seat-planner-lite')
, ['status' => 400]);
        }

        $provided_admin_name = trim((string) $request->get_header('x-stachesepl-admin-name'));
        $decoded             = \Stachethemes\SeatPlannerLite\QRCode::get_decode_qr_code_text($qrcode_text, true, $provided_admin_name);

        if (!is_array($decoded) || (int) ($decoded['order_id'] ?? 0) <= 0) {
            return new \WP_Error('invalid_qrcode', esc_html__('Invalid QR code.', 'stachethemes-seat-planner-lite')
, ['status' => 400]);
        }

        return rest_ensure_response([
            'ok'   => true,
            'data' => $decoded,
        ]);

    }
}

Rest_Register::init();
