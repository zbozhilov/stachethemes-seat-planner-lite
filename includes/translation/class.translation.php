<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Translation {

    // Translates the scanner specific strings
    public static function get_scanner_strings() {
        return [
            'QR_CODE_SCAN_FAILED'                            => esc_html__('QR code scan failed. Please try again.', 'stachethemes-seat-planner-lite'),
            'CAMERA_ACCESS_DENIED'                           => esc_html__('Camera access denied. Please allow camera access to scan QR codes.', 'stachethemes-seat-planner-lite'),
            'QR_CODE_INVALID'                                => esc_html__('This QR code does not contain valid seat data.', 'stachethemes-seat-planner-lite'),
            'JUST_A_MOMENT'                                  => esc_html__('Just a moment', 'stachethemes-seat-planner-lite'),
            'SEAT_SCANNER'                                   => esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite'),
            'SCAN_THE_QR_CODE_TO_GET_SEAT_DETAILS'           => esc_html__('Scan the QR code to validate your ticket', 'stachethemes-seat-planner-lite'),
            'SCAN_NOW'                                       => esc_html__('Scan Now', 'stachethemes-seat-planner-lite'),
            'SCAN_NEW_TICKET'                                => esc_html__('Scan New Ticket', 'stachethemes-seat-planner-lite'),
            'ORDER_ID'                                       => esc_html__('Order ID', 'stachethemes-seat-planner-lite'),
            'SEAT_ID'                                        => esc_html__('Seat ID', 'stachethemes-seat-planner-lite'),
            'ORDER_STATUS'                                   => esc_html__('Order Status', 'stachethemes-seat-planner-lite'),
            'NAME'                                           => esc_html__('Name', 'stachethemes-seat-planner-lite'),
            'TICKET_IS_VALID'                                => esc_html__('Ticket is valid', 'stachethemes-seat-planner-lite'),
            'TICKET_IS_INVALID'                              => esc_html__('Ticket is invalid', 'stachethemes-seat-planner-lite'),
            'TICKET_IS_USED'                                 => esc_html__('Ticket was already scanned', 'stachethemes-seat-planner-lite'),
            'TICKET_IS_EXPIRED'                              => esc_html__('Ticket date has expired', 'stachethemes-seat-planner-lite'),
            // Translators: %1$s - seat ID, %2$s - user name
            'TICKET_SCANNED_BY__S__ON__S__'                  => esc_html__('This ticket has already been scanned by %1$s on %2$s', 'stachethemes-seat-planner-lite'),
            'PRODUCT_NOT_FOUND'                              => esc_html__('Product Not found', 'stachethemes-seat-planner-lite'),
            'QR_CODE_SCANNER'                                => esc_html__('QR Code Scanner', 'stachethemes-seat-planner-lite'),
            'SCAN_QR_CODE_TO_VALIDATE_TICKET'                => esc_html__('Scan QR code to validate ticket', 'stachethemes-seat-planner-lite'),
            'CLOSE'                                          => esc_html__('Close', 'stachethemes-seat-planner-lite'),
            'ERROR'                                          => esc_html__('Error', 'stachethemes-seat-planner-lite'),
            'GENERIC_ERROR_MESSAGE'                          => esc_html__('Sorry, something went wrong. Please try again.', 'stachethemes-seat-planner-lite'),
            'TRY_AGAIN'                                      => esc_html__('Try Again', 'stachethemes-seat-planner-lite'),
            'DATE'                                           => esc_html__('Date', 'stachethemes-seat-planner-lite'),
        ];
    }

    // Translates the strings used for checking double booking (Tools -> Double Booking Checker)
    public static function get_check_double_booking_strings() {
        return [
            'CHECK_FOR_DOUBLE_BOOKING'       => esc_html__('Check Now', 'stachethemes-seat-planner-lite'),
            'CHECKING'                       => esc_html__('Checking...', 'stachethemes-seat-planner-lite'),
            'CANCEL'                         => esc_html__('Cancel', 'stachethemes-seat-planner-lite'),
            // translators: %1$d - number of products being checked, %2$d - total number of products
            'CHECKING_PRODUCTS'              => esc_html__('Checking for double bookings... %1$d of %2$d products', 'stachethemes-seat-planner-lite'),
            'PREPARING_TO_CHECK'             => esc_html__('Preparing to check for double bookings...', 'stachethemes-seat-planner-lite'),
            'ERROR_OCCURRED'                 => esc_html__('An error occurred while checking for double bookings.', 'stachethemes-seat-planner-lite'),
            'TRY_AGAIN'                      => esc_html__('Try Again', 'stachethemes-seat-planner-lite'),
            'RESULTS'                        => esc_html__('Results', 'stachethemes-seat-planner-lite'),
            // translators: %1$d - number of products with duplicates, %2$d - total number of products checked
            'RESULTS_COUNT'                  => esc_html__('Results (%1$d of %2$d products checked)', 'stachethemes-seat-planner-lite'),
            'NO_DUPLICATES'                  => esc_html__('No duplicates', 'stachethemes-seat-planner-lite'),
            'ONE_DUPLICATE'                  => esc_html__('1 duplicate', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of duplicates
            'MULTIPLE_DUPLICATES'            => esc_html__('%d duplicates', 'stachethemes-seat-planner-lite'),
            'SEAT_ID'                        => esc_html__('Seat ID', 'stachethemes-seat-planner-lite'),
            'BOOKING_COUNT'                  => esc_html__('Booking Count', 'stachethemes-seat-planner-lite'),
            'ORDER_IDS'                      => esc_html__('Order IDs', 'stachethemes-seat-planner-lite'),
            'NO_DUPLICATE_BOOKINGS'          => esc_html__('No duplicate bookings found for this product.', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of products with duplicate bookings (plural)
            'CHECK_COMPLETE'                 => esc_html__('Check complete. %d products have duplicate bookings.', 'stachethemes-seat-planner-lite'),
            // translators: For when only one product has duplicate bookings
            'CHECK_COMPLETE_SINGULAR'        => esc_html__('Check complete. 1 product has duplicate bookings.', 'stachethemes-seat-planner-lite'),
            'NO_PRODUCTS_FOUND'              => esc_html__('No products found to check.', 'stachethemes-seat-planner-lite'),
        ];
    }

    // Translates the admin javascript strings
    public static function get_admin_strings() {

        return [
            'ZINDEX'                         => esc_html__('Z-Index', 'stachethemes-seat-planner-lite'), 
            'OBJECTS_COPIED'                 => esc_html__('Objects Copied', 'stachethemes-seat-planner-lite'),
            'OBJECTS_PASTED'                 => esc_html__('Objects Pasted', 'stachethemes-seat-planner-lite'),
            'MAX_OBJECTS_LIMIT_REACHED'      => esc_html__('Lite version supports up to 100 objects', 'stachethemes-seat-planner-lite'),
            'IMPORT_DATA_NOT_AVAILABLE_FOR_LITE_VERSION' => esc_html__('Import data is not available for the Lite version', 'stachethemes-seat-planner-lite'),
            'EXPORT_DATA_NOT_AVAILABLE_FOR_LITE_VERSION' => esc_html__('Export data is not available for the Lite version', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_NOT_AVAILABLE_FOR_LITE_VERSION' => esc_html__('Export bookings is not available for the Lite version', 'stachethemes-seat-planner-lite'),
            'PATTERN_APPLIED'                => esc_html__('Incremental Pattern Applied', 'stachethemes-seat-planner-lite'),
            'TOGGLE_THEME'                   => esc_html__('Toggle Light/Dark Mode', 'stachethemes-seat-planner-lite'),
            'OPEN_SEAT_PLANNER'              => esc_html__('Open Seat Planner', 'stachethemes-seat-planner-lite'),
            'SCREEN'                         => esc_html__('Screen', 'stachethemes-seat-planner-lite'),
            'SEAT'                           => esc_html__('Seat', 'stachethemes-seat-planner-lite'),
            'GENERIC_OBJECT'                 => esc_html__('Object', 'stachethemes-seat-planner-lite'),
            'TEXT'                           => esc_html__('Text', 'stachethemes-seat-planner-lite'),
            'LEFT'                           => esc_html_x('Left', 'Direction', 'stachethemes-seat-planner-lite'),
            'TOP'                            => esc_html_x('Top', 'Direction', 'stachethemes-seat-planner-lite'),
            'WIDTH'                          => esc_html__('Width', 'stachethemes-seat-planner-lite'),
            'HEIGHT'                         => esc_html__('Height', 'stachethemes-seat-planner-lite'),
            'DISPLAY_LABEL'                  => esc_html__('Display Label', 'stachethemes-seat-planner-lite'),
            'SEAT_ID'                        => esc_html__('Seat Id', 'stachethemes-seat-planner-lite'),
            'SEAT_LABEL'                     => esc_html__('Seat Label', 'stachethemes-seat-planner-lite'),
            'SEAT_PRICE'                     => esc_html__('Seat Price', 'stachethemes-seat-planner-lite'),
            'LABEL'                          => esc_html__('Label', 'stachethemes-seat-planner-lite'),
            'SELECT_FONT_SIZE'               => esc_html__('Select Font Size', 'stachethemes-seat-planner-lite'),
            'FONT_SIZE'                      => esc_html__('Font Size', 'stachethemes-seat-planner-lite'),
            'FONT_SIZE_SMALL'                => esc_html__('Small', 'stachethemes-seat-planner-lite'),
            'FONT_SIZE_MEDIUM'               => esc_html__('Medium', 'stachethemes-seat-planner-lite'),
            'FONT_SIZE_LARGE'                => esc_html__('Large', 'stachethemes-seat-planner-lite'),
            'PRICE'                          => esc_html__('Price', 'stachethemes-seat-planner-lite'),
            'COLOR'                          => esc_html__('Color', 'stachethemes-seat-planner-lite'),
            'BACKGROUND_COLOR'               => esc_html__('Background Color', 'stachethemes-seat-planner-lite'),
            'HANDICAP_SEAT'                  => esc_html__('Handicap Seat', 'stachethemes-seat-planner-lite'),
            'SELECTED_ITEMS'                 => esc_html__('Selected Items', 'stachethemes-seat-planner-lite'),
            'PROPERTIES'                     => esc_html__('Properties', 'stachethemes-seat-planner-lite'),
            'SEAT_PROPERTIES'                => esc_html__('Seat Properties', 'stachethemes-seat-planner-lite'),
            'SCREEN_PROPERTIES'              => esc_html__('Screen Properties', 'stachethemes-seat-planner-lite'),
            'GENERIC_PROPERTIES'             => esc_html__('Generic Properties', 'stachethemes-seat-planner-lite'),
            'TEXT_PROPERTIES'                => esc_html__('Text Properties', 'stachethemes-seat-planner-lite'),
            'KEYSTROKE_ACTIONS'              => esc_html__('Keystroke Actions', 'stachethemes-seat-planner-lite'),
            'UNDO'                           => esc_html__('Undo', 'stachethemes-seat-planner-lite'),
            'REDO'                           => esc_html__('Redo', 'stachethemes-seat-planner-lite'),
            'SELECT_ALL_OBJECTS'             => esc_html__('Select All Objects', 'stachethemes-seat-planner-lite'),
            'INVERT_SELECTION'               => esc_html__('Invert Selection', 'stachethemes-seat-planner-lite'),
            'DESELECT_ALL_OBJECTS'           => esc_html__('Deselect All Objects', 'stachethemes-seat-planner-lite'),
            'TOGGLE_GRID'                    => esc_html__('Toggle Grid', 'stachethemes-seat-planner-lite'),
            'GRID_CONTRAST'                  => esc_html__('Grid Contrast', 'stachethemes-seat-planner-lite'),
            'GRID_COLOR'                     => esc_html__('Grid Color', 'stachethemes-seat-planner-lite'),
            'DECREASE_GRID_SIZE'             => esc_html__('Decrease Grid Size', 'stachethemes-seat-planner-lite'),
            'INCREASE_GRID_SIZE'             => esc_html__('Increase Grid Size', 'stachethemes-seat-planner-lite'),
            'TOGGLE_EDITOR_SEAT_TEXT_DISPLAY__LABEL_PRICE_SEAT_ID' => esc_html__('Toggle Editor Seat Text Display (Label, Price, Seat Group, Status, Seat ID)', 'stachethemes-seat-planner-lite'),
            'CLOSE'                          => esc_html__('Close', 'stachethemes-seat-planner-lite'),
            'WORKFLOW_SETTINGS'              => esc_html__('Workflow Settings', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_ADD_SEATS_TO_CART'    => esc_html__('Failed to add seats to cart.', 'stachethemes-seat-planner-lite'),
            'BACK_TO_EDIT_PRODUCT_PAGE'      => esc_html__('Back to Edit Product Page', 'stachethemes-seat-planner-lite'),
            'SCREEN_TOO_SMALL'               => esc_html__('Sorry, the editor is optimized for desktop devices with larger screens only.', 'stachethemes-seat-planner-lite'),
            'ROUND_CORNERS'                  => esc_html__('Round Corners', 'stachethemes-seat-planner-lite'),
            'BACKGROUND_IMAGE'               => esc_html__('Background Image', 'stachethemes-seat-planner-lite'),
            'ADD_IMAGE'                      => esc_html__('Add Image', 'stachethemes-seat-planner-lite'),
            'SELECT_BACKGROUND_IMAGE'        => esc_html__('Select Background Image', 'stachethemes-seat-planner-lite'),
            'ADD_SELECTED_IMAGE'             => esc_html__('Add Selected Image', 'stachethemes-seat-planner-lite'),
            'BACKGROUND_OPACITY'             => esc_html__('Background Image Opacity', 'stachethemes-seat-planner-lite'),
            'SEAT_ID_DUPLICATE'              => esc_html__('This id is already in use by another seat!', 'stachethemes-seat-planner-lite'),
            'KEYBOARD_SHORTCUTS'             => esc_html__('Keyboard Shortcuts', 'stachethemes-seat-planner-lite'),
            'AUTO_INCREMENT_PATTERNS'        => esc_html__('Auto Increment Patterns', 'stachethemes-seat-planner-lite'),
            'LINEAR_INCREMENT_PATTERN'       => esc_html__('Linear Increment Pattern', 'stachethemes-seat-planner-lite'),
            'CYCLIC_INCREMENT_PATTERN'       => esc_html__('Cyclic Increment Pattern', 'stachethemes-seat-planner-lite'),
            'COMBINED_PATTERNS'              => esc_html__('Combined Patterns', 'stachethemes-seat-planner-lite'),
            'INCREMENTS_SEQUENTIALLY_THROUGH_VALUES' => esc_html__('Increments sequentially through values', 'stachethemes-seat-planner-lite'),
            'CYCLES_THROUGH_LIMITED_RANGE_THEN_REPEATS' => esc_html__('Cycles through limited range then repeats', 'stachethemes-seat-planner-lite'),
            'COMBINE_MULTIPLE_PATTERNS_WITH_SEPARATORS' => esc_html__('Combine multiple patterns with separators', 'stachethemes-seat-planner-lite'),
            'NUMBERS_INCREMENT_BY_ONE'       => esc_html__('Numbers increment by one', 'stachethemes-seat-planner-lite'),
            'LETTERS_INCREMENT_ALPHABETICALLY' => esc_html__('Letters increment alphabetically', 'stachethemes-seat-planner-lite'),
            'REPEAT_EACH_LETTER_3_TIMES'     => esc_html__('Repeat each letter 3 times', 'stachethemes-seat-planner-lite'),
            'REPEAT_EACH_NUMBER_3_TIMES'     => esc_html__('Repeat each number 3 times', 'stachethemes-seat-planner-lite'),
            'CYCLE_A_TO_C_THEN_REPEAT'       => esc_html__('Cycle A to C then repeat', 'stachethemes-seat-planner-lite'),
            'CYCLE_1_TO_3_THEN_REPEAT'       => esc_html__('Cycle 1 to 3 then repeat', 'stachethemes-seat-planner-lite'),
            'REPEAT_LETTERS_WITH_CYCLING_NUMBERS' => esc_html__('Repeat letters with cycling numbers', 'stachethemes-seat-planner-lite'),

            // Discounts
            'DISCOUNTS_NOT_AVAILABLE_FOR_LITE_VERSION' => esc_html__('Discounts are not available for the Lite version', 'stachethemes-seat-planner-lite'),
            'UNIQUE_DISCOUNT_NAME'           => esc_html__('Discount name must be unique.', 'stachethemes-seat-planner-lite'),
            'GROUP'                          => esc_html__('Group', 'stachethemes-seat-planner-lite'),
            'GROUP_NAME'                     => esc_html__('Group Name', 'stachethemes-seat-planner-lite'),
            'SEAT_GROUP'                     => esc_html__('Seat Group', 'stachethemes-seat-planner-lite'),
            'MANAGE_DISCOUNTS'               => esc_html__('Manage Discounts', 'stachethemes-seat-planner-lite'),
            'ADD_DISCOUNT'                   => esc_html__('Add Discount', 'stachethemes-seat-planner-lite'),
            'DISCOUNT_NAME'                  => esc_html__('Discount Name', 'stachethemes-seat-planner-lite'),
            'DISCOUNT_VALUE'                 => esc_html__('Discount Value', 'stachethemes-seat-planner-lite'),
            'DISCOUNT_TYPE'                  => esc_html__('Discount Type', 'stachethemes-seat-planner-lite'),
            'PERCENTAGE'                     => esc_html__('Percentage', 'stachethemes-seat-planner-lite'),
            'FIXED'                          => esc_html__('Fixed Value', 'stachethemes-seat-planner-lite'),
            'ALL_SEATS'                      => esc_html__('All Seats', 'stachethemes-seat-planner-lite'),

            'IMPORT_SEAT_PLAN'               => esc_html__('Import Seat Plan', 'stachethemes-seat-planner-lite'),
            'IMPORT_SEAT_PLAN_DESC'          => esc_html__('Select a CSV file to import a seat plan.', 'stachethemes-seat-planner-lite'),
            'IMPORT'                         => esc_html__('Import', 'stachethemes-seat-planner-lite'),

            // translators: %d: number of objects imported
            'D_OBJECTS_IMPORTED'             => esc_html__('%d Objects Imported', 'stachethemes-seat-planner-lite'),
            'EXPORT_SEAT_DATA'               => esc_html__('Export Seat Data', 'stachethemes-seat-planner-lite'),
            'EXPORTING_DATA'                 => esc_html__('Exporting Data', 'stachethemes-seat-planner-lite'),

            'SEAT_STATUS'                   => esc_html__('Seat Status', 'stachethemes-seat-planner-lite'),
            'SOLD_OUT'                      => esc_html__('Sold out', 'stachethemes-seat-planner-lite'),
            'AVAILABLE'                     => esc_html__('Available', 'stachethemes-seat-planner-lite'),
            'UNAVAILABLE'                   => esc_html__('Unavailable', 'stachethemes-seat-planner-lite'),
            'PURCHASABLE_ON_SITE'           => esc_html__('Purchasable on Site', 'stachethemes-seat-planner-lite'),

            // Seat reservation tab
            'RESERVED_SEATS_IN_CARTS'      => esc_html__('In-Cart Reserved Seats', 'stachethemes-seat-planner-lite'),
            'RESERVED_SEATS_IN_CARTS_DESC' => esc_html__('Reserved seats will be automatically released after a set time if not purchased.', 'stachethemes-seat-planner-lite'),
            'CLEAR_RESERVATIONS'           => esc_html__('Clear All', 'stachethemes-seat-planner-lite'),
            'LIST_IS_EMPTY'                => esc_html__('List is empty', 'stachethemes-seat-planner-lite'),

            // Export Bookings
            'EXPORT_BOOKINGS'                 => esc_html__('Export Bookings', 'stachethemes-seat-planner-lite'),
            'ORDER_ID'                        => esc_html__('Order ID', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_NAME'                   => esc_html__('Customer Name', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_EMAIL'                  => esc_html__('Customer Email', 'stachethemes-seat-planner-lite'),
            'DATE_CREATED'                    => esc_html__('Date Created', 'stachethemes-seat-planner-lite'),
            'ORDER_STATUS'                    => esc_html__('Order Status', 'stachethemes-seat-planner-lite'),
            'PRODUCT_NAME'                    => esc_html__('Product Name', 'stachethemes-seat-planner-lite'),
            'SEAT_ID'                         => esc_html__('Seat Id', 'stachethemes-seat-planner-lite'),
            'SEAT_PRICE'                      => esc_html__('Price', 'stachethemes-seat-planner-lite'),
            'DATE_TIME'                       => esc_html__('Date and Time', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_LOADING'         => esc_html__('Loading bookings...', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_SUCCESS'         => esc_html__('Bookings exported successfully.', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_ERROR'           => esc_html__('An error occurred while exporting bookings.', 'stachethemes-seat-planner-lite'),
            'PRODUCT_NOTE'                    => esc_html__('Product Note', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_SUCCESS_NO_DATA' => esc_html__('No bookings found for this product.', 'stachethemes-seat-planner-lite'),
            
            // Field selection for export
            'SELECT_FIELDS_TO_EXPORT_DESCRIPTION'  => esc_html__('Select the fields you want to include in the export file. You can select multiple fields.', 'stachethemes-seat-planner-lite'),
            'SELECT_FIELDS_TO_EXPORT'              => esc_html__('Select Fields to Export', 'stachethemes-seat-planner-lite'),
            'SELECT_ALL'                           => esc_html__('Select All', 'stachethemes-seat-planner-lite'),
            'DESELECT_ALL'                         => esc_html__('Deselect All', 'stachethemes-seat-planner-lite'),
            'PLEASE_SELECT_AT_LEAST_ONE_FIELD'     => esc_html__('Please select at least one field to export.', 'stachethemes-seat-planner-lite'),
            
            // Dates
            'MANAGE_DATES_AND_TIMES'               => esc_html__('Manage Dates and Times', 'stachethemes-seat-planner-lite'),
            'MANAGE_DATES_AND_TIMES_DESC'          => esc_html__('If this product should be available on multiple dates and times, add them here. If not, leave this field empty.', 'stachethemes-seat-planner-lite'),
            'ADD_DATE_AND_TIME'                    => esc_html__('Add Date and Time', 'stachethemes-seat-planner-lite'),
            'DATE_AND_TIME'                        => esc_html__('Date and Time', 'stachethemes-seat-planner-lite'),
            'DATES_NOT_AVAILABLE_FOR_LITE_VERSION' => esc_html__('Dates are not available for the Lite version', 'stachethemes-seat-planner-lite'),
        ];
    }

    // Translates the front javascript strings
    public static function get_front_strings() {

        return [
            'NO_SEATS_SELECTED'     => esc_html__('No seats selected', 'stachethemes-seat-planner-lite'),
            'CLOSE'                 => esc_html__('Close', 'stachethemes-seat-planner-lite'),
            'ADD_TO_CART'           => esc_html__('Add to Cart', 'stachethemes-seat-planner-lite'),
            'ZOOM_IN'               => esc_html__('Zoom In', 'stachethemes-seat-planner-lite'),
            'ZOOM_OUT'              => esc_html__('Zoom Out', 'stachethemes-seat-planner-lite'),
            'ZOOM_RESET'            => esc_html__('Zoom Reset', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEATS_REQUIRED'       => esc_html__('Select at least %d seats', 'stachethemes-seat-planner-lite'),
            'MAX_SEATS_SELECTED'     => esc_html__('Maximum seats selected', 'stachethemes-seat-planner-lite'),
            'SEAT_SELECTED'          => esc_html__('Seat selected', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEAT_SELECTED'       => esc_html__('%d seat selected', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEATS_SELECTED'      => esc_html__('%d seats selected', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEAT_ADDED_TO_CART'  => esc_html__('%d seat added to cart.', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEATS_ADDED_TO_CART' => esc_html__('%d seats added to cart.', 'stachethemes-seat-planner-lite'),
            'A__VIEW_CART'          => sprintf('<a class="wc-forward" href="%s">%s</a>', wc_get_cart_url(), esc_html__('View Cart', 'stachethemes-seat-planner-lite')),
            'GENERIC_ERROR_MESSAGE' => esc_html__('Sorry, something went wrong. Please try again.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_SEAT_PLAN_DATA' => esc_html__('Failed to fetch seat plan data.', 'stachethemes-seat-planner-lite'),

            'SEAT'                           => esc_html__('Seat', 'stachethemes-seat-planner-lite'),
            'NEXT'                           => esc_html__('Next', 'stachethemes-seat-planner-lite'),
            'BACK'                           => esc_html__('Back', 'stachethemes-seat-planner-lite'),
            'SELECT_DISCOUNTS_FOR_SEATS'     => esc_html__('Select Discounts for Your Seats', 'stachethemes-seat-planner-lite'),
            'REGULAR_SEAT'                   => esc_html__('Regular Seat', 'stachethemes-seat-planner-lite'),
            'TOTAL'                          => esc_html__('Total', 'stachethemes-seat-planner-lite'),
            'DISCOUNTS'                      => esc_html__('Discounts', 'stachethemes-seat-planner-lite'),

            'VIEW_CART'                      => esc_html__('View Cart', 'stachethemes-seat-planner-lite'),

            'THIS_SEAT_IS_ONLY_AVAILABLE_ON_SITE' => esc_html__('This seat can only be purchased at the venue.', 'stachethemes-seat-planner-lite'),
        ];
    }
}
