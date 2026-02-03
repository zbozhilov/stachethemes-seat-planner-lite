<?php declare(strict_types = 1);

// odsl-/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/woocommerce/product/filters/class.auditorium-product-cart-timer.php-PHPStan\BetterReflection\Reflection\ReflectionClass-StachethemesSeatPlannerLite\Auditorium_Product_Cart_Timer
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.65.0.9-8.3.6-1acf311e2a31826fcbcabc8f318e3d95767d73929f6251f9dd386fb7ae501abe',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'filename' => '/home/sapyn/Projects/stachethemes-seat-planner-lite/includes/woocommerce/product/filters/class.auditorium-product-cart-timer.php',
      ),
    ),
    'namespace' => 'StachethemesSeatPlannerLite',
    'name' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
    'shortName' => 'Auditorium_Product_Cart_Timer',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 0,
    'docComment' => '/**
 * Adds a "time remaining" notice for reserved seats in the WooCommerce cart
 * and renders a small inline script to convert the static value into
 * a live countdown timer on cart / checkout pages.
 */',
    'attributes' => 
    array (
    ),
    'startLine' => 14,
    'endLine' => 203,
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
      'display_cart_timer' => 
      array (
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'name' => 'display_cart_timer',
        'modifiers' => 20,
        'type' => NULL,
        'default' => 
        array (
          'code' => 'false',
          'attributes' => 
          array (
            'startLine' => 16,
            'endLine' => 16,
            'startTokenPos' => 40,
            'startFilePos' => 374,
            'endTokenPos' => 40,
            'endFilePos' => 378,
          ),
        ),
        'docComment' => NULL,
        'attributes' => 
        array (
        ),
        'startLine' => 16,
        'endLine' => 16,
        'startColumn' => 5,
        'endColumn' => 47,
        'isPromoted' => false,
        'declaredAtCompileTime' => true,
        'immediateVirtual' => false,
        'immediateHooks' => 
        array (
        ),
      ),
      'did_init' => 
      array (
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'name' => 'did_init',
        'modifiers' => 20,
        'type' => NULL,
        'default' => 
        array (
          'code' => 'false',
          'attributes' => 
          array (
            'startLine' => 23,
            'endLine' => 23,
            'startTokenPos' => 53,
            'startFilePos' => 523,
            'endTokenPos' => 53,
            'endFilePos' => 527,
          ),
        ),
        'docComment' => '/**
 * Whether the hooks for this class have already been registered.
 *
 * @var bool
 */',
        'attributes' => 
        array (
        ),
        'startLine' => 23,
        'endLine' => 23,
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
        'docComment' => '/**
 * Register WooCommerce filters / actions for the cart timer.
 *
 * Intended to be called once via `Auditorium_Product_Cart_Timer::init()`.
 *
 * @return void
 */',
        'startLine' => 33,
        'endLine' => 55,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'aliasName' => NULL,
      ),
      'register_cart_timer_scripts' => 
      array (
        'name' => 'register_cart_timer_scripts',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Register cart timer scripts and styles.
 *
 * @return void
 */',
        'startLine' => 62,
        'endLine' => 112,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'aliasName' => NULL,
      ),
      'add_cart_item_data' => 
      array (
        'name' => 'add_cart_item_data',
        'parameters' => 
        array (
          'cart_item_data' => 
          array (
            'name' => 'cart_item_data',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 124,
            'endLine' => 124,
            'startColumn' => 47,
            'endColumn' => 61,
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
            'startLine' => 124,
            'endLine' => 124,
            'startColumn' => 64,
            'endColumn' => 74,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
          'variation_id' => 
          array (
            'name' => 'variation_id',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 124,
            'endLine' => 124,
            'startColumn' => 77,
            'endColumn' => 89,
            'parameterIndex' => 2,
            'isOptional' => false,
          ),
        ),
        'returnsReference' => false,
        'returnType' => NULL,
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * Attach reservation meta to the cart item so it can later be used to
 * calculate the remaining time in the cart.
 *
 * @param array $cart_item_data
 * @param int   $product_id
 * @param int   $variation_id
 *
 * @return array Filtered cart item data.
 */',
        'startLine' => 124,
        'endLine' => 141,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'aliasName' => NULL,
      ),
      'attach_item_timer_data' => 
      array (
        'name' => 'attach_item_timer_data',
        'parameters' => 
        array (
          'item_data' => 
          array (
            'name' => 'item_data',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 152,
            'endLine' => 152,
            'startColumn' => 51,
            'endColumn' => 60,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'cart_item' => 
          array (
            'name' => 'cart_item',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 152,
            'endLine' => 152,
            'startColumn' => 63,
            'endColumn' => 72,
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
 * Add a "time remaining" line to the cart item details, based on the
 * reservation meta previously stored in `add_cart_item_data()`.
 *
 * @param array $item_data Existing item display data.
 * @param array $cart_item Raw cart item array.
 *
 * @return array Filtered item display data.
 */',
        'startLine' => 152,
        'endLine' => 170,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'aliasName' => NULL,
      ),
      'get_timer_html' => 
      array (
        'name' => 'get_timer_html',
        'parameters' => 
        array (
          'cart_item' => 
          array (
            'name' => 'cart_item',
            'default' => NULL,
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 175,
            'endLine' => 175,
            'startColumn' => 43,
            'endColumn' => 52,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'echo' => 
          array (
            'name' => 'echo',
            'default' => 
            array (
              'code' => 'true',
              'attributes' => 
              array (
                'startLine' => 175,
                'endLine' => 175,
                'startTokenPos' => 709,
                'startFilePos' => 5482,
                'endTokenPos' => 709,
                'endFilePos' => 5485,
              ),
            ),
            'type' => NULL,
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 175,
            'endLine' => 175,
            'startColumn' => 55,
            'endColumn' => 66,
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
 * A helper function to get the timer html for a cart item
 */',
        'startLine' => 175,
        'endLine' => 202,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 17,
        'namespace' => 'StachethemesSeatPlannerLite',
        'declaringClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'implementingClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
        'currentClassName' => 'StachethemesSeatPlannerLite\\Auditorium_Product_Cart_Timer',
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