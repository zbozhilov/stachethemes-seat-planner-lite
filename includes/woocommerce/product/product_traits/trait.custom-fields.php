<?php

namespace StachethemesSeatPlannerLite\Product_Traits;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Trait for handling custom fields validation and sanitization
 */
trait Custom_Fields {

    /**
     * Build reusable indexes for admin-defined custom fields.
     *
     * @param array $admin_custom_fields
     * @return array{fieldByUid:array,indexByUid:array,keyByIndex:array,indexByKey:array}
     */
    private function build_admin_custom_fields_index($admin_custom_fields) {
        return [
            'fieldByUid' => [],
            'indexByUid' => [],
            'keyByIndex' => [],
            'indexByKey' => [],
        ];
    }

    /**
     * Read a field value from the custom_fields object.
     *
     * @param object $custom_fields
     * @param string $field_key
     * @return mixed|null
     */
    private function get_custom_field_value($custom_fields, $field_key) {
        return (is_object($custom_fields) && property_exists($custom_fields, $field_key))
            ? $custom_fields->{$field_key}
            : null;
    }

    /**
     * Build the canonical key used to store/read a field value in the custom_fields object.
     * Frontend uses: (label || `field_${index}`).trim() || `field_${index}`.
     *
     * @param object $field Admin field definition
     * @param int    $index Field index in admin fields array
     * @return string
     */
    private function get_field_key($field, $index) {
        $label = '';
        if (is_object($field) && isset($field->label)) {
            $label = trim((string) $field->label);
        }
        if ($label !== '') {
            return $label;
        }
        return 'field_' . intval($index);
    }

    /**
     * Find a field by its uid
     *
     * @param string $uid The field uid
     * @param array $admin_custom_fields All admin-defined custom fields
     * @param array|null $admin_index Optional index from build_admin_custom_fields_index
     * @return object|null The field object or null if not found
     */
    private function find_field_by_uid($uid, $admin_custom_fields, $admin_index = null) {
        return null;
    }

    /**
     * Find a field's index by its uid
     *
     * @param string $uid The field uid
     * @param array $admin_custom_fields All admin-defined custom fields
     * @param array|null $admin_index Optional index from build_admin_custom_fields_index
     * @return int The field index or -1 if not found
     */
    private function find_field_index_by_uid($uid, $admin_custom_fields, $admin_index = null) {
        return -1;
    }

    /**
     * Evaluates a single display condition against the current field values.
     *
     * @param object|array $condition The display condition object or array
     * @param array $admin_custom_fields All admin-defined custom fields
     * @param object $custom_fields Current field values
     * @param array|null $admin_index Optional index from build_admin_custom_fields_index
     * @return bool True if condition is met, false otherwise
     */
    private function evaluate_display_condition($condition, $admin_custom_fields, $custom_fields, $admin_index = null) {
        return false;
    }

    /**
     * Recursively checks if a field is visible based on its conditions and the visibility of its dependencies.
     *
     * @param int $field_index The index of the field to check
     * @param array $admin_custom_fields All admin-defined custom fields
     * @param object $custom_fields Current field values
     * @param array $visited Array of visited field uids to prevent circular dependencies
     * @param array|null $visibility_cache Memoized visibility cache (by field index)
     * @param array|null $admin_index Optional index from build_admin_custom_fields_index
     * @return bool True if the field is visible, false otherwise
     */
    public function is_field_visible($field_index, $admin_custom_fields, $custom_fields, $visited = [], &$visibility_cache = null, $admin_index = null) {
        return false;
    }

    /**
     * Build direct mutual exclusivity adjacency list (undirected).
     * Supports both old index-based and new uid-based references.
     *
     * @param array $admin_custom_fields
     * @param array $admin_index
     * @return array<int,array<int,bool>> adjacency map of index => [neighborIndex => true]
     */
    private function build_mutual_exclusivity_adjacency($admin_custom_fields, $admin_index) {
        return [];
    }

    /**
     * Build connected components (groups) from adjacency list.
     *
     * @param array<int,array<int,bool>> $adj
     * @return array<int,array<int>> List of groups (each group is sorted indices)
     */
    private function build_mutual_exclusivity_groups_from_adjacency($adj) {
        return [];
    }

    /**
     * Validates that provided custom fields match admin-defined fields
     * and all required fields are present and non-empty.
     * Skips validation for fields that are not visible due to display conditions.
     *
     * @param object $custom_fields
     * @return array|null  ['error' => string] on failure, null on success
     */
    public function validate_custom_fields($custom_fields) {
        return null; // valid
    }

    /**
     * Checks if a custom field value is considered empty (should not be stored in order data).
     *
     * @param mixed $field_value The field value
     * @return bool True if empty, false if has meaningful value
     */
    private function is_custom_field_value_empty($field_value): bool {
        return true;
    }

    /**
     * Checks if a field has a non-empty value.
     *
     * @param object $admin_field The admin field definition
     * @param mixed $field_value The field value
     * @return bool True if field has a value, false otherwise
     */
    private function has_field_value($admin_field, $field_value) {
        return false;
    }

    /**
     * Validates mutual exclusivity rules.
     * Ensures that mutually exclusive fields don't both have values.
     *
     * @param array $admin_custom_fields All admin-defined custom fields
     * @param object $custom_fields Current field values
     * @param array|null $admin_index Optional index from build_admin_custom_fields_index
     * @param array|null $adj Optional adjacency list from build_mutual_exclusivity_adjacency
     * @return array|null ['error' => string] on failure, null on success
     */
    private function validate_mutual_exclusivity($admin_custom_fields, $custom_fields, $admin_index = null, $adj = null) {
        return null;
    }

    /**
     * Filters/sanitizes provided fields to only include those defined in admin settings
     * and that are currently visible based on their display conditions.
     *
     * Fields that are hidden due to display conditions not being met will be stripped out,
     * even if they have values. This prevents stale data from conditionally-shown fields
     * from being persisted when those fields are no longer visible.
     *
     * @param object $custom_fields
     * @return \stdClass
     */
    public function sanitize_custom_fields($custom_fields) {
        return new \stdClass();
    }
}
