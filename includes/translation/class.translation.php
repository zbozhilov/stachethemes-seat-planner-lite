<?php

namespace Stachethemes\SeatPlannerLite;


class Translation {

    // Translates the scanner specific strings
    public static function get_scanner_strings() {
        return [
            'SEAT_SCANNER'                         => esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite'),
            'SCAN_THE_QR_CODE_TO_GET_SEAT_DETAILS' => esc_html__('Scan the QR code to validate your ticket', 'stachethemes-seat-planner-lite'),
            'SCAN_NOW'                             => esc_html__('Scan Now', 'stachethemes-seat-planner-lite'),
            'QR_CODE_SCANNER'                      => esc_html__('QR Code Scanner', 'stachethemes-seat-planner-lite'),
            'CLOSE'                                => esc_html__('Close', 'stachethemes-seat-planner-lite'),
            'SCAN_NOT_ALLOWED'                      => esc_html__('QR Code Scanner is not available the in LITE version.', 'stachethemes-seat-planner-lite'),
        ];
    }

    // Translates the admin javascript strings
    public static function get_admin_strings() {

        return [
            'OBJECTS_COPIED'                 => esc_html__('Objects Copied', 'stachethemes-seat-planner-lite'),
            'OBJECTS_PASTED'                 => esc_html__('Objects Pasted', 'stachethemes-seat-planner-lite'),
            'PATTERN_APPLIED'                => esc_html__('Incremental Pattern Applied', 'stachethemes-seat-planner-lite'),
            'TOGGLE_THEME'                   => esc_html__('Toggle Theme', 'stachethemes-seat-planner-lite'),
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
            'TOGGLE_EDITOR_SEAT_TEXT_DISPLAY__LABEL_PRICE_SEAT_ID' => esc_html__('Toggle Editor Seat Text Display (Label, Price, Seat ID)', 'stachethemes-seat-planner-lite'),
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

            'IMPORT_DATA_DISABLED'           => esc_html__('Import feature is not available in the LITE version.', 'stachethemes-seat-planner-lite'),
            'EXPORT_DATA_DISABLED'           => esc_html__('Export feature is not available in the LITE version.', 'stachethemes-seat-planner-lite'),

            // Discounts
            'ADD_DISCOUNT_DISABLED'          => esc_html__('Discounts are not available in the LITE version.', 'stachethemes-seat-planner-lite'),
            'MANAGE_DISCOUNTS'               => esc_html__('Manage Discounts', 'stachethemes-seat-planner-lite'),
            'ADD_DISCOUNT'                   => esc_html__('Add Discount', 'stachethemes-seat-planner-lite'),

            'IMPORT_SEAT_PLAN'               => esc_html__('Import Seat Plan', 'stachethemes-seat-planner-lite'),
            'IMPORT_SEAT_PLAN_DESC'          => esc_html__('Select a CSV file to import a seat plan.', 'stachethemes-seat-planner-lite'),
            'IMPORT'                         => esc_html__('Import', 'stachethemes-seat-planner-lite'),

            // translators: %d: number of objects imported
            'D_OBJECTS_IMPORTED'             => esc_html__('%d Objects Imported', 'stachethemes-seat-planner-lite'),
            'EXPORT_SEAT_DATA'               => esc_html__('Export Seat Data', 'stachethemes-seat-planner-lite'),
            'EXPORTING_DATA'                 => esc_html__('Exporting Data', 'stachethemes-seat-planner-lite'),

            /* translators: %d: number of objects */
            'MAX_ALLOWED_OBJECTS_IS_D'      => esc_html__('The maximum allowed objects in the LITE version are %d', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'MAX_ALLOWED_SEATS_IS_D'        => esc_html__('The maximum allowed seats in the LITE version are %d', 'stachethemes-seat-planner-lite'),

            'DYNAMIC_PRICE_CHANGE_NOT_SUPPORTED' => esc_html__('Dynamic pricing is not supported in the LITE version. Price will be applied to all seats', 'stachethemes-seat-planner-lite'),
        ];
    }

    // Translates the front javascript strings
    public static function get_front_strings() {

        return [
            'NO_SEATS_SELECTED'     => esc_html__('No seats selected', 'stachethemes-seat-planner-lite'),
            'CLOSE'                 => esc_html__('Close', 'stachethemes-seat-planner-lite'),
            'ADD_TO_CART'           => esc_html__('Add to Cart', 'stachethemes-seat-planner-lite'),
            'ZOOM_IN'               => esc_html__('Zoom In +', 'stachethemes-seat-planner-lite'),
            'ZOOM_OUT'              => esc_html__('Zoom Out -', 'stachethemes-seat-planner-lite'),
            'ZOOM_RESET'            => esc_html__('Zoom Reset', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEAT_SELECTED'       => esc_html__('%d Seat selected', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEATS_SELECTED'      => esc_html__('%d Seats selected', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEAT_ADDED_TO_CART'  => esc_html__('%d Seat added to cart.', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'D_SEATS_ADDED_TO_CART' => esc_html__('%d Seats added to cart.', 'stachethemes-seat-planner-lite'),
            'A__VIEW_CART'          => sprintf('<a class="wc-forward" href="%s">%s</a>', wc_get_cart_url(), esc_html__('View Cart', 'stachethemes-seat-planner-lite')),
            'GENERIC_ERROR_MESSAGE' => esc_html__('Sorry, something went wrong. Please try again.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_SEAT_PLAN_DATA' => esc_html__('Failed to fetch seat plan data.', 'stachethemes-seat-planner-lite'),

            'VIEW_CART'                      => esc_html__('View Cart', 'stachethemes-seat-planner-lite'),
        ];
    }
}
