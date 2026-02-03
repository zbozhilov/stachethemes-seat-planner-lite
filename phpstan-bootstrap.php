<?php

/**
 * PHPStan bootstrap: defines constants so analysed files don't fail on undefined symbols.
 * This file is loaded by PHPStan before analysing the codebase.
 */

if (! defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}
// WordPress sets these at runtime; PHPStan needs them declared (defined in WP core).
if (! defined('COOKIEPATH')) {
    define('COOKIEPATH', '/');
}
if (! defined('COOKIE_DOMAIN')) {
    define('COOKIE_DOMAIN', '');
}

$plugin_file = __DIR__ . '/stachethemes-seat-planner.php';
if (! defined('STACHETHEMES_SEAT_PLANNER_VERSION')) {
    define('STACHETHEMES_SEAT_PLANNER_VERSION', '1.4.1');
}
if (! defined('STACHETHEMES_SEAT_PLANNER_PLUGIN_DIR')) {
    define('STACHETHEMES_SEAT_PLANNER_PLUGIN_DIR', __DIR__ . '/');
}
if (! defined('STACHETHEMES_SEAT_PLANNER_PLUGIN_URL')) {
    define('STACHETHEMES_SEAT_PLANNER_PLUGIN_URL', 'https://example.com/wp-content/plugins/stachethemes-seat-planner/');
}
if (! defined('STACHETHEMES_SEAT_PLANNER_PLUGIN_BASENAME')) {
    define('STACHETHEMES_SEAT_PLANNER_PLUGIN_BASENAME', 'stachethemes-seat-planner/stachethemes-seat-planner.php');
}
if (! defined('STACHETHEMES_SEAT_PLANNER_PLUGIN_FILE')) {
    define('STACHETHEMES_SEAT_PLANNER_PLUGIN_FILE', $plugin_file);
}

require_once __DIR__ . '/vendor/autoload.php';

// WordPress stubs first (WooCommerce stubs depend on WP_* classes)
$wp_stubs = __DIR__ . '/vendor/php-stubs/wordpress-stubs/wordpress-stubs.php';
if (file_exists($wp_stubs)) {
    require_once $wp_stubs;
}
// WooCommerce stubs (package has no autoload; load so PHPStan knows wc_* and WC_* symbols)
// Order matters: woocommerce-stubs.php defines WP_Async_Request used by woocommerce-packages-stubs.php
$woo_stubs = __DIR__ . '/vendor/php-stubs/woocommerce-stubs';
if (is_dir($woo_stubs)) {
    require_once $woo_stubs . '/woocommerce-stubs.php';
    require_once $woo_stubs . '/woocommerce-packages-stubs.php';
}
