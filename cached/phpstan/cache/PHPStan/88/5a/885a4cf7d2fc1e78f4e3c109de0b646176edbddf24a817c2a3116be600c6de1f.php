<?php declare(strict_types = 1);

// odsl-/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/woocommerce/product/product_traits/trait.manager-overrides.php-PHPStan\BetterReflection\Reflection\ReflectionClass-StachethemesSeatPlannerLite\Product_Traits\Manager_Overrides
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.65.0.9-8.3.6-721e9cfb29ccc885ef58a9de3b8c03db170bee3cc28ac22af557074f5eab9413',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'filename' => '/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/woocommerce/product/product_traits/trait.manager-overrides.php',
      ),
    ),
    'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
    'name' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
    'shortName' => 'Manager_Overrides',
    'isInterface' => false,
    'isTrait' => true,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => '/**
 * Trait for handling manager overrides
 * Allows managers to override seat availability and status
 */',
    'attributes' => 
    array (
    ),
    'startLine' => 13,
    'endLine' => 298,
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
      'manager_overrides' => 
      array (
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'name' => 'manager_overrides',
        'modifiers' => 2,
        'type' => NULL,
        'default' => 
        array (
          'code' => '[]',
          'attributes' => 
          array (
            'startLine' => 20,
            'endLine' => 20,
            'startTokenPos' => 41,
            'startFilePos' => 350,
            'endTokenPos' => 42,
            'endFilePos' => 351,
          ),
        ),
        'docComment' => '/**
 * Cache for manager overrides
 * 
 * @var array
 */',
        'attributes' => 
        array (
        ),
        'startLine' => 20,
        'endLine' => 20,
        'startColumn' => 5,
        'endColumn' => 38,
        'isPromoted' => false,
        'declaredAtCompileTime' => true,
        'immediateVirtual' => false,
        'immediateHooks' => 
        array (
        ),
      ),
    ),
    'immediateMethods' => 
    array (
      'get_manager_overrides' => 
      array (
        'name' => 'get_manager_overrides',
        'parameters' => 
        array (
          'selected_date' => 
          array (
            'name' => 'selected_date',
            'default' => 
            array (
              'code' => '\'\'',
              'attributes' => 
              array (
                'startLine' => 38,
                'endLine' => 38,
                'startTokenPos' => 57,
                'startFilePos' => 840,
                'endTokenPos' => 57,
                'endFilePos' => 841,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 38,
            'endLine' => 38,
            'startColumn' => 43,
            'endColumn' => 61,
            'parameterIndex' => 0,
            'isOptional' => true,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get manager overrides for a selected date
 * 
 * Expect array structure: 
 * Array
 * (
 *      // override- is prefixed to ensure the key is a string
 *      [\'override-\' . $seat_id] => [
 *          \'status\' => \'available\' | \'unavailable\' | \'sold-out\' | \'on-site\'
 *      ]
 *      ...
 * )
 * 
 * @param string $selected_date
 * @return array|null
 */',
        'startLine' => 38,
        'endLine' => 60,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'get_manager_seat_overrides' => 
      array (
        'name' => 'get_manager_seat_overrides',
        'parameters' => 
        array (
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
            'startLine' => 69,
            'endLine' => 69,
            'startColumn' => 48,
            'endColumn' => 55,
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
                'startLine' => 69,
                'endLine' => 69,
                'startTokenPos' => 196,
                'startFilePos' => 1695,
                'endTokenPos' => 196,
                'endFilePos' => 1696,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 69,
            'endLine' => 69,
            'startColumn' => 58,
            'endColumn' => 76,
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
 * Get manager seat overrides for a specific seat
 * 
 * @param string $seat_id
 * @param string $selected_date
 * @return array|null
 */',
        'startLine' => 69,
        'endLine' => 75,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'get_manager_seat_override' => 
      array (
        'name' => 'get_manager_seat_override',
        'parameters' => 
        array (
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
            'startLine' => 85,
            'endLine' => 85,
            'startColumn' => 47,
            'endColumn' => 54,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'key' => 
          array (
            'name' => 'key',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 85,
            'endLine' => 85,
            'startColumn' => 57,
            'endColumn' => 60,
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
                'startLine' => 85,
                'endLine' => 85,
                'startTokenPos' => 271,
                'startFilePos' => 2176,
                'endTokenPos' => 271,
                'endFilePos' => 2177,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 85,
            'endLine' => 85,
            'startColumn' => 63,
            'endColumn' => 81,
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
 * Get a specific manager seat override value
 * 
 * @param string $seat_id
 * @param string $key
 * @param string $selected_date
 * @return mixed
 */',
        'startLine' => 85,
        'endLine' => 91,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'update_manager_seat_override' => 
      array (
        'name' => 'update_manager_seat_override',
        'parameters' => 
        array (
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
            'startLine' => 101,
            'endLine' => 101,
            'startColumn' => 50,
            'endColumn' => 57,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'override_data' => 
          array (
            'name' => 'override_data',
            'default' => 
            array (
              'code' => '[]',
              'attributes' => 
              array (
                'startLine' => 101,
                'endLine' => 101,
                'startTokenPos' => 346,
                'startFilePos' => 2669,
                'endTokenPos' => 347,
                'endFilePos' => 2670,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 101,
            'endLine' => 101,
            'startColumn' => 60,
            'endColumn' => 78,
            'parameterIndex' => 1,
            'isOptional' => true,
          ),
          'selected_date' => 
          array (
            'name' => 'selected_date',
            'default' => 
            array (
              'code' => '\'\'',
              'attributes' => 
              array (
                'startLine' => 101,
                'endLine' => 101,
                'startTokenPos' => 354,
                'startFilePos' => 2690,
                'endTokenPos' => 354,
                'endFilePos' => 2691,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 101,
            'endLine' => 101,
            'startColumn' => 81,
            'endColumn' => 99,
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
 * Update a seat override. Used by the Manager
 * 
 * @param string $seat_id
 * @param array $override_data
 * @param string $selected_date
 * @return void
 */',
        'startLine' => 101,
        'endLine' => 116,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'delete_manager_seat_override' => 
      array (
        'name' => 'delete_manager_seat_override',
        'parameters' => 
        array (
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
            'startLine' => 125,
            'endLine' => 125,
            'startColumn' => 50,
            'endColumn' => 57,
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
                'startLine' => 125,
                'endLine' => 125,
                'startTokenPos' => 474,
                'startFilePos' => 3449,
                'endTokenPos' => 474,
                'endFilePos' => 3450,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 125,
            'endLine' => 125,
            'startColumn' => 60,
            'endColumn' => 78,
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
 * Delete a seat override. Used by the Manager
 * 
 * @param string $seat_id
 * @param string $selected_date
 * @return void
 */',
        'startLine' => 125,
        'endLine' => 134,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'set_manager_overrides' => 
      array (
        'name' => 'set_manager_overrides',
        'parameters' => 
        array (
          'selected_date' => 
          array (
            'name' => 'selected_date',
            'default' => 
            array (
              'code' => '\'\'',
              'attributes' => 
              array (
                'startLine' => 144,
                'endLine' => 144,
                'startTokenPos' => 563,
                'startFilePos' => 4105,
                'endTokenPos' => 563,
                'endFilePos' => 4106,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 144,
            'endLine' => 144,
            'startColumn' => 43,
            'endColumn' => 61,
            'parameterIndex' => 0,
            'isOptional' => true,
          ),
          'overrides' => 
          array (
            'name' => 'overrides',
            'default' => 
            array (
              'code' => '[]',
              'attributes' => 
              array (
                'startLine' => 144,
                'endLine' => 144,
                'startTokenPos' => 570,
                'startFilePos' => 4122,
                'endTokenPos' => 571,
                'endFilePos' => 4123,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 144,
            'endLine' => 144,
            'startColumn' => 64,
            'endColumn' => 78,
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
 * Set the manager overrides. Used by the Manager
 * 
 * @param string $selected_date
 * @param array $overrides
 * @return void
 * @throws \\Exception If override data structure is invalid
 */',
        'startLine' => 144,
        'endLine' => 188,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => true,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'get_manager_override_meta_keys' => 
      array (
        'name' => 'get_manager_override_meta_keys',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Get all meta keys for manager overrides (including date-specific ones)
 * 
 * @return array List of meta keys
 */',
        'startLine' => 195,
        'endLine' => 208,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'cleanup_stale_manager_overrides' => 
      array (
        'name' => 'cleanup_stale_manager_overrides',
        'parameters' => 
        array (
          'valid_seat_ids' => 
          array (
            'name' => 'valid_seat_ids',
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
            'startLine' => 217,
            'endLine' => 217,
            'startColumn' => 53,
            'endColumn' => 73,
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
 * Cleanup manager overrides for seats that no longer exist in the seat plan.
 * Should be called after saving the seat plan data.
 * 
 * @param array $valid_seat_ids Array of seat IDs that exist in the current seat plan
 * @return void
 */',
        'startLine' => 217,
        'endLine' => 279,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'aliasName' => NULL,
      ),
      'apply_seat_object_overrides' => 
      array (
        'name' => 'apply_seat_object_overrides',
        'parameters' => 
        array (
          'seat_object' => 
          array (
            'name' => 'seat_object',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 288,
            'endLine' => 288,
            'startColumn' => 49,
            'endColumn' => 60,
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
 * Apply seat object overrides
 * 
 * @param object $seat_object
 * @param string $selected_date
 * @return object
 */',
        'startLine' => 288,
        'endLine' => 297,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'StachethemesSeatPlannerLite\\Product_Traits',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Product_Traits\\Manager_Overrides',
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