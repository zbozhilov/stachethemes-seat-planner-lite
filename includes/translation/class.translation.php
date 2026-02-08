<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Translation {

    /**
     * @return array<string, string>
     */
    private static function month_strings(): array {
        return [
            'JANUARY'                                     => esc_html__('January', 'stachethemes-seat-planner-lite'),
            'FEBRUARY'                                    => esc_html__('February', 'stachethemes-seat-planner-lite'),
            'MARCH'                                       => esc_html__('March', 'stachethemes-seat-planner-lite'),
            'APRIL'                                       => esc_html__('April', 'stachethemes-seat-planner-lite'),
            'MAY'                                         => esc_html__('May', 'stachethemes-seat-planner-lite'),
            'JUNE'                                        => esc_html__('June', 'stachethemes-seat-planner-lite'),
            'JULY'                                        => esc_html__('July', 'stachethemes-seat-planner-lite'),
            'AUGUST'                                      => esc_html__('August', 'stachethemes-seat-planner-lite'),
            'SEPTEMBER'                                   => esc_html__('September', 'stachethemes-seat-planner-lite'),
            'OCTOBER'                                     => esc_html__('October', 'stachethemes-seat-planner-lite'),
            'NOVEMBER'                                    => esc_html__('November', 'stachethemes-seat-planner-lite'),
            'DECEMBER'                                    => esc_html__('December', 'stachethemes-seat-planner-lite'),

            'JANUARY_SHORT'                               => esc_html_x('Jan', 'Month label short', 'stachethemes-seat-planner-lite'),
            'FEBRUARY_SHORT'                              => esc_html_x('Feb', 'Month label short', 'stachethemes-seat-planner-lite'),
            'MARCH_SHORT'                                 => esc_html_x('Mar', 'Month label short', 'stachethemes-seat-planner-lite'),
            'APRIL_SHORT'                                 => esc_html_x('Apr', 'Month label short', 'stachethemes-seat-planner-lite'),
            'MAY_SHORT'                                   => esc_html_x('May', 'Month label short', 'stachethemes-seat-planner-lite'),
            'JUNE_SHORT'                                  => esc_html_x('Jun', 'Month label short', 'stachethemes-seat-planner-lite'),
            'JULY_SHORT'                                  => esc_html_x('Jul', 'Month label short', 'stachethemes-seat-planner-lite'),
            'AUGUST_SHORT'                                => esc_html_x('Aug', 'Month label short', 'stachethemes-seat-planner-lite'),
            'SEPTEMBER_SHORT'                             => esc_html_x('Sep', 'Month label short', 'stachethemes-seat-planner-lite'),
            'OCTOBER_SHORT'                               => esc_html_x('Oct', 'Month label short', 'stachethemes-seat-planner-lite'),
            'NOVEMBER_SHORT'                              => esc_html_x('Nov', 'Month label short', 'stachethemes-seat-planner-lite'),
            'DECEMBER_SHORT'                              => esc_html_x('Dec', 'Month label short', 'stachethemes-seat-planner-lite'),

        ];
    }

    /**
     * Datepicker related strings
     *
     * @return array<string, string>
     */
    private static function datepicker_strings(): array {
        return [
            'FAILED_TO_FETCH_AVAILABLE_DATES'             => esc_html__('Failed to fetch available dates.', 'stachethemes-seat-planner-lite'),
            'DATEPICKER_NOT_SEATS_AVAILABLE_TITLE'        => esc_html__('No dates found', 'stachethemes-seat-planner-lite'),
            'DATEPICKER_NOT_SEATS_AVAILABLE_DESCRIPTION'  => esc_html__('Sorry, there are no available dates at the moment.', 'stachethemes-seat-planner-lite'),
            'SELECT_DATE_AND_TIME'                        => esc_html__('Select Date & Time', 'stachethemes-seat-planner-lite'),
            'PREVIOUS_MONTH'                              => esc_html__('Previous Month', 'stachethemes-seat-planner-lite'),
            'NEXT_MONTH'                                  => esc_html__('Next Month', 'stachethemes-seat-planner-lite'),
            'SELECT_DATE'                                 => esc_html__('Select Date', 'stachethemes-seat-planner-lite'),
            'SUNDAY_SHORT'                                => esc_html_x('Su', 'Day of the week', 'stachethemes-seat-planner-lite'),
            'MONDAY_SHORT'                                => esc_html_x('Mo', 'Day of the week', 'stachethemes-seat-planner-lite'),
            'TUESDAY_SHORT'                               => esc_html_x('Tu', 'Day of the week', 'stachethemes-seat-planner-lite'),
            'WEDNESDAY_SHORT'                             => esc_html_x('We', 'Day of the week', 'stachethemes-seat-planner-lite'),
            'THURSDAY_SHORT'                              => esc_html_x('Th', 'Day of the week', 'stachethemes-seat-planner-lite'),
            'FRIDAY_SHORT'                                => esc_html_x('Fr', 'Day of the week', 'stachethemes-seat-planner-lite'),
            'SATURDAY_SHORT'                              => esc_html_x('Sa', 'Day of the week', 'stachethemes-seat-planner-lite'),
            'AVAILABLE_TIMES'                             => esc_html__('Available Times', 'stachethemes-seat-planner-lite'),
            'CHECKING_AVAILABILITY'                       => esc_html__('Checking Availability', 'stachethemes-seat-planner-lite'),
            'PLEASE_SELECT_A_DATE_TO_SEE_AVAILABLE_TIMES' => esc_html__('Select a date to see available times', 'stachethemes-seat-planner-lite'),
            ...self::month_strings(),
        ];
    }

    /**
     * Translates the product admin javascript strings
     *
     * @return array<string, string>
     */
    public static function get_admin_strings(): array {

        return [
            'MAX_OBJECTS_LIMIT_REACHED'      => esc_html__('You have reached the maximum number of objects allowed. Please upgrade to the Pro version to create more seats.', 'stachethemes-seat-planner-lite'),
            'EXTRA_CLASS'                    => esc_html__('Additional Class Name', 'stachethemes-seat-planner-lite'),
            'CLICK_TO_CHANGE_DISPLAY_LABEL'  => esc_html__('Click to change display label', 'stachethemes-seat-planner-lite'),
            'ZINDEX'                         => esc_html__('Z-Index', 'stachethemes-seat-planner-lite'),
            'OBJECTS_COPIED'                 => esc_html__('Objects Copied', 'stachethemes-seat-planner-lite'),
            'OBJECTS_PASTED'                 => esc_html__('Objects Pasted', 'stachethemes-seat-planner-lite'),
            'PATTERN_APPLIED'                => esc_html__('Incremental Pattern Applied', 'stachethemes-seat-planner-lite'),
            'TOGGLE_THEME'                   => esc_html__('Toggle Light/Dark Mode', 'stachethemes-seat-planner-lite'),
            'LOCK_SELECTED'                  => esc_html__('Lock Selected Objects', 'stachethemes-seat-planner-lite'),
            'UNLOCK_SELECTED'                => esc_html__('Unlock Selected Objects', 'stachethemes-seat-planner-lite'),
            'NO_SELECTION'                   => esc_html__('No objects selected', 'stachethemes-seat-planner-lite'),
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
            'FONT_WEIGHT'                    => esc_html__('Font Weight', 'stachethemes-seat-planner-lite'),
            'FONT_WEIGHT_LIGHTER'            => esc_html__('Lighter', 'stachethemes-seat-planner-lite'),
            'FONT_WEIGHT_NORMAL'             => esc_html__('Normal', 'stachethemes-seat-planner-lite'),
            'FONT_WEIGHT_BOLD'               => esc_html__('Bold', 'stachethemes-seat-planner-lite'),
            'FONT_WEIGHT_BOLDER'             => esc_html__('Bolder', 'stachethemes-seat-planner-lite'),
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
            'ROUND_CORNERS'                  => esc_html__('Round Corners (px)', 'stachethemes-seat-planner-lite'),
            'TEXT_DIRECTION'                 => esc_html__('Text Direction', 'stachethemes-seat-planner-lite'),
            'TEXT_DIR_HORIZONTAL'            => esc_html__('Horizontal', 'stachethemes-seat-planner-lite'),
            'TEXT_DIR_VERTICAL_UPRIGHT'      => esc_html__('Vertical (Upright)', 'stachethemes-seat-planner-lite'),
            'TEXT_DIR_ROTATED_CW'            => esc_html__('Vertical (Sideways)', 'stachethemes-seat-planner-lite'),
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
            'COPY_SELECTED_OBJECTS'             => esc_html__('Copy Selected Objects', 'stachethemes-seat-planner-lite'),
            'PASTE_SELECTED_OBJECTS'            => esc_html__('Paste Selected Objects', 'stachethemes-seat-planner-lite'),

            // Pattern Builder
            'PATTERN_BUILDER'                   => esc_html__('Pattern Builder', 'stachethemes-seat-planner-lite'),
            'QUICK_PATTERNS'                    => esc_html__('Quick Patterns', 'stachethemes-seat-planner-lite'),
            'CUSTOM_PATTERN'                    => esc_html__('Custom Pattern', 'stachethemes-seat-planner-lite'),
            'PREFIX'                            => esc_html__('Prefix', 'stachethemes-seat-planner-lite'),
            'SUFFIX'                            => esc_html__('Suffix', 'stachethemes-seat-planner-lite'),
            'SEGMENT'                           => esc_html__('Segment', 'stachethemes-seat-planner-lite'),
            'REMOVE'                            => esc_html__('Remove', 'stachethemes-seat-planner-lite'),
            'SEPARATOR'                         => esc_html__('Separator', 'stachethemes-seat-planner-lite'),
            'TYPE'                              => esc_html__('Type', 'stachethemes-seat-planner-lite'),
            'START'                             => esc_html__('Start', 'stachethemes-seat-planner-lite'),
            'MODE'                              => esc_html__('Mode', 'stachethemes-seat-planner-lite'),
            'SIMPLE'                            => esc_html__('Simple', 'stachethemes-seat-planner-lite'),
            'REPEAT_EACH'                       => esc_html__('Repeat Each', 'stachethemes-seat-planner-lite'),
            'CYCLE'                             => esc_html__('Cycle', 'stachethemes-seat-planner-lite'),
            'RANGE'                             => esc_html__('Range', 'stachethemes-seat-planner-lite'),
            'TIMES'                             => esc_html__('Times', 'stachethemes-seat-planner-lite'),
            'ADD_SEGMENT'                       => esc_html__('Add Segment', 'stachethemes-seat-planner-lite'),
            'PREVIEW'                           => esc_html__('Preview', 'stachethemes-seat-planner-lite'),
            'MORE'                              => esc_html__('more', 'stachethemes-seat-planner-lite'),
            'ITEMS_SELECTED'                    => esc_html__('items selected', 'stachethemes-seat-planner-lite'),
            'CANCEL'                            => esc_html__('Cancel', 'stachethemes-seat-planner-lite'),
            'APPLY_PATTERN'                     => esc_html__('Apply Pattern', 'stachethemes-seat-planner-lite'),
            'SELECT'                            => esc_html__('Select', 'stachethemes-seat-planner-lite'),
            'AUTO_INCREMENT'                    => esc_html__('Auto Increment', 'stachethemes-seat-planner-lite'),

            // Discounts
            'FIELD_UNIQUE_NOTE'              => esc_html__('Field name must be unique.', 'stachethemes-seat-planner-lite'),
            'UNIQUE_DISCOUNT_NAME'           => esc_html__('Discount name must be unique.', 'stachethemes-seat-planner-lite'),
            'GROUP'                          => esc_html__('Group', 'stachethemes-seat-planner-lite'),
            'GROUP_NAME'                     => esc_html__('Group Name', 'stachethemes-seat-planner-lite'),
            'SEAT_GROUP'                     => esc_html__('Seat Group', 'stachethemes-seat-planner-lite'),
            'USER_ROLE'                      => esc_html__('User Role', 'stachethemes-seat-planner-lite'),
            'NO_ROLE'                        => esc_html__('Any', 'stachethemes-seat-planner-lite'),
            'MANAGE_DISCOUNTS'               => esc_html__('Manage Discounts', 'stachethemes-seat-planner-lite'),
            'DISCOUNTS_SUBTITLE'             => esc_html__('Apply discounts to your seat plan for specific seat groups or all seats', 'stachethemes-seat-planner-lite'),
            'ADD_DISCOUNT'                   => esc_html__('Add Discount', 'stachethemes-seat-planner-lite'),
            'NEW_DISCOUNT'                   => esc_html__('New discount', 'stachethemes-seat-planner-lite'),
            'DUPLICATE_DISCOUNT'             => esc_html__('Duplicate Discount', 'stachethemes-seat-planner-lite'),
            'NO_DISCOUNTS_ADDED'             => esc_html__('No discounts added yet', 'stachethemes-seat-planner-lite'),
            'DISCOUNT_NAME'                  => esc_html__('Discount Name', 'stachethemes-seat-planner-lite'),
            'DISCOUNT_VALUE'                 => esc_html__('Discount Value', 'stachethemes-seat-planner-lite'),
            'DISCOUNT_TYPE'                  => esc_html__('Discount Type', 'stachethemes-seat-planner-lite'),
            'PERCENTAGE'                     => esc_html__('Percentage', 'stachethemes-seat-planner-lite'),
            'FIXED'                          => esc_html__('Fixed Value', 'stachethemes-seat-planner-lite'),
            'ALL_SEATS'                      => esc_html__('All Seats', 'stachethemes-seat-planner-lite'),

            // Custom fields
            'CF_TAB_GENERAL'             => esc_html__('General', 'stachethemes-seat-planner-lite'),
            'CF_TAB_ADVANCED'            => esc_html__('Advanced', 'stachethemes-seat-planner-lite'),
            'MANAGE_CUSTOM_FIELDS'      => esc_html__('Manage Custom Fields', 'stachethemes-seat-planner-lite'),
            'MANAGE_CUSTOM_FIELDS_DESC' => esc_html__('Add custom fields for each selected seat', 'stachethemes-seat-planner-lite'),
            'NO_CUSTOM_FIELDS'          => esc_html__('No custom fields added yet', 'stachethemes-seat-planner-lite'),
            'NO_CUSTOM_FIELDS_DESC'     => esc_html__('Click “Add Custom Field” to create your first one.', 'stachethemes-seat-planner-lite'),
            'ADD_CUSTOM_FIELD'          => esc_html__('Add Custom Field', 'stachethemes-seat-planner-lite'),
            'CUSTOM_FIELD_VISIBLE'      => esc_html__('Visible in customer cart and order details', 'stachethemes-seat-planner-lite'),
            'TEXTAREA'                  => esc_html__('Textarea', 'stachethemes-seat-planner-lite'),
            'CHECKBOX'                  => esc_html__('Checkbox', 'stachethemes-seat-planner-lite'),
            'FIELD_REQUIRED'            => esc_html__('Required', 'stachethemes-seat-planner-lite'),
            'FIELD_NAME'                => esc_html__('Name', 'stachethemes-seat-planner-lite'),
            'FIELD_DESCRIPTION'         => esc_html__('Description (optional)', 'stachethemes-seat-planner-lite'),
            'FIELD_TYPE'                => esc_html__('Type', 'stachethemes-seat-planner-lite'),
            'FIELD_OPTIONS'             => esc_html__('Options', 'stachethemes-seat-planner-lite'),
            'FIELD_PLACEHOLDER'         => esc_html__('Placeholder', 'stachethemes-seat-planner-lite'),
            'TEXT_FIELD'                => esc_html__('Text', 'stachethemes-seat-planner-lite'),
            'TEXTAREA_FIELD'            => esc_html__('Textarea', 'stachethemes-seat-planner-lite'),
            'CHECKBOX_FIELD'            => esc_html__('Checkbox', 'stachethemes-seat-planner-lite'),
            'NUMBER_FIELD'              => esc_html__('Number', 'stachethemes-seat-planner-lite'),
            'CHECKBOX_CHECKED_VALUE'    => esc_html__('Checked Value', 'stachethemes-seat-planner-lite'),
            'SELECT_FIELD'              => esc_html__('Select', 'stachethemes-seat-planner-lite'),
            'INFO_FIELD'                => esc_html__('Info', 'stachethemes-seat-planner-lite'),
            'META_FIELD'                => esc_html__('Meta', 'stachethemes-seat-planner-lite'),
            'FIELD_VALUE'               => esc_html__('Value', 'stachethemes-seat-planner-lite'),
            'FIELD_PRICE'               => esc_html__('Price', 'stachethemes-seat-planner-lite'),
            'OPTIONAL'                  => esc_html__('Optional', 'stachethemes-seat-planner-lite'),
            'ADD_OPTION'                => esc_html__('Add Option', 'stachethemes-seat-planner-lite'),
            'OPTION_LABEL'              => esc_html__('Option Label', 'stachethemes-seat-planner-lite'),
            'FIELD_MIN'                 => esc_html__('Min', 'stachethemes-seat-planner-lite'),
            'FIELD_MAX'                 => esc_html__('Max', 'stachethemes-seat-planner-lite'),
            'NO_OPTIONS_ADDED'          => esc_html__('No options added yet', 'stachethemes-seat-planner-lite'),
            'FIELD_NAME_BLANK'          => esc_html__('Custom Field', 'stachethemes-seat-planner-lite'),
            'ADD_CONDITION'             => esc_html__('Add Condition', 'stachethemes-seat-planner-lite'),
            'CONDITION_OPERATOR'        => esc_html__('Condition Operator', 'stachethemes-seat-planner-lite'),
            'EQUALS'                    => esc_html__('Equals', 'stachethemes-seat-planner-lite'),
            'NOT_EQUALS'                => esc_html__('Not Equals', 'stachethemes-seat-planner-lite'),
            'GREATER_THAN'              => esc_html__('Greater Than', 'stachethemes-seat-planner-lite'),
            'LESS_THAN'                 => esc_html__('Less Than', 'stachethemes-seat-planner-lite'),
            'CHECKED'                   => esc_html__('Checked', 'stachethemes-seat-planner-lite'),
            'NOT_CHECKED'               => esc_html__('Not Checked', 'stachethemes-seat-planner-lite'),
            'DISPLAY_CONDITIONS'        => esc_html__('Conditions (optional)', 'stachethemes-seat-planner-lite'),
            'DISPLAY_CONDITIONS_DESC'   => esc_html__('Control when this field is displayed based on the values of other fields. The field will only be shown if all conditions are met.', 'stachethemes-seat-planner-lite'),
            'CONDITION_CRITERIA'        => esc_html__('Condition Criteria', 'stachethemes-seat-planner-lite'),
            'CONDITION_VALUE'           => esc_html__('Condition Value', 'stachethemes-seat-planner-lite'),
            'NO_CONDITIONS_ADDED'       => esc_html__('No conditions added yet', 'stachethemes-seat-planner-lite'),
            'HOLD_CTRL_TO_SELECT_MULTIPLE' => esc_html__('Hold Ctrl to select multiple', 'stachethemes-seat-planner-lite'),
            'FILLED'                      => esc_html__('Filled', 'stachethemes-seat-planner-lite'),
            'NOT_FILLED'                  => esc_html__('Not Filled', 'stachethemes-seat-planner-lite'),
            'MUTUAL_EXCLUSIVITY'          => esc_html__('Mutual Exclusivity (optional)', 'stachethemes-seat-planner-lite'),
            'MUTUAL_EXCLUSIVITY_DESC'    => esc_html__('Specify fields that cannot be selected together with this field. When one field is selected, the mutually exclusive fields will be disabled.', 'stachethemes-seat-planner-lite'),
            'SELECT_FIELD_TO_ADD'         => esc_html__('Select field to add', 'stachethemes-seat-planner-lite'),
            'ADD_EXCLUSIVE_FIELD'         => esc_html__('Add Exclusive Field', 'stachethemes-seat-planner-lite'),
            'NO_EXCLUSIVE_FIELDS_ADDED'   => esc_html__('No exclusive fields added yet', 'stachethemes-seat-planner-lite'),
            'NO_CUSTOM_FIELDS_ADDED'      => esc_html__('No custom fields added yet', 'stachethemes-seat-planner-lite'),

            'IMPORT_SEAT_PLAN'               => esc_html__('Import Seat Plan', 'stachethemes-seat-planner-lite'),
            'IMPORT_SEAT_PLAN_DESC'          => esc_html__('Upload a CSV file to import your seat plan layout. The file should contain seat positions and properties.', 'stachethemes-seat-planner-lite'),
            'IMPORT_SEAT_PLAN_NOT_SUPPORTED_IN_LITE' => esc_html__('Importing seat plans is not supported in the Lite version. Upgrade to Pro to import seat plans.', 'stachethemes-seat-planner-lite'),
            'IMPORT'                         => esc_html__('Import', 'stachethemes-seat-planner-lite'),
            'DROP_CSV_FILE_HERE_OR'          => esc_html__('Drop your CSV file here, or', 'stachethemes-seat-planner-lite'),
            'BROWSE'                         => esc_html__('browse', 'stachethemes-seat-planner-lite'),
            'SUPPORTS_CSV_FILES'             => esc_html__('Supports .csv files only', 'stachethemes-seat-planner-lite'),

            // translators: %d: number of objects imported
            'D_OBJECTS_IMPORTED'             => esc_html__('%d Objects Imported', 'stachethemes-seat-planner-lite'),
            'EXPORT_SEAT_DATA'               => esc_html__('Export Seat Data', 'stachethemes-seat-planner-lite'),
            'EXPORT_SEAT_DATA_NOT_SUPPORTED_IN_LITE' => esc_html__('Exporting seat data is not supported in the Lite version. Upgrade to Pro to export seat data.', 'stachethemes-seat-planner-lite'),
            'EXPORTING_DATA'                 => esc_html__('Exporting Data', 'stachethemes-seat-planner-lite'),

            'SEAT_STATUS'                   => esc_html__('Seat Status', 'stachethemes-seat-planner-lite'),
            'SOLD_OUT'                      => esc_html__('Sold out', 'stachethemes-seat-planner-lite'),
            'AVAILABLE'                     => esc_html__('Available', 'stachethemes-seat-planner-lite'),
            'UNAVAILABLE'                   => esc_html__('Unavailable', 'stachethemes-seat-planner-lite'),
            'PURCHASABLE_ON_SITE'           => esc_html__('Purchasable on Site', 'stachethemes-seat-planner-lite'),

            // Seat reservation tab
            'RESERVED_SEATS_IN_CARTS'       => esc_html__('In-Cart Reserved Seats', 'stachethemes-seat-planner-lite'),
            'RESERVED_SEATS_IN_CARTS_DESC'  => esc_html__('Reserved seats will be automatically released after a set time if not purchased', 'stachethemes-seat-planner-lite'),
            'CLEAR_RESERVATIONS'            => esc_html__('Clear All', 'stachethemes-seat-planner-lite'),
            'RESERVED_SEATS_IN_CARTS_EMPTY' => esc_html__('No reserved seats found in carts', 'stachethemes-seat-planner-lite'),

            // Export Bookings
            'EXPORT_BOOKINGS'                 => esc_html__('Export Bookings', 'stachethemes-seat-planner-lite'),
            'ORDER_ID'                        => esc_html__('Order ID', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_NAME'                   => esc_html__('Customer Name', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_EMAIL'                  => esc_html__('Customer Email', 'stachethemes-seat-planner-lite'),
            'DATE_CREATED'                    => esc_html__('Date Created', 'stachethemes-seat-planner-lite'),
            'ORDER_STATUS'                    => esc_html__('Order Status', 'stachethemes-seat-planner-lite'),
            'PRODUCT_NAME'                    => esc_html__('Product Name', 'stachethemes-seat-planner-lite'),
            'DATE_TIME'                       => esc_html__('Date and Time', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_LOADING'         => esc_html__('Loading bookings...', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_SUCCESS'         => esc_html__('Bookings exported successfully.', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_ERROR'           => esc_html__('An error occurred while exporting bookings.', 'stachethemes-seat-planner-lite'),
            'PRODUCT_NOTE'                    => esc_html__('Product Note', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_SUCCESS_NO_DATA' => esc_html__('No bookings found for this product.', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_SUCCESS_NO_DATA_FOR_DATE' => esc_html__('No bookings found for the selected date.', 'stachethemes-seat-planner-lite'),
            'EXPORT_BOOKINGS_NOT_SUPPORTED_IN_LITE' => esc_html__('Exporting bookings is not supported in the Lite version. Upgrade to Pro to export bookings.', 'stachethemes-seat-planner-lite'),

            // Field selection for export
            'SELECT_FIELDS_TO_EXPORT_DESCRIPTION' => esc_html__('Select the fields you want to include in the export file', 'stachethemes-seat-planner-lite'),
            'SELECT_FIELDS_TO_EXPORT'             => esc_html__('Select Fields to Export', 'stachethemes-seat-planner-lite'),
            'SELECT_ALL'                          => esc_html__('Select All', 'stachethemes-seat-planner-lite'),
            'DESELECT_ALL'                        => esc_html__('Deselect All', 'stachethemes-seat-planner-lite'),
            'PLEASE_SELECT_AT_LEAST_ONE_FIELD'    => esc_html__('Please select at least one field to export.', 'stachethemes-seat-planner-lite'),
            'FILTER_BY_DATE'                      => esc_html__('Filter by date', 'stachethemes-seat-planner-lite'),
            'ALL_DATES'                           => esc_html__('All dates', 'stachethemes-seat-planner-lite'),
            'MANAGE_DATES_AND_TIMES'              => esc_html__('Manage Dates and Times', 'stachethemes-seat-planner-lite'),
            'MANAGE_DATES_AND_TIMES_DESC'         => esc_html__('Add multiple dates and times for this product here, or leave empty if not applicable', 'stachethemes-seat-planner-lite'),
            'ADD_DATE_AND_TIME'                   => esc_html__('Add Date and Time', 'stachethemes-seat-planner-lite'),
            'DATE_AND_TIME'                       => esc_html__('Date and Time', 'stachethemes-seat-planner-lite'),
            'NO_TIMES_ADDED'                      => esc_html__('No times added yet', 'stachethemes-seat-planner-lite'),

            'STOP_SELLING_TICKETS_BEFORE'               => esc_html__('Stop sales before the event', 'stachethemes-seat-planner-lite'),
            'STOP_SELLING_TICKETS_BEFORE_DESC'          => esc_html__('Prevent sales a set time before the event starts.', 'stachethemes-seat-planner-lite'),
            'STOP_SELLING_TICKETS_BEFORE_CUT_OFF_TIME'  => esc_html__('Cutoff time (hours before event)', 'stachethemes-seat-planner-lite'),

            // Cut-off time component
            'DAYS'                                      => esc_html__('Days', 'stachethemes-seat-planner-lite'),
            'DAY'                                       => esc_html__('Day', 'stachethemes-seat-planner-lite'),
            'HOURS'                                     => esc_html__('Hours', 'stachethemes-seat-planner-lite'),
            'HOUR'                                      => esc_html__('Hour', 'stachethemes-seat-planner-lite'),
            'MINUTES'                                   => esc_html__('Minutes', 'stachethemes-seat-planner-lite'),
            'MINUTE'                                    => esc_html__('Minute', 'stachethemes-seat-planner-lite'),
            'DAYS_SHORT'                                => esc_html_x('d', 'Days short form', 'stachethemes-seat-planner-lite'),
            'HOURS_SHORT'                               => esc_html_x('h', 'Hours short form', 'stachethemes-seat-planner-lite'),
            'MINUTES_SHORT'                             => esc_html_x('m', 'Minutes short form', 'stachethemes-seat-planner-lite'),
            // translators: %1$s - days number, %2$s - day/days, %3$s - hours number, %4$s - hour/hours, %5$s - minutes number, %6$s - minute/minutes
            'CUTOFF_TIME_SUMMARY'                       => esc_html__('Sales will stop %1$s %2$s, %3$s %4$s, and %5$s %6$s before each event starts', 'stachethemes-seat-planner-lite'),

            'EXPORT_CUSTOM_FIELDS'                => esc_html__('Custom Fields', 'stachethemes-seat-planner-lite'),
            'SEAT_PLANNER_EDITOR_HEAD'            => esc_html__('Seat Planner Editor', 'stachethemes-seat-planner-lite'),
            'SEAT_PLANNER_EDITOR_SUBTITLE'        => esc_html__('Design your seating layout easily with the drag-and-drop editor', 'stachethemes-seat-planner-lite'),

            // Dates
            'NO_DATES_ADDED'                      => esc_html__('No dates added yet', 'stachethemes-seat-planner-lite'),
            'DATES_NOT_SUPPORTED_IN_LITE'         => esc_html__('Adding dates is not supported in the Lite version. Upgrade to Pro to add multiple dates and times.', 'stachethemes-seat-planner-lite'),
            'DISCOUNTS_NOT_SUPPORTED_IN_LITE'     => esc_html__('Discounts are not supported in the Lite version. Upgrade to Pro to add discounts.', 'stachethemes-seat-planner-lite'),
            'CUSTOM_FIELDS_NOT_SUPPORTED_IN_LITE' => esc_html__('Custom fields are not supported in the Lite version. Upgrade to Pro to add custom fields.', 'stachethemes-seat-planner-lite'),
            'ADD_DATE'                            => esc_html__('Add Date', 'stachethemes-seat-planner-lite'),
            'ADD_TIME'                            => esc_html__('Add Time', 'stachethemes-seat-planner-lite'),
            'REMOVE_DATE'                         => esc_html__('Remove Date', 'stachethemes-seat-planner-lite'),
            'REMOVE_TIME'                         => esc_html__('Remove Time', 'stachethemes-seat-planner-lite'),
            'DUPLICATE_DATE'                      => esc_html__('Duplicate Date', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of times (singular)
            'D__TIME'                              => esc_html_x('%d Time Slot', 'number of times (singular)', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of times (plural)
            'D__TIMES'                             => esc_html_x('%d Time Slots', 'number of times (plural)', 'stachethemes-seat-planner-lite'),
            'EXPAND_ALL'                           => esc_html__('Expand All', 'stachethemes-seat-planner-lite'),
            'COLLAPSE_ALL'                         => esc_html__('Collapse All', 'stachethemes-seat-planner-lite'),
            'COLLAPSE'                              => esc_html__('Collapse', 'stachethemes-seat-planner-lite'),
            'EXPAND'                                => esc_html__('Expand', 'stachethemes-seat-planner-lite'),
            ...self::month_strings()

        ];
    }

    /**
     * Manager related strings
     *
     * @return array<string, string>
     */
    public static function manager_strings(): array {
        return [
            // Manager - Edit Seat
            'SELECTED'                       => esc_html__('Selected', 'stachethemes-seat-planner-lite'),
            'FIRST_PAGE'                     => esc_html__('First Page', 'stachethemes-seat-planner-lite'),
            'LAST_PAGE'                      => esc_html__('Last Page', 'stachethemes-seat-planner-lite'),
            'NEXT_PAGE'                      => esc_html__('Next Page', 'stachethemes-seat-planner-lite'),
            'PREVIOUS_PAGE'                  => esc_html__('Previous Page', 'stachethemes-seat-planner-lite'),
            'SEAT_PRICE'                     => esc_html__('Seat Price', 'stachethemes-seat-planner-lite'),
            'SEAT_TOTAL'                     => esc_html__('Seat Total (excl. tax)', 'stachethemes-seat-planner-lite'),
            'PRODUCT_ID_IS_REQUIRED'         => esc_html__('Product ID is required.', 'stachethemes-seat-planner-lite'),
            'SELECT_ALL'                     => esc_html__('Select All', 'stachethemes-seat-planner-lite'),
            'DESELECT_ALL'                   => esc_html__('Deselect All', 'stachethemes-seat-planner-lite'),
            'MANAGER_PRODUCTS'               => esc_html__('Products', 'stachethemes-seat-planner-lite'),
            'MANAGER_EDIT_SEAT_TITLE'        => esc_html__('Edit Seat', 'stachethemes-seat-planner-lite'),
            'MANAGER_EDIT_SEAT_DESCRIPTION'  => esc_html__('Override seat status and manage order details', 'stachethemes-seat-planner-lite'),
            'SEAT_ORDERED'                   => esc_html__('Seat Ordered', 'stachethemes-seat-planner-lite'),
            'SEAT_STATUS_OVERRIDE'           => esc_html__('Status Override', 'stachethemes-seat-planner-lite'),
            'SEAT_STATUS_OVERRIDE_DESC'      => esc_html__('Override the default status for this seat. This will take precedence over the product-level settings.', 'stachethemes-seat-planner-lite'),
            'SEAT_OVERRIDE_SAVED'            => esc_html__('Seat status override saved successfully.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_UPDATE_SEAT_OVERRIDE' => esc_html__('Failed to update seat status override.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_SEAT_DATA'      => esc_html__('Failed to fetch seat data.', 'stachethemes-seat-planner-lite'),
            'ORDER_DETAILS'                  => esc_html__('Order Details', 'stachethemes-seat-planner-lite'),
            'ORDER_DETAILS_DESC'             => esc_html__('This seat is linked to an existing order. You can edit the seat assignment below.', 'stachethemes-seat-planner-lite'),
            'CUSTOMER'                       => esc_html__('Customer', 'stachethemes-seat-planner-lite'),
            'NEW_SEAT_ID'                    => esc_html__('New Seat ID', 'stachethemes-seat-planner-lite'),
            'NEW_DATE'                       => esc_html__('New Date', 'stachethemes-seat-planner-lite'),
            'UPDATE_ORDER'                   => esc_html__('Update Order', 'stachethemes-seat-planner-lite'),
            'ORDER_UPDATED'                  => esc_html__('Order updated successfully.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_ORDER_DETAILS'  => esc_html__('Failed to fetch order details.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_UPDATE_ORDER_ITEM'    => esc_html__('Failed to update order item.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_PRODUCTS'       => esc_html__('Failed to fetch products.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_SEAT_AVAILABILITY' => esc_html__('Failed to fetch seat availability.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_DATES'          => esc_html__('Failed to fetch dates.', 'stachethemes-seat-planner-lite'),
            'SAVE_CHANGES'                   => esc_html__('Save Changes', 'stachethemes-seat-planner-lite'),
            'CANCEL'                         => esc_html__('Cancel', 'stachethemes-seat-planner-lite'),
            'MANAGER_LISTING_TITLE'          => esc_html__('Manage Products', 'stachethemes-seat-planner-lite'),
            'MANAGER_LISTING_DESCRIPTION'    => esc_html__('Manage the availability of your auditorium products.', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of products (singular)
            'PRODUCT_COUNT_SINGULAR'         => esc_html__('%d Auditorium Product Found', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of products (plural)
            'PRODUCT_COUNT_PLURAL'           => esc_html__('%d Auditorium Products Found', 'stachethemes-seat-planner-lite'),
            'DATED_EVENT'                    => esc_html__('Dated Event', 'stachethemes-seat-planner-lite'),
            'STANDARD'                       => esc_html__('Standard', 'stachethemes-seat-planner-lite'),
            'VIEW_DATES'                     => esc_html__('View Dates', 'stachethemes-seat-planner-lite'),
            'CHECK_AVAILABILITY'             => esc_html__('Check Availability', 'stachethemes-seat-planner-lite'),
            'EDIT_PRODUCT'                   => esc_html__('Edit Product', 'stachethemes-seat-planner-lite'),
            'VIEW_PRODUCT'                   => esc_html__('View Product', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of time slots (singular)
            'TIME_SLOT_SINGULAR'             => esc_html__('%d Time Slot', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of time slots (plural)
            'TIME_SLOTS_PLURAL'                => esc_html__('%d Time Slots', 'stachethemes-seat-planner-lite'),
            'TOTAL_SEATS'                      => esc_html__('Total Seats', 'stachethemes-seat-planner-lite'),
            'STATUS_AVAILABLE'                 => esc_html__('Available', 'stachethemes-seat-planner-lite'),
            'STATUS_UNAVAILABLE'               => esc_html__('Unavailable', 'stachethemes-seat-planner-lite'),
            'STATUS_SOLD_OUT'                  => esc_html__('Sold Out', 'stachethemes-seat-planner-lite'),
            'STATUS_ON_SITE'                   => esc_html__('On Site', 'stachethemes-seat-planner-lite'),
            'SEARCH_SEATS'                     => esc_html__('Search Seats', 'stachethemes-seat-planner-lite'),
            'MANAGER_AVAILABILITY_TITLE'       => esc_html__('Seat Availability', 'stachethemes-seat-planner-lite'),
            'MANAGER_AVAILABILITY_DESCRIPTION' => esc_html__('View and manage the availability of your seats.', 'stachethemes-seat-planner-lite'),
            // translators: %s - date and time
            'MANAGER_AVAILABILITY_DESCRIPTION_FOR_DATE' => esc_html__('View and manage the availability of your seats for %s.', 'stachethemes-seat-planner-lite'),
            'STATUS'                           => esc_html__('Status', 'stachethemes-seat-planner-lite'),
            'MANAGER_DATES_TITLE'              => esc_html__('Dates and Times', 'stachethemes-seat-planner-lite'),
            'MANAGER_DATES_DESCRIPTION'        => esc_html__('Manage product dates and time slots.', 'stachethemes-seat-planner-lite'),
            'SEARCH_PRODUCTS'                  => esc_html__('Search Products', 'stachethemes-seat-planner-lite'),
            'MANAGER_LOADING'                  => esc_html__('Just a moment', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of seats (singular)
            'SEAT_SINGULAR'                     => esc_html__('%d Seat', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of seats (plural)
            'SEATS_PLURAL'                             => esc_html__('%d Seats', 'stachethemes-seat-planner-lite'),
            'NO_PRODUCTS_MATCH_SEARCH'                 => esc_html__('No products match your search.', 'stachethemes-seat-planner-lite'),
            'TRY_DIFFERENT_SEARCH_TERM'                => esc_html__('Try different search term.', 'stachethemes-seat-planner-lite'),
            'CREATE_AUDITORIUM_PRODUCT_TO_GET_STARTED' => esc_html__('Create an auditorium product to get started.', 'stachethemes-seat-planner-lite'),
            'PAGE'                                     => esc_html__('Page', 'stachethemes-seat-planner-lite'),
            'NO_SEATS_MATCH_FILTER'                    => esc_html__('No seats match your filter.', 'stachethemes-seat-planner-lite'),
            'PRICE'                                    => esc_html__('Price', 'stachethemes-seat-planner-lite'),
            'ORDER_DATE'                               => esc_html__('Order Date', 'stachethemes-seat-planner-lite'),
            'NO_DATES_FOUND'                           => esc_html__('No dates found.', 'stachethemes-seat-planner-lite'),
            'NO_DATES_CONFIGURED_FOR_PRODUCT'          => esc_html__('No dates configured for this product.', 'stachethemes-seat-planner-lite'),
            'AVAILABLE_TIME_SLOTS'                     => esc_html__('Available Time Slots', 'stachethemes-seat-planner-lite'),
            // translators: %s - time
            'VIEW_AVAILABILITY_FOR__S'                 => esc_html__('View availability for %s', 'stachethemes-seat-planner-lite'),
            'NEXT_MONTH'                                => esc_html__('Next Month', 'stachethemes-seat-planner-lite'),
            'PREVIOUS_MONTH'                            => esc_html__('Previous Month', 'stachethemes-seat-planner-lite'),

            // Bulk Seat Availability
            'BULK_UPDATE_STATUS'                        => esc_html__('Set status to:', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats */
            'SEATS_SELECTED'                            => esc_html__('%d seats selected', 'stachethemes-seat-planner-lite'),
            'ENTER_SELECTION_MODE'                      => esc_html__('Bulk Select', 'stachethemes-seat-planner-lite'),
            'EXIT_SELECTION_MODE'                       => esc_html__('Cancel', 'stachethemes-seat-planner-lite'),
            'BULK_UPDATE_SUCCESS'                       => esc_html__('Successfully updated seats.', 'stachethemes-seat-planner-lite'),
            'BULK_UPDATE_PARTIAL_SUCCESS'               => esc_html__('Updated some seats. Some were skipped due to existing orders.', 'stachethemes-seat-planner-lite'),
            'BULK_UPDATE_FAILED'                        => esc_html__('Failed to update seats.', 'stachethemes-seat-planner-lite'),
            'RESET_TO_DEFAULT'                          => esc_html__('Reset to Default', 'stachethemes-seat-planner-lite'),
            'UPDATING'                                  => esc_html__('Updating...', 'stachethemes-seat-planner-lite'),
            
            'SEAT_CONFIGURATION'                        => esc_html__('Seat Configuration', 'stachethemes-seat-planner-lite'),
            'GENERAL_INFO'                              => esc_html__('General Info', 'stachethemes-seat-planner-lite'),
            'SEAT_OPTIONS'                              => esc_html__('Seat Options', 'stachethemes-seat-planner-lite'),
            'ORDER_CREATED_SUCCESS'                     => esc_html__('Order created successfully!', 'stachethemes-seat-planner-lite'),
            'ORDER_CREATION_FAILED'                     => esc_html__('Failed to create order.', 'stachethemes-seat-planner-lite'),
            'NO_SEAT_OPTIONS'                           => esc_html__('No seat options available.', 'stachethemes-seat-planner-lite'),
            
            // Bulk Move to Date
            'SET_STATUS_TO'                             => esc_html__('Set status to:', 'stachethemes-seat-planner-lite'),
            'MOVE'                                      => esc_html__('Move', 'stachethemes-seat-planner-lite'),
            'BULK_MOVE_TO_DATE'                         => esc_html__('Move to Date', 'stachethemes-seat-planner-lite'),
            'BULK_MOVE_DESCRIPTION'                     => esc_html__('Relocate selected bookings and status overrides to another date.', 'stachethemes-seat-planner-lite'),
            'BULK_SELECT_TARGET_DATE'                   => esc_html__('Target Date & Time', 'stachethemes-seat-planner-lite'),
            'BULK_SEND_NOTIFICATIONS'                   => esc_html__('Re-send order notifications to customers', 'stachethemes-seat-planner-lite'),
            'BULK_CONFIRM_MOVE'                         => esc_html__('Confirm Move', 'stachethemes-seat-planner-lite'),
            'BULK_MOVING_BOOKINGS'                      => esc_html__('Moving seats...', 'stachethemes-seat-planner-lite'),
            'BULK_MOVE_SUCCESS'                         => esc_html__('Successfully moved seats to new date.', 'stachethemes-seat-planner-lite'),
            'BULK_MOVE_PARTIAL_SUCCESS'                 => esc_html__('Moved some seats. Others had no orders or status overrides to move.', 'stachethemes-seat-planner-lite'),
            'BULK_MOVE_FAILED'                          => esc_html__('Failed to move seats.', 'stachethemes-seat-planner-lite'),
            'BULK_MOVE_NOT_IMPLEMENTED'                 => esc_html__('Bulk move feature is not yet implemented on the server.', 'stachethemes-seat-planner-lite'),
            'BULK_MOVE_COMPLETE'                        => esc_html__('Seats Moved Successfully', 'stachethemes-seat-planner-lite'),
            /* translators: %1$d: number of seats moved, %2$s: source date, %3$d: number of notifications sent */
            'BULK_MOVE_NOTICE_TEXT'                     => esc_html__('%1$d seat(s) were moved from %2$s to this date. %3$d notification email(s) sent.', 'stachethemes-seat-planner-lite'),
            /* translators: %d: number of seats skipped */
            'BULK_MOVE_SKIPPED_TEXT'                    => esc_html__('%d seat(s) were skipped (no orders or status overrides to move).', 'stachethemes-seat-planner-lite'),

            'NO_SEATS_FOUND'                             => esc_html__('No seats found.', 'stachethemes-seat-planner-lite'),
            'NO_SEATS_CONFIGURED_FOR_PRODUCT'            => esc_html__('No seats found for this product.', 'stachethemes-seat-planner-lite'),
            'STATUS_CANNOT_BE_CHANGED'                   => esc_html__('The seat status cannot be changed because it is linked to an order.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_UPDATE_ORDER'                     => esc_html__('Failed to update order.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_SAVE_SEAT_OVERRIDE'               => esc_html__('Failed to update seat.', 'stachethemes-seat-planner-lite'),
            
            // Create Order
            'CREATE_ORDER'                               => esc_html__('Create Order', 'stachethemes-seat-planner-lite'),
            'CREATE_ORDER_FOR_SEAT_DESC'                 => esc_html__('Create a new order for this seat by providing customer details below.', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_NAME'                              => esc_html__('Customer Name', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_EMAIL'                             => esc_html__('Customer Email', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_PHONE'                             => esc_html__('Customer Phone', 'stachethemes-seat-planner-lite'),
            'ENTER_CUSTOMER_NAME'                        => esc_html__('Enter customer name', 'stachethemes-seat-planner-lite'),
            'ENTER_CUSTOMER_EMAIL'                       => esc_html__('Enter customer email', 'stachethemes-seat-planner-lite'),
            'ENTER_CUSTOMER_PHONE'                       => esc_html__('Enter customer phone', 'stachethemes-seat-planner-lite'),
            'CREATING_ORDER'                             => esc_html__('Creating order...', 'stachethemes-seat-planner-lite'),
            'ORDER_CREATED_SUCCESSFULLY'                 => esc_html__('Order created successfully!', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_CREATE_ORDER'                     => esc_html__('Failed to create order.', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_NAME_REQUIRED'                     => esc_html__('Customer name is required.', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_EMAIL_REQUIRED'                    => esc_html__('Customer email is required.', 'stachethemes-seat-planner-lite'),
            'CUSTOMER_EMAIL_INVALID'                     => esc_html__('Please enter a valid email address.', 'stachethemes-seat-planner-lite'),
            'CLEAR_FORM'                                 => esc_html__('Clear Form', 'stachethemes-seat-planner-lite'),
            'OPTIONAL'                                   => esc_html__('Optional', 'stachethemes-seat-planner-lite'),
            'DISCOUNT'                                   => esc_html__('Discount', 'stachethemes-seat-planner-lite'),
            'NO_DISCOUNT'                                 => esc_html__('No discount', 'stachethemes-seat-planner-lite'),
            /* translators: %s: custom field label */
            'CUSTOM_FIELD_REQUIRED'                       => esc_html__('%s is required.', 'stachethemes-seat-planner-lite'),
            /* translators: 1: field label, 2: minimum value */
            'CUSTOM_FIELD_NUMBER_MIN'                     => esc_html__('Seat option "%1$s" must be at least %2$s.', 'stachethemes-seat-planner-lite'),
            /* translators: 1: field label, 2: maximum value */
            'CUSTOM_FIELD_NUMBER_MAX'                     => esc_html__('Seat option "%1$s" must be at most %2$s.', 'stachethemes-seat-planner-lite'),
            'SEND_ORDER_EMAIL'                           => esc_html__('Send order notifications to customers', 'stachethemes-seat-planner-lite'),
            'PENDING'                                    => esc_html__('Pending Payment', 'stachethemes-seat-planner-lite'),
            'PROCESSING'                                 => esc_html__('Processing', 'stachethemes-seat-planner-lite'),
            'ON_HOLD'                                    => esc_html__('On Hold', 'stachethemes-seat-planner-lite'),
            'COMPLETED'                                  => esc_html__('Completed', 'stachethemes-seat-planner-lite'),
        ];
    }

    /**
     * Translates the dashboard strings
     *
     * @return array<string, string>
     */
    public static function get_dashboard_strings(): array {
        return [
            'TAB_PRO'                                       => esc_html__('Pro', 'stachethemes-seat-planner-lite'),
            'DASHBOARD'                                     => esc_html__('Dashboard', 'stachethemes-seat-planner-lite'),
            'PAGE_NOT_FOUND'                                => esc_html__('Page not found', 'stachethemes-seat-planner-lite'),
            'OPS'                                           => esc_html__('Oops!', 'stachethemes-seat-planner-lite'),
            'THE_PAGE_YOU_ARE_LOOKING_FOR_DOES_NOT_EXIST'   => esc_html__('The page you are looking for does not exist.', 'stachethemes-seat-planner-lite'),
            'GO_HOME'                                       => esc_html__('Go Home', 'stachethemes-seat-planner-lite'),


            // Pro features
            'PRO_FEATURES'                    => esc_html__('Pro Features', 'stachethemes-seat-planner-lite'),
            'PRO_FEATURES_DESC'               => esc_html__('Upgrade to the Pro version to access these features.', 'stachethemes-seat-planner-lite'),
            'PROF_NO_OBJECTS_CAP'             => esc_html__('No Seats Limit', 'stachethemes-seat-planner-lite'),
            'PROF_NO_OBJECTS_CAP_DESC'        => esc_html__('You can create unlimited seats in the Pro version', 'stachethemes-seat-planner-lite'),
            'PROF_DATES'                      => esc_html__('Dates', 'stachethemes-seat-planner-lite'),
            'PROF_DATES_DESC'                 => esc_html__('You can select dates and times for each product in the Pro version', 'stachethemes-seat-planner-lite'),
            'PROF_DISCOUNTS'                  => esc_html__('Discounts', 'stachethemes-seat-planner-lite'),
            'PROF_DISCOUNTS_DESC'             => esc_html__('You can offer discounts to your customers in the Pro version', 'stachethemes-seat-planner-lite'),
            'PROF_CUSTOM_FIELDS'              => esc_html__('Custom Fields', 'stachethemes-seat-planner-lite'),
            'PROF_CUSTOM_FIELDS_DESC'         => esc_html__('You can add custom fields to your products in the Pro version', 'stachethemes-seat-planner-lite'),
            'PROF_ATTACHMENTS'                => esc_html__('Attachments', 'stachethemes-seat-planner-lite'),
            'PROF_ATTACHMENTS_DESC'           => esc_html__('You can attach PDF tickets to the order confirmation email in the Pro version', 'stachethemes-seat-planner-lite'),
            'PROF_CSV_IMPORT_EXPORT'          => esc_html__('CSV Import/Export', 'stachethemes-seat-planner-lite'),
            'PROF_CSV_IMPORT_EXPORT_DESC'     => esc_html__('You can import and export your data in CSV format in the Pro version', 'stachethemes-seat-planner-lite'),
            'PROF_APP'                        => esc_html__('Mobile App', 'stachethemes-seat-planner-lite'),
            'PROF_APP_DESC'                   => esc_html__('Scan QR codes to verify and check-in guests at your venue from your phone.', 'stachethemes-seat-planner-lite'),
            'GET_PRO_VERSION'                 => esc_html__('Get Pro Version', 'stachethemes-seat-planner-lite'),
            'PRO_CTA_TEXT'                    => esc_html__('Upgrade to the Pro version to access these features.', 'stachethemes-seat-planner-lite'),
            'PROF_SUPPORT'                    => esc_html__('Support', 'stachethemes-seat-planner-lite'),
            'PROF_SUPPORT_DESC'               => esc_html__('Free customer support & updates.', 'stachethemes-seat-planner-lite'),


            // Overview page
            'OVERVIEW_TITLE'                                => esc_html__('Overview', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_DESCRIPTION'                          => esc_html__('Welcome to your Seat Planner dashboard. Get a quick overview of your venue bookings.', 'stachethemes-seat-planner-lite'),

            // Stats section
            'OVERVIEW_STATS_TITLE'                          => esc_html__('At a Glance', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_STAT_PRODUCTS'                        => esc_html__('Auditorium Products', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_STAT_SEATS'                           => esc_html__('Seats Sold', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_STAT_REVENUE'                         => esc_html__('Revenue', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_STAT_SCANNED_TODAY'                   => esc_html__('Scanned Today', 'stachethemes-seat-planner-lite'),

            // Quick actions section
            'OVERVIEW_ACTIONS_TITLE'                        => esc_html__('Quick Actions', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_SCANNER'                       => esc_html__('Ticket Scanner', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_SCANNER_DESC'                  => esc_html__('Scan QR codes to verify and check-in guests at your venue.', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_TOOLS'                         => esc_html__('Tools', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_TOOLS_DESC'                    => esc_html__('Run integrity checks and preview PDF tickets.', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_SETTINGS'                      => esc_html__('Settings', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_SETTINGS_DESC'                 => esc_html__('Configure reservation time, cart behavior and more.', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_MANAGER'                       => esc_html__('Manager', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_ACTION_MANAGER_DESC'                  => esc_html__('View and manage products availability.', 'stachethemes-seat-planner-lite'),

            // Help section
            'OVERVIEW_HELP_TITLE'                           => esc_html__('Resources', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_HELP_DOCS'                            => esc_html__('Documentation', 'stachethemes-seat-planner-lite'),
            'OVERVIEW_HELP_SUPPORT'                         => esc_html__('Get Support', 'stachethemes-seat-planner-lite'),

            // Common strings
            'CHECK_NOW'                      => esc_html__('Check Now', 'stachethemes-seat-planner-lite'),
            'CHECKING'                       => esc_html__('Checking...', 'stachethemes-seat-planner-lite'),
            'CANCEL'                         => esc_html__('Cancel', 'stachethemes-seat-planner-lite'),
            'PREPARING_TO_CHECK'             => esc_html__('Preparing to check...', 'stachethemes-seat-planner-lite'),
            'TRY_AGAIN'                      => esc_html__('Try Again', 'stachethemes-seat-planner-lite'),
            'RESULTS'                        => esc_html__('Results', 'stachethemes-seat-planner-lite'),
            // translators: %1$d - number of products checked, %2$d - total number of products
            'RESULTS_COUNT'                  => esc_html__('Results (%1$d of %2$d products checked)', 'stachethemes-seat-planner-lite'),
            'SEAT_ID'                        => esc_html__('Seat ID', 'stachethemes-seat-planner-lite'),
            'ORDER_IDS'                      => esc_html__('Order IDs', 'stachethemes-seat-planner-lite'),
            'NO_PRODUCTS_FOUND'              => esc_html__('No products found to check.', 'stachethemes-seat-planner-lite'),
            'ACTIONS'                        => esc_html__('Actions', 'stachethemes-seat-planner-lite'),
            'NO_ISSUES'                      => esc_html__('No issues', 'stachethemes-seat-planner-lite'),

            // Check type selector
            'SELECT_CHECK_TYPE'              => esc_html__('Select Check Type', 'stachethemes-seat-planner-lite'),
            'CHECK_TYPE_DOUBLE_BOOKING'      => esc_html__('Double Booking Check', 'stachethemes-seat-planner-lite'),
            'CHECK_TYPE_GHOST_BOOKING'       => esc_html__('Ghost Booking Check', 'stachethemes-seat-planner-lite'),
            'CHECK_TYPE_DOUBLE_DESC'         => esc_html__('Find seats that have been booked multiple times (same seat appears in multiple orders).', 'stachethemes-seat-planner-lite'),
            'CHECK_TYPE_GHOST_DESC'          => esc_html__('Find seats that appear free on the front-end but have existing orders (data inconsistency).', 'stachethemes-seat-planner-lite'),

            // Double booking specific strings
            // translators: %1$d - number of products being checked, %2$d - total number of products
            'CHECKING_DOUBLE_BOOKING'        => esc_html__('Checking for double bookings... %1$d of %2$d products', 'stachethemes-seat-planner-lite'),
            'ERROR_DOUBLE_BOOKING'           => esc_html__('An error occurred while checking for double bookings.', 'stachethemes-seat-planner-lite'),
            'NO_DUPLICATES'                  => esc_html__('No duplicates', 'stachethemes-seat-planner-lite'),
            'ONE_DUPLICATE'                  => esc_html__('1 duplicate', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of duplicates
            'MULTIPLE_DUPLICATES'            => esc_html__('%d duplicates', 'stachethemes-seat-planner-lite'),
            'BOOKING_COUNT'                  => esc_html__('Booking Count', 'stachethemes-seat-planner-lite'),
            'NO_DUPLICATE_BOOKINGS'          => esc_html__('No duplicate bookings found for this product.', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of products with duplicate bookings (plural)
            'DOUBLE_CHECK_COMPLETE'          => esc_html__('Check complete. %d products have duplicate bookings.', 'stachethemes-seat-planner-lite'),
            // translators: For when only one product has duplicate bookings
            'DOUBLE_CHECK_COMPLETE_SINGULAR' => esc_html__('Check complete. 1 product has duplicate bookings.', 'stachethemes-seat-planner-lite'),
            'DOUBLE_CHECK_COMPLETE_NONE'     => esc_html__('Check complete. No duplicate bookings found.', 'stachethemes-seat-planner-lite'),

            // Ghost booking specific strings
            // translators: %1$d - number of products being checked, %2$d - total number of products
            'CHECKING_GHOST_BOOKING'         => esc_html__('Checking for ghost bookings... %1$d of %2$d products', 'stachethemes-seat-planner-lite'),
            'ERROR_GHOST_BOOKING'            => esc_html__('An error occurred while checking for ghost bookings.', 'stachethemes-seat-planner-lite'),
            'NO_GHOST_SEATS'                 => esc_html__('No issues', 'stachethemes-seat-planner-lite'),
            'ONE_GHOST_SEAT'                 => esc_html__('1 ghost seat', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of ghost seats
            'MULTIPLE_GHOST_SEATS'           => esc_html__('%d ghost seats', 'stachethemes-seat-planner-lite'),
            'EVENT_DATE'                     => esc_html__('Event Date', 'stachethemes-seat-planner-lite'),
            'ORDER_COUNT'                    => esc_html__('Order Count', 'stachethemes-seat-planner-lite'),
            'NO_GHOST_BOOKINGS'              => esc_html__('No ghost bookings found for this product.', 'stachethemes-seat-planner-lite'),
            // translators: %d - number of products with ghost bookings (plural)
            'GHOST_CHECK_COMPLETE'           => esc_html__('Check complete. %d products have ghost bookings.', 'stachethemes-seat-planner-lite'),
            // translators: For when only one product has ghost bookings
            'GHOST_CHECK_COMPLETE_SINGULAR'  => esc_html__('Check complete. 1 product has ghost bookings.', 'stachethemes-seat-planner-lite'),
            'GHOST_CHECK_COMPLETE_NONE'      => esc_html__('Check complete. No ghost bookings found.', 'stachethemes-seat-planner-lite'),
            'FIX_GHOST_BOOKING'              => esc_html__('Mark as Taken', 'stachethemes-seat-planner-lite'),
            'FIXING'                         => esc_html__('Fixing...', 'stachethemes-seat-planner-lite'),
            'FIXED'                          => esc_html__('Fixed', 'stachethemes-seat-planner-lite'),
            'FIX_FAILED'                     => esc_html__('Fix failed', 'stachethemes-seat-planner-lite'),
            'NO_DATE'                        => esc_html__('No specific date', 'stachethemes-seat-planner-lite'),

            // Tools page
            'TOOLS_PAGE_TITLE'                => esc_html__('Tools', 'stachethemes-seat-planner-lite'),
            'TOOLS_PAGE_DESCRIPTION'          => esc_html__('Utility tools for managing your seat planner bookings and PDF tickets.', 'stachethemes-seat-planner-lite'),
            'TOOLS_TAB_BOOKING_INTEGRITY'     => esc_html__('Booking Integrity', 'stachethemes-seat-planner-lite'),
            'TOOLS_TAB_PDF_PREVIEW'           => esc_html__('PDF Preview', 'stachethemes-seat-planner-lite'),
            'TOOLS_TAB_EDIT_ORDER'            => esc_html__('Edit Order', 'stachethemes-seat-planner-lite'),

            // Edit Order Items Tool
            'EDIT_ORDER_TITLE'                => esc_html__('Edit Order Item Metadata', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_DESCRIPTION'          => esc_html__('Search for an order by ID to edit the seat data of auditorium product items. You can modify the Seat ID, Date, and custom fields.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_INVALID_ORDER_ID'     => esc_html__('Please enter a valid order ID.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_FETCH_ERROR'          => esc_html__('Failed to fetch order items. Please try again.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_NO_ITEMS'             => esc_html__('No auditorium product items found in this order.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_SAVE_ERROR'           => esc_html__('Failed to save changes. Please try again.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_EMPTY_SEAT_ID'        => esc_html__('Seat ID cannot be empty.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_EMPTY_DATE'           => esc_html__('Date cannot be empty for products with dates.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_SAVE_SUCCESS'         => esc_html__('Changes saved successfully!', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_SAVE_CHANGES'         => esc_html__('Save Changes', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_ORDER_ID_PLACEHOLDER' => esc_html__('e.g., 1234', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_LOADING'              => esc_html__('Loading...', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_SEARCH'               => esc_html__('Search Order', 'stachethemes-seat-planner-lite'),
            // translators: %s - order ID
            'EDIT_ORDER_ORDER_NUMBER'         => esc_html__('Order #%s', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_ORDER_TOTAL'          => esc_html__('Order Total (excl. tax)', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_ITEM_ID'              => esc_html__('Item ID', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_VIEW_PRODUCT'         => esc_html__('View Product', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_CUSTOM_FIELDS'        => esc_html__('Custom Fields', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_TICKET_SCANNED'       => esc_html__('This ticket has already been scanned', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_NOTES_TITLE'          => esc_html__('Important Notes', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_NOTE_1'               => esc_html__('Changes will be recorded in the order notes for audit purposes.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_NOTE_2'               => esc_html__('QR code data and scan status are preserved and cannot be modified here.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_NOTE_3'               => esc_html__('When changing a Seat ID, the old seat will be released and the new seat will be marked as taken automatically.', 'stachethemes-seat-planner-lite'),
            'EDIT_ORDER_NOTE_4'               => esc_html__('Price is re-calculated based on the new seat and custom fields.', 'stachethemes-seat-planner-lite'),

            // PDF Preview
            'PDF_PREVIEW_TITLE'               => esc_html__('Preview Order PDF', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_DESCRIPTION'         => esc_html__('Enter an order ID to preview the PDF ticket that would be generated for that order. The PDF will open in a new tab.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_ORDER_ID_LABEL'      => esc_html__('Order ID', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_ORDER_ID_DESC'       => esc_html__('Enter the WooCommerce order ID to preview its PDF ticket.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_ORDER_ID_PLACEHOLDER' => esc_html__('e.g., 1234', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_BUTTON'              => esc_html__('Preview PDF', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_INVALID_ORDER_ID'    => esc_html__('Please enter a valid order ID.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_ERROR_INVALID_ORDER_ID' => esc_html__('Please enter a valid order ID.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_ERROR_ORDER_NOT_FOUND' => esc_html__('Order not found.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_ERROR_PDF_FAILED'    => esc_html__('Failed to generate PDF. The order may not contain auditorium products.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_ERROR_FORBIDDEN'     => esc_html__('You do not have permission to preview PDFs.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_NOTES_TITLE'         => esc_html__('Important Notes', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_NOTE_1'              => esc_html__('The order must contain at least one auditorium product to generate a PDF.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_NOTE_2'              => esc_html__('PDF templates can be customized by placing stachesepl-pdf-body.php and stachesepl-pdf-loop.php template files in your theme.', 'stachethemes-seat-planner-lite'),
            'PDF_PREVIEW_NOTE_3'              => esc_html__('Use this tool to test your PDF template before sending tickets to customers.', 'stachethemes-seat-planner-lite'),

            // Order Not Found Page
            'ORDER_NOT_FOUND_HEADER'          => esc_html__('Order Not Found', 'stachethemes-seat-planner-lite'),
            'ORDER_NOT_FOUND_TITLE'           => esc_html__('Oops!', 'stachethemes-seat-planner-lite'),
            'ORDER_NOT_FOUND_MESSAGE'         => esc_html__('The order you are looking for could not be found. It may have been deleted or the ID may be incorrect.', 'stachethemes-seat-planner-lite'),
            // translators: %s - order ID
            'ORDER_NOT_FOUND_MESSAGE_WITH_ID' => esc_html__('Order #%s could not be found. It may have been deleted or the ID may be incorrect.', 'stachethemes-seat-planner-lite'),
            'GO_TO_TOOLS'                     => esc_html__('Go to Tools', 'stachethemes-seat-planner-lite'),

            'QR_CUSTOM_FIELDS'                               => esc_html__('Custom Fields', 'stachethemes-seat-planner-lite'),
            'QR_CODE_SCAN_FAILED'                            => esc_html__('QR code scan failed. Please try again.', 'stachethemes-seat-planner-lite'),
            'CAMERA_ACCESS_DENIED'                           => esc_html__('Camera access denied. Please allow camera access to scan QR codes.', 'stachethemes-seat-planner-lite'),
            'CAMERA_IN_USE_OR_UNAVAILABLE'                   => esc_html__('Camera is in use by another application or unavailable. Please close other applications using the camera and try again.', 'stachethemes-seat-planner-lite'),
            'NO_CAMERA_FOUND'                                => esc_html__('No camera found. Please ensure a camera is connected and try again.', 'stachethemes-seat-planner-lite'),
            'QR_CODE_INVALID'                                => esc_html__('This QR code does not contain valid seat data.', 'stachethemes-seat-planner-lite'),
            'JUST_A_MOMENT'                                  => esc_html__('Just a moment', 'stachethemes-seat-planner-lite'),
            'SEAT_SCANNER'                                   => esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite'),
            'SCAN_THE_QR_CODE_TO_GET_SEAT_DETAILS'           => esc_html__('Scan the QR code to validate your ticket', 'stachethemes-seat-planner-lite'),
            'SCAN_NOW'                                       => esc_html__('Scan Now', 'stachethemes-seat-planner-lite'),
            'SCAN_NEW_TICKET'                                => esc_html__('Scan New Ticket', 'stachethemes-seat-planner-lite'),
            'ORDER_ID'                                       => esc_html__('Order ID', 'stachethemes-seat-planner-lite'),
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
            'DATE'                                           => esc_html__('Date', 'stachethemes-seat-planner-lite'),
            'SCAN_TICKETS_TO_VERIFY_AND_CHECK_IN'            => esc_html__('Scan tickets to verify and check-in guests', 'stachethemes-seat-planner-lite'),
            'SCAN_QR_CODE'                                   => esc_html__('Scan QR Code', 'stachethemes-seat-planner-lite'),
            'POSITION_QR_CODE_IN_FRAME'                      => esc_html__('Position the QR code within the frame to scan', 'stachethemes-seat-planner-lite'),
            'VIEW_ORDER'                                     => esc_html__('View Order', 'stachethemes-seat-planner-lite'),
            'N/A'                                            => esc_html__('N/A', 'stachethemes-seat-planner-lite'),

            // Settings page
            'SETTINGS_TITLE'                                 => esc_html__('Settings', 'stachethemes-seat-planner-lite'),
            'SETTINGS_DESCRIPTION'                           => esc_html__('This is where you can configure all the plugin settings.', 'stachethemes-seat-planner-lite'),
            'TAB_GENERAL'                                    => esc_html__('General', 'stachethemes-seat-planner-lite'),
            'TAB_CART_BEHAVIOR'                              => esc_html__('Cart Behavior', 'stachethemes-seat-planner-lite'),
            'TAB_ATTACHMENTS'                                => esc_html__('Attachments', 'stachethemes-seat-planner-lite'),
            'TAB_MOBILE_APP'                                 => esc_html__('Mobile App', 'stachethemes-seat-planner-lite'),
            'SAVING_SETTINGS'                                => esc_html__('Saving settings...', 'stachethemes-seat-planner-lite'),
            'SETTINGS_SAVED_SUCCESSFULLY'                    => esc_html__('Settings saved successfully!', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_SAVE_SETTINGS'                        => esc_html__('Failed to save settings', 'stachethemes-seat-planner-lite'),
            'SAVING'                                         => esc_html__('Saving...', 'stachethemes-seat-planner-lite'),
            'SAVE_SETTINGS'                                  => esc_html__('Save Settings', 'stachethemes-seat-planner-lite'),

            // General tab

            'SEAT_SELECTOR_TOOLTIP'                         => esc_html__('Seat Selector Tooltip', 'stachethemes-seat-planner-lite'),
            'SEAT_SELECTOR_TOOLTIP_DESC'                    => esc_html__('Display seat details in a tooltip on hover or touch.', 'stachethemes-seat-planner-lite'),
         
            'DISABLE_TOOLTIP'                               => esc_html__('Disabled', 'stachethemes-seat-planner-lite'),
            'ENABLE_TOOLTIP_FOR_DESKTOP'                    => esc_html__('Desktop Only', 'stachethemes-seat-planner-lite'),
            'ENABLE_TOOLTIP_FOR_MOBILE'                     => esc_html__('Mobile Only', 'stachethemes-seat-planner-lite'),
            'ENABLE_TOOLTIP_ALWAYS'                         => esc_html__('Always', 'stachethemes-seat-planner-lite'),

            'ENABLE_IN_LOOP_SELECT_SEAT_BUTTON'             => esc_html__('Enable "Select Seat" Button in Product Listings', 'stachethemes-seat-planner-lite'),
            'ENABLE_IN_LOOP_SELECT_SEAT_BUTTON_DESC'        => esc_html__('Disable this option if you want to show the default WooCommerce button in product listings (Shop Page, Categories, etc...).', 'stachethemes-seat-planner-lite'),

            'COMPATIBILITY_MODE'                             => esc_html__('Cache Compatibility Mode', 'stachethemes-seat-planner-lite'),
            'COMPATIBILITY_MODE_DESC'                        => esc_html__('Enables compatibility with cache plugins (e.g. WP Rocket, LiteSpeed) when lazy loading breaks due to JS optimization. Enable if you use such plugins or experience front-end issues.', 'stachethemes-seat-planner-lite'),

            'COMPATIBILITY_CALC_TOTALS'                     => esc_html__('Enforce WooCommerce Cart Calculation', 'stachethemes-seat-planner-lite'),
            'COMPATIBILITY_CALC_TOTALS_DESC'                => esc_html__('Turn on if your cart total or product prices don\'t update correctly.', 'stachethemes-seat-planner-lite'),

            'SHOW_ADJACENT_MONTHS_IN_DATE_PICKER'          => esc_html__('Show Adjacent Months in Date Picker', 'stachethemes-seat-planner-lite'),
            'SHOW_ADJACENT_MONTHS_IN_DATE_PICKER_DESC'     => esc_html__('Show adjacent months in the date picker to allow users to select dates from previous and next months.', 'stachethemes-seat-planner-lite'),

            // Slot Reservation tab
            'SEAT_RESERVATION_TIME'                          => esc_html__('Seat Reservation Time', 'stachethemes-seat-planner-lite'),
            'SEAT_RESERVATION_TIME_DESC'                     => esc_html__('How long a seat is reserved in the cart during checkout. Minimum: 5 minutes.', 'stachethemes-seat-planner-lite'),
            'MINUTES'                                        => esc_html__('minutes', 'stachethemes-seat-planner-lite'),

            // Cart Behavior tab
            'DISABLE_REDIRECT'                              => esc_html__('Disabled', 'stachethemes-seat-planner-lite'),
            'REDIRECT_CUSTOMERS_AFTER_SUCCESSFUL_ADDITION'  => esc_html__('Redirect Customers After Successful Addition', 'stachethemes-seat-planner-lite'),
            'REDIRECT_TO_CART_PAGE'                         => esc_html__('Redirect to Cart Page', 'stachethemes-seat-planner-lite'),
            'REDIRECT_TO_CHECKOUT_PAGE'                     => esc_html__('Redirect to Checkout Page', 'stachethemes-seat-planner-lite'),
            'SHOW_REDIRECT_MESSAGE'                         => esc_html__('Show Redirect Message', 'stachethemes-seat-planner-lite'),
            'SHOW_REDIRECT_MESSAGE_DESCRIPTION'             => esc_html__('Show a message informing customers that they are being redirected to the cart or checkout page.', 'stachethemes-seat-planner-lite'),
            'REDIRECT_MESSAGE'                              => esc_html__('Custom Redirect Message Text', 'stachethemes-seat-planner-lite'),
            'REDIRECT_MESSAGE_DESCRIPTION'                  => esc_html__('Leave blank to use the default message.', 'stachethemes-seat-planner-lite'),

            // Cart Timer tab
            'ENABLE_CART_TIMER'                              => esc_html__('Enable Cart Timer', 'stachethemes-seat-planner-lite'),
            'ENABLE_CART_TIMER_DESC'                         => esc_html__('Show a countdown timer for each reserved seat in the shopping cart.', 'stachethemes-seat-planner-lite'),

            // Attachments tab
            'ENABLE_QR_CODE'                                 => esc_html__('Enable QR Code', 'stachethemes-seat-planner-lite'),
            'ENABLE_QR_CODE_DESC'                            => esc_html__('Attach QR Code to order confirmation emails.', 'stachethemes-seat-planner-lite'),
            'ENABLE_PDF_ATTACHMENTS'                         => esc_html__('Enable PDF Attachments', 'stachethemes-seat-planner-lite'),
            'ENABLE_PDF_ATTACHMENTS_DESC'                    => esc_html__('Attach a PDF ticket with QR code to order confirmation emails.', 'stachethemes-seat-planner-lite'),
            'PDF_FILENAME'                                   => esc_html__('PDF Filename', 'stachethemes-seat-planner-lite'),
            'PDF_FILENAME_DESC'                              => esc_html__('Name of the PDF file (without .pdf extension). Leave blank to use the default name.', 'stachethemes-seat-planner-lite'),
            'PDF_FILENAME_PLACEHOLDER'                       => esc_html__('PDF Filename', 'stachethemes-seat-planner-lite'),

            // Order Status tab
            'AUTO_COMPLETE_ORDERS'                           => esc_html__('Auto-Complete Orders', 'stachethemes-seat-planner-lite'),
            'AUTO_COMPLETE_ORDERS_DESC'                      => esc_html__('Automatically mark orders containing auditorium products as "Completed" when payment is received.', 'stachethemes-seat-planner-lite'),

            // Mobile App tab
            'ANDROID_APP'                                    => esc_html__('Android App', 'stachethemes-seat-planner-lite'),
            'ANDROID_APP_DESC'                               => esc_html__('Download the Android app to scan tickets at your venue.', 'stachethemes-seat-planner-lite'),
            'DOWNLOAD_ANDROID_APK'                           => esc_html__('Download Android App', 'stachethemes-seat-planner-lite'),
            'REST_API_BASE_URL'                              => esc_html__('REST API Base URL', 'stachethemes-seat-planner-lite'),
            'REST_API_BASE_URL_DESC'                         => esc_html__('Your REST URL for API integrations. Use this URL in the mobile app.', 'stachethemes-seat-planner-lite'),
            'COPY'                                           => esc_html__('Copy', 'stachethemes-seat-planner-lite'),
            'COPIED'                                         => esc_html__('Copied!', 'stachethemes-seat-planner-lite'),
            'ENABLE_APP_ACCESS'                              => esc_html__('Enable App Access', 'stachethemes-seat-planner-lite'),
            'ENABLE_APP_ACCESS_DESC'                         => esc_html__('Enable mobile app access to your site to allow qr code validation of tickets.', 'stachethemes-seat-planner-lite'),
            'APP_SECRET_KEY'                                 => esc_html__('App Secret Key', 'stachethemes-seat-planner-lite'),
            'APP_SECRET_KEY_DESC'                            => esc_html__('Minimum 8 characters.', 'stachethemes-seat-planner-lite'),
            'APP_SECRET_KEY_PLACEHOLDER'                     => esc_html__('Enter or generate a secret key', 'stachethemes-seat-planner-lite'),
            'GENERATE'                                       => esc_html__('Generate', 'stachethemes-seat-planner-lite'),
            'SECRET_KEY_MIN_LENGTH_ERROR'                    => esc_html__('Secret key must be at least 8 characters long.', 'stachethemes-seat-planner-lite'),

            // colors
            'COLOR_PREVIEW_LABEL'                            => esc_html__('Color Preview', 'stachethemes-seat-planner-lite'),
            'TAB_COLORS'                                     => esc_html__('Colors', 'stachethemes-seat-planner-lite'),
            'ACCENT_COLOR'                                   => esc_html__('Accent Color', 'stachethemes-seat-planner-lite'),
            'ACCENT_COLOR_DESC'                              => esc_html__('This color will be used to style the front-end interface.', 'stachethemes-seat-planner-lite'),
            'BUTTON_PRIMARY'                                 => esc_html__('Primary Button', 'stachethemes-seat-planner-lite'),
            'BUTTON_SECONDARY'                               => esc_html__('Secondary Button', 'stachethemes-seat-planner-lite'),
            'SELECT_SEAT'                                    => esc_html__('Select Seat', 'stachethemes-seat-planner-lite'),

            ...self::datepicker_strings(),
            ...self::manager_strings()
        ];
    }

    /**
     * Translates the front javascript strings
     *
     * @return array<string, string>
     */
    public static function get_front_strings(): array {

        return [
            'VIEW_DETAILS'           => esc_html__('View Details', 'stachethemes-seat-planner-lite'),
            'REMOVE'                 => esc_html__('Remove', 'stachethemes-seat-planner-lite'),
            'EDIT_SEATS'             => esc_html__('Edit Seats', 'stachethemes-seat-planner-lite'),
            'CANCEL'                 => esc_html__('Cancel', 'stachethemes-seat-planner-lite'),
            'LOADING_SEATING_LAYOUT' => esc_html__('Loading seating layout', 'stachethemes-seat-planner-lite'),
            'UNAVAILABLE'            => esc_html__('Unavailable', 'stachethemes-seat-planner-lite'),
            'PURCHASABLE_ON_SITE'    => esc_html__('Purchasable on Site', 'stachethemes-seat-planner-lite'),
            'PRICE'                  => esc_html__('Price', 'stachethemes-seat-planner-lite'),
            'SOLD_OUT'               => esc_html__('Sold Out', 'stachethemes-seat-planner-lite'),
            'NO_SINGLE_EMPTY_SEAT'   => esc_html__('Please don\'t leave a single empty seat between selections', 'stachethemes-seat-planner-lite'),
            'NO_SEATS_SELECTED'      => esc_html__('No seats selected', 'stachethemes-seat-planner-lite'),
            'CLOSE'                  => esc_html__('Close', 'stachethemes-seat-planner-lite'),
            'SELECT_SEAT'            => esc_html__('Select Seat', 'stachethemes-seat-planner-lite'),
            'ADD_TO_CART'            => esc_html__('Add to Cart', 'stachethemes-seat-planner-lite'),
            'ZOOM_IN'                => esc_html__('Zoom In', 'stachethemes-seat-planner-lite'),
            'ZOOM_OUT'               => esc_html__('Zoom Out', 'stachethemes-seat-planner-lite'),
            'ZOOM_RESET'             => esc_html__('Zoom Reset', 'stachethemes-seat-planner-lite'),
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
            'A__VIEW_CART'          => sprintf('<a class="stachesepl-toast-view-cart" href="%s">%s</a>', wc_get_cart_url(), esc_html__('View Cart', 'stachethemes-seat-planner-lite')),
            'GENERIC_ERROR_MESSAGE' => esc_html__('Sorry, something went wrong. Please try again.', 'stachethemes-seat-planner-lite'),
            'FAILED_TO_FETCH_SEAT_PLAN_DATA' => esc_html__('Failed to fetch seat plan data.', 'stachethemes-seat-planner-lite'),
            'SEAT'                           => esc_html__('Seat', 'stachethemes-seat-planner-lite'),
            'NEXT'                           => esc_html__('Next', 'stachethemes-seat-planner-lite'),
            'BACK'                           => esc_html__('Back', 'stachethemes-seat-planner-lite'),
            'DISCOUNTS_SUBTITLE'             => esc_html__('Apply discounts to your seats to get the best price.', 'stachethemes-seat-planner-lite'),
            'REGULAR_SEAT'                   => esc_html__('Regular Seat', 'stachethemes-seat-planner-lite'),
            'NO_DISCOUNT_APPLIED'            => esc_html__('No discount applied', 'stachethemes-seat-planner-lite'),
            'TOTAL'                          => esc_html__('Total', 'stachethemes-seat-planner-lite'),
            'DISCOUNTS_TITLE'                => esc_html__('Discounts', 'stachethemes-seat-planner-lite'),
            'VIEW_CART'                      => esc_html__('View Cart', 'stachethemes-seat-planner-lite'),
            'THIS_SEAT_IS_ONLY_AVAILABLE_ON_SITE' => esc_html__('This seat can only be purchased at the venue.', 'stachethemes-seat-planner-lite'),
            'THIS_SEAT_IS_TAKEN'             => esc_html__('This seat is already taken.', 'stachethemes-seat-planner-lite'),
            'THIS_SEAT_IS_UNAVAILABLE'       => esc_html__('This seat is unavailable.', 'stachethemes-seat-planner-lite'),
            'LOADING'                        => esc_html__('Loading', 'stachethemes-seat-planner-lite'),
            'SEAT_RESERVATION_DETAILS'       => esc_html__('Seat Reservation Details', 'stachethemes-seat-planner-lite'),
            'RESERVED_BY'                    => esc_html__('Reserved By', 'stachethemes-seat-planner-lite'),
            'ORDER_DATE'                     => esc_html__('Order Date', 'stachethemes-seat-planner-lite'),
            'ORDER_STATUS'                   => esc_html__('Order Status', 'stachethemes-seat-planner-lite'),
            'EVENT_DATE'                     => esc_html__('Date', 'stachethemes-seat-planner-lite'),
            'ORDER_ID'                       => esc_html__('Order ID', 'stachethemes-seat-planner-lite'),
            'NO_ORDER_DATA_FOUND'            => esc_html__('No order data found for this seat.', 'stachethemes-seat-planner-lite'),
            'NOTICE'                         => esc_html__('Notice', 'stachethemes-seat-planner-lite'),
            'OPTIONS_TITLE'                  => esc_html__('Seat Options', 'stachethemes-seat-planner-lite'),
            'OPTIONS_SUBTITLE'               => esc_html__('Customize your selection', 'stachethemes-seat-planner-lite'),
            'FIELD_REQUIRED'                 => esc_html__('This field is required', 'stachethemes-seat-planner-lite'),
            'NO_SELECTION'                   => esc_html__('No selection', 'stachethemes-seat-planner-lite'),
            'REDIRECTING_TO_PAYMENT'         => esc_html__('We are redirecting you to the payment page', 'stachethemes-seat-planner-lite'),
            'PLEASE_WAIT'                    => esc_html__('Please wait...', 'stachethemes-seat-planner-lite'),

            ...self::datepicker_strings()

        ];
    }
}
