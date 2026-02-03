<?php

/**
 * WordPress 6.9 Abilities API integration for Stachethemes Seat Planner.
 * 
 * Registers abilities that expose seat planning functionality in a
 * standardized, machine-readable format for AI and automation tools.
 * 
 * @see https://make.wordpress.org/core/2025/11/10/abilities-api-in-wordpress-6-9/
 * @since 1.1.0
 */

namespace StachethemesSeatPlannerLite;

if (!defined('ABSPATH')) {
    exit;
}
class Abilities {

    /**
     * Initialize abilities registration.
     */
    public static function init(): void {

    }
}

Abilities::init();