<?php declare(strict_types = 1);

// odsl-/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/woocommerce/product/filters/class.auditorium-product-cart-validation.php-PHPStan\BetterReflection\Reflection\ReflectionClass-StachethemesSeatPlannerLite\Auditorium_Product_Cart_Validation
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.65.0.9-8.3.6-b9bebdbc648c6b03b948ee89ed287830041903fdfd503aa7051534a0eb6d36da',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'filename' => '/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/woocommerce/product/filters/class.auditorium-product-cart-validation.php',
      ),
    ),
    'namespace' => 'StachethemesSeatPlannerLite',
    'name' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
    'shortName' => 'Auditorium_Product_Cart_Validation',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => NULL,
    'attributes' => 
    array (
    ),
    'startLine' => 9,
    'endLine' => 150,
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
      'did_init' => 
      array (
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'name' => 'did_init',
        'modifiers' => 20,
        'type' => NULL,
        'default' => 
        array (
          'code' => 'false',
          'attributes' => 
          array (
            'startLine' => 11,
            'endLine' => 11,
            'startTokenPos' => 38,
            'startFilePos' => 162,
            'endTokenPos' => 38,
            'endFilePos' => 166,
          ),
        ),
        'docComment' => NULL,
        'attributes' => 
        array (
        ),
        'startLine' => 11,
        'endLine' => 11,
        'startColumn' => 5,
        'endColumn' => 37,
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
        'docComment' => NULL,
        'startLine' => 13,
        'endLine' => 22,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'aliasName' => NULL,
      ),
      'maybe_remove_items_from_cart' => 
      array (
        'name' => 'maybe_remove_items_from_cart',
        'parameters' => 
        array (
          'cart' => 
          array (
            'name' => 'cart',
            'default' => 
            array (
              'code' => 'null',
              'attributes' => 
              array (
                'startLine' => 30,
                'endLine' => 30,
                'startTokenPos' => 132,
                'startFilePos' => 862,
                'endTokenPos' => 132,
                'endFilePos' => 865,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 30,
            'endLine' => 30,
            'startColumn' => 57,
            'endColumn' => 68,
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
 * Logic that fires when the cart is loaded, it determines if any items should be removed from the cart
 * If the seat is reserved by another user, it will be removed from the cart
 * @param WC_Cart $cart
 * @return void
 */',
        'startLine' => 30,
        'endLine' => 64,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'aliasName' => NULL,
      ),
      'validate_cart_items' => 
      array (
        'name' => 'validate_cart_items',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => NULL,
        'startLine' => 66,
        'endLine' => 149,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Validation',
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