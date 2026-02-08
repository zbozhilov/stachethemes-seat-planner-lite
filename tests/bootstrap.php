<?php

/**
 * PHPUnit bootstrap file for Custom Fields Validation tests
 */

// Define WordPress constants required by the trait
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__) . '/');
}

// Mock WordPress functions used by the trait
if (!function_exists('__')) {
    // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
    function __($text, $domain = 'default') {
        return $text;
    }
}

if (!function_exists('esc_html__')) {
    // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
    function esc_html__($text, $domain = 'default') {
        return $text;
    }
}

if (!function_exists('esc_html')) {
    // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
    function esc_html($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('sprintf')) {
    function sprintf($format, ...$args) {
        return vsprintf($format, $args);
    }
}

// Autoloader
require_once __DIR__ . '/../vendor/autoload.php';