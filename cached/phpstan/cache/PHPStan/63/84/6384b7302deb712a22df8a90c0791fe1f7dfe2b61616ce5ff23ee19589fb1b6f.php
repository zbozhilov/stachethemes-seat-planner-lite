<?php declare(strict_types = 1);

// odsl-/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/tools/check-ghost-booking/class.check-ghost-booking.php-PHPStan\BetterReflection\Reflection\ReflectionClass-StachethemesSeatPlannerLite\Check_Ghost_Booking
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.65.0.9-8.3.6-2f89533c69b5e4dcb6722de94449429bd5e28f68d24744b5e7b0c773fd3ac429',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'filename' => '/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/tools/check-ghost-booking/class.check-ghost-booking.php',
      ),
    ),
    'namespace' => 'StachethemesSeatPlannerLite',
    'name' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
    'shortName' => 'Check_Ghost_Booking',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => '/**
 * Ghost Booking Checker
 * 
 * Detects seats that appear "free" on the front-end but actually have orders 
 * associated with them. This indicates a data inconsistency where the seat\'s 
 * "_taken_seat" meta is missing but there\'s an order claiming that seat.
 */',
    'attributes' => 
    array (
    ),
    'startLine' => 12,
    'endLine' => 268,
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
      'get_orders_by_product_id' => 
      array (
        'name' => 'get_orders_by_product_id',
        'parameters' => 
        array (
          'product_id' => 
          array (
            'name' => 'product_id',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 17,
            'endLine' => 17,
            'startColumn' => 54,
            'endColumn' => 64,
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
 * Get all orders for a specific product that contain seat bookings
 */',
        'startLine' => 17,
        'endLine' => 44,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 20,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'aliasName' => NULL,
      ),
      'get_order_items' => 
      array (
        'name' => 'get_order_items',
        'parameters' => 
        array (
          'order' => 
          array (
            'name' => 'order',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 49,
            'endLine' => 49,
            'startColumn' => 45,
            'endColumn' => 50,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'filter_by_product_id' => 
          array (
            'name' => 'filter_by_product_id',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 49,
            'endLine' => 49,
            'startColumn' => 53,
            'endColumn' => 73,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Extract seat data from order items
 */',
        'startLine' => 49,
        'endLine' => 84,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 20,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'aliasName' => NULL,
      ),
      'get_auditorium_product_ids' => 
      array (
        'name' => 'get_auditorium_product_ids',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get all auditorium product IDs
 */',
        'startLine' => 89,
        'endLine' => 98,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'aliasName' => NULL,
      ),
      'get_taken_seats_from_meta' => 
      array (
        'name' => 'get_taken_seats_from_meta',
        'parameters' => 
        array (
          'product' => 
          array (
            'name' => 'product',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 103,
            'endLine' => 103,
            'startColumn' => 55,
            'endColumn' => 62,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'selected_date' => 
          array (
            'name' => 'selected_date',
            'default' => 
            array (
              'code' => '\'\'',
              'attributes' => 
              array (
                'startLine' => 103,
                'endLine' => 103,
                'startTokenPos' => 494,
                'startFilePos' => 2912,
                'endTokenPos' => 494,
                'endFilePos' => 2913,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 103,
            'endLine' => 103,
            'startColumn' => 65,
            'endColumn' => 83,
            'parameterIndex' => 1,
            'isOptional' => true,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get taken seats from product meta for a specific date
 */',
        'startLine' => 103,
        'endLine' => 126,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 20,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'aliasName' => NULL,
      ),
      'get_unique_dates_from_orders' => 
      array (
        'name' => 'get_unique_dates_from_orders',
        'parameters' => 
        array (
          'orders' => 
          array (
            'name' => 'orders',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 131,
            'endLine' => 131,
            'startColumn' => 58,
            'endColumn' => 64,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'product_id' => 
          array (
            'name' => 'product_id',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 131,
            'endLine' => 131,
            'startColumn' => 67,
            'endColumn' => 77,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get all unique dates from orders for a product
 */',
        'startLine' => 131,
        'endLine' => 146,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 20,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'aliasName' => NULL,
      ),
      'check_product_for_ghost_booking' => 
      array (
        'name' => 'check_product_for_ghost_booking',
        'parameters' => 
        array (
          'product_id' => 
          array (
            'name' => 'product_id',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 151,
            'endLine' => 151,
            'startColumn' => 60,
            'endColumn' => 70,
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
 * Check a product for ghost bookings (seats with orders that appear free)
 */',
        'startLine' => 151,
        'endLine' => 232,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'aliasName' => NULL,
      ),
      'get_ghost_bookings_for_products' => 
      array (
        'name' => 'get_ghost_bookings_for_products',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Check all auditorium products for ghost bookings
 */',
        'startLine' => 237,
        'endLine' => 248,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'aliasName' => NULL,
      ),
      'fix_ghost_booking' => 
      array (
        'name' => 'fix_ghost_booking',
        'parameters' => 
        array (
          'product_id' => 
          array (
            'name' => 'product_id',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 253,
            'endLine' => 253,
            'startColumn' => 46,
            'endColumn' => 56,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'seat_id' => 
          array (
            'name' => 'seat_id',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 253,
            'endLine' => 253,
            'startColumn' => 59,
            'endColumn' => 66,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
          'selected_date' => 
          array (
            'name' => 'selected_date',
            'default' => 
            array (
              'code' => '\'\'',
              'attributes' => 
              array (
                'startLine' => 253,
                'endLine' => 253,
                'startTokenPos' => 1346,
                'startFilePos' => 8191,
                'endTokenPos' => 1346,
                'endFilePos' => 8192,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 253,
            'endLine' => 253,
            'startColumn' => 69,
            'endColumn' => 87,
            'parameterIndex' => 2,
            'isOptional' => true,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Fix ghost booking by adding the seat to the taken meta
 */',
        'startLine' => 253,
        'endLine' => 267,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Check_Ghost_Booking',
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