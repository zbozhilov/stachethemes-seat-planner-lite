<?php declare(strict_types = 1);

// odsl-/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/dashboard/class.manager-service.php-PHPStan\BetterReflection\Reflection\ReflectionClass-StachethemesSeatPlannerLite\Manager_Service
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.65.0.9-8.3.6-93e752d1636e590b9e0bccd27d31fdecec8f4ac18c828bad0f3d061534686ca6',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'filename' => '/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/dashboard/class.manager-service.php',
      ),
    ),
    'namespace' => 'StachethemesSeatPlannerLite',
    'name' => 'StachethemesSeatPlannerLite\\Manager_Service',
    'shortName' => 'Manager_Service',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => '/**
 * Manager service
 *
 * Encapsulates Manager-related business logic used by the AJAX controller.
 * All methods return a normalized array in the form:
 * [
 *   \'success\' => bool,
 *   \'data\'    => mixed|null,
 *   \'error\'   => string|null,
 * ]
 *
 * The Ajax controller is responsible for permissions, request parsing,
 * and translating these results into wp_send_json_* responses.
 */',
    'attributes' => 
    array (
    ),
    'startLine' => 23,
    'endLine' => 569,
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
      'get_auditorium_product' => 
      array (
        'name' => 'get_auditorium_product',
        'parameters' => 
        array (
          'product_id' => 
          array (
            'name' => 'product_id',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'int',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 33,
            'endLine' => 33,
            'startColumn' => 51,
            'endColumn' => 65,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'include_dates' => 
          array (
            'name' => 'include_dates',
            'default' => 
            array (
              'code' => 'false',
              'attributes' => 
              array (
                'startLine' => 33,
                'endLine' => 33,
                'startTokenPos' => 54,
                'startFilePos' => 838,
                'endTokenPos' => 54,
                'endFilePos' => 842,
              ),
            ),
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'bool',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 33,
            'endLine' => 33,
            'startColumn' => 68,
            'endColumn' => 94,
            'parameterIndex' => 1,
            'isOptional' => true,
          ),
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
 * Get a single Auditorium product payload for the Manager UI.
 *
 * @param int    $product_id
 * @param bool   $include_dates Whether to include dates array when product has dates.
 *
 * @return array
 */',
        'startLine' => 33,
        'endLine' => 74,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => true,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'aliasName' => NULL,
      ),
      'get_auditorium_products' => 
      array (
        'name' => 'get_auditorium_products',
        'parameters' => 
        array (
          'search' => 
          array (
            'name' => 'search',
            'default' => 
            array (
              'code' => '\'\'',
              'attributes' => 
              array (
                'startLine' => 85,
                'endLine' => 85,
                'startTokenPos' => 376,
                'startFilePos' => 2602,
                'endTokenPos' => 376,
                'endFilePos' => 2603,
              ),
            ),
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'string',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 85,
            'endLine' => 85,
            'startColumn' => 52,
            'endColumn' => 70,
            'parameterIndex' => 0,
            'isOptional' => true,
          ),
          'page' => 
          array (
            'name' => 'page',
            'default' => 
            array (
              'code' => '1',
              'attributes' => 
              array (
                'startLine' => 85,
                'endLine' => 85,
                'startTokenPos' => 385,
                'startFilePos' => 2618,
                'endTokenPos' => 385,
                'endFilePos' => 2618,
              ),
            ),
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'int',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 85,
            'endLine' => 85,
            'startColumn' => 73,
            'endColumn' => 85,
            'parameterIndex' => 1,
            'isOptional' => true,
          ),
          'per_page' => 
          array (
            'name' => 'per_page',
            'default' => 
            array (
              'code' => '10',
              'attributes' => 
              array (
                'startLine' => 85,
                'endLine' => 85,
                'startTokenPos' => 394,
                'startFilePos' => 2637,
                'endTokenPos' => 394,
                'endFilePos' => 2638,
              ),
            ),
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'int',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 85,
            'endLine' => 85,
            'startColumn' => 88,
            'endColumn' => 105,
            'parameterIndex' => 2,
            'isOptional' => true,
          ),
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
 * Get paginated Auditorium products list for the Manager listing.
 *
 * @param string $search
 * @param int    $page
 * @param int    $per_page
 *
 * @return array
 */',
        'startLine' => 85,
        'endLine' => 157,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'aliasName' => NULL,
      ),
      'update_manager_seat_override' => 
      array (
        'name' => 'update_manager_seat_override',
        'parameters' => 
        array (
          'product_id' => 
          array (
            'name' => 'product_id',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'int',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 171,
            'endLine' => 171,
            'startColumn' => 57,
            'endColumn' => 71,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'seat_id' => 
          array (
            'name' => 'seat_id',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'string',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 171,
            'endLine' => 171,
            'startColumn' => 74,
            'endColumn' => 88,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
          'selected_date' => 
          array (
            'name' => 'selected_date',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'string',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 171,
            'endLine' => 171,
            'startColumn' => 91,
            'endColumn' => 111,
            'parameterIndex' => 2,
            'isOptional' => false,
          ),
          'status' => 
          array (
            'name' => 'status',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'string',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 171,
            'endLine' => 171,
            'startColumn' => 114,
            'endColumn' => 127,
            'parameterIndex' => 3,
            'isOptional' => false,
          ),
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
 * Update a Manager seat override for an Auditorium product.
 *
 * This mirrors the existing behavior used by the Manager seat override UI.
 *
 * @param int    $product_id
 * @param string $seat_id
 * @param string $selected_date
 * @param string $status
 *
 * @return array
 */',
        'startLine' => 171,
        'endLine' => 273,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => true,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'aliasName' => NULL,
      ),
      'get_order_auditorium_items' => 
      array (
        'name' => 'get_order_auditorium_items',
        'parameters' => 
        array (
          'order_id' => 
          array (
            'name' => 'order_id',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'int',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 285,
            'endLine' => 285,
            'startColumn' => 55,
            'endColumn' => 67,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
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
 * Get auditorium items from an order.
 *
 * Returns all order items that have seat_data meta, along with their
 * associated auditorium product information.
 *
 * @param int $order_id
 *
 * @return array
 */',
        'startLine' => 285,
        'endLine' => 344,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => true,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'aliasName' => NULL,
      ),
      'update_order_item_meta' => 
      array (
        'name' => 'update_order_item_meta',
        'parameters' => 
        array (
          'order_id' => 
          array (
            'name' => 'order_id',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'int',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 357,
            'endLine' => 357,
            'startColumn' => 51,
            'endColumn' => 63,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'updates' => 
          array (
            'name' => 'updates',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'array',
                'isIdentifier' => true,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 357,
            'endLine' => 357,
            'startColumn' => 66,
            'endColumn' => 79,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
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
 * Update order item metadata (seat_data) for auditorium products.
 *
 * Handles validation, sanitization, and updating taken seats when
 * seat ID or date changes for orders in \'completed\' or \'processing\' status.
 *
 * @param int   $order_id
 * @param array $updates Array of update objects, each with \'item_id\' and \'seat_data\'.
 *
 * @return array
 */',
        'startLine' => 357,
        'endLine' => 568,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => true,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Manager_Service',
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