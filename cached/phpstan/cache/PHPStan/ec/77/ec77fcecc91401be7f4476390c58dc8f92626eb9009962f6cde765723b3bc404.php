<?php declare(strict_types = 1);

// odsl-/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/class.wp-dashboard.php-PHPStan\BetterReflection\Reflection\ReflectionClass-StachethemesSeatPlannerLite\WP_Dashboard
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.65.0.9-8.3.6-4beae1004dfd0642723a7a4d40d2836f3409d997f6de90575d7f88494b69eaf2',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'filename' => '/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/class.wp-dashboard.php',
      ),
    ),
    'namespace' => 'StachethemesSeatPlannerLite',
    'name' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
    'shortName' => 'WP_Dashboard',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => '/**
 * This class displays cards on the WordPress dashboard.
 * It displays a card with the number of seats sold and revenue generated in the last 30 days.
 */',
    'attributes' => 
    array (
    ),
    'startLine' => 13,
    'endLine' => 226,
    'startColumn' => 1,
    'endColumn' => 1,
    'parentClassName' => NULL,
    'implementsClassNames' => 
    array (
    ),
    'traitClassNames' => 
    array (
    ),
    'immediateConstants' => 
    array (
    ),
    'immediateProperties' => 
    array (
    ),
    'immediateMethods' => 
    array (
      'init' => 
      array (
        'name' => 'init',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Initialize the dashboard widget.
 */',
        'startLine' => 18,
        'endLine' => 23,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'currentClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'aliasName' => NULL,
      ),
      'register_widget' => 
      array (
        'name' => 'register_widget',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Register the dashboard widget.
 */',
        'startLine' => 28,
        'endLine' => 34,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'currentClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'aliasName' => NULL,
      ),
      'render_widget' => 
      array (
        'name' => 'render_widget',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Render the dashboard widget content.
 */',
        'startLine' => 39,
        'endLine' => 72,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'currentClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'aliasName' => NULL,
      ),
      'get_seats_and_revenue_stats' => 
      array (
        'name' => 'get_seats_and_revenue_stats',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'array',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get both seats sold count and revenue for the last 30 days.
 * Results are cached for 5 minutes to improve performance.
 *
 * @return array{seats_sold: int, revenue: float} Array with seats_sold count and revenue total.
 */',
        'startLine' => 80,
        'endLine' => 139,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 20,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'currentClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'aliasName' => NULL,
      ),
      'add_admin_bar_menu' => 
      array (
        'name' => 'add_admin_bar_menu',
        'parameters' => 
        array (
          'wp_admin_bar' => 
          array (
            'name' => 'wp_admin_bar',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 146,
            'endLine' => 146,
            'startColumn' => 47,
            'endColumn' => 59,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Add a menu item to the WordPress admin bar.
 *
 * @param \\WP_Admin_Bar $wp_admin_bar The WordPress admin bar object.
 */',
        'startLine' => 146,
        'endLine' => 162,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'currentClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'aliasName' => NULL,
      ),
      'add_admin_bar_styles' => 
      array (
        'name' => 'add_admin_bar_styles',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Add custom styles for the admin bar menu item.
 */',
        'startLine' => 167,
        'endLine' => 225,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'currentClassName' => 'StachethemesSeatPlannerLite\\WP_Dashboard',
        'aliasName' => NULL,
      ),
    ),
    'traitsData' => 
    array (
      'aliases' => 
      array (
      ),
      'modifiers' => 
      array (
      ),
      'precedences' => 
      array (
      ),
      'hashes' => 
      array (
      ),
    ),
  ),
));