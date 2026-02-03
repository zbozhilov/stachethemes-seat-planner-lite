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
        $fieldByUid = [];
        $indexByUid = [];
        $keyByIndex = [];
        $indexByKey = [];

        foreach ($admin_custom_fields as $index => $field) {
            $key = $this->get_field_key($field, $index);
            $keyByIndex[$index] = $key;
            $indexByKey[$key] = $index;

            if (is_object($field) && isset($field->uid)) {
                $uid = (string) $field->uid;
                if ($uid !== '') {
                    $fieldByUid[$uid] = $field;
                    $indexByUid[$uid] = $index;
                }
            }
        }

        return [
            'fieldByUid' => $fieldByUid,
            'indexByUid' => $indexByUid,
            'keyByIndex' => $keyByIndex,
            'indexByKey' => $indexByKey,
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
        if (is_array($admin_index) && isset($admin_index['fieldByUid'][$uid])) {
            return $admin_index['fieldByUid'][$uid];
        }
        foreach ($admin_custom_fields as $field) {
            if (isset($field->uid) && $field->uid === $uid) {
                return $field;
            }
        }
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
        if (is_array($admin_index) && isset($admin_index['indexByUid'][$uid])) {
            return intval($admin_index['indexByUid'][$uid]);
        }
        foreach ($admin_custom_fields as $index => $field) {
            if (isset($field->uid) && $field->uid === $uid) {
                return $index;
            }
        }
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
        // Handle both object and array formats
        $condition = (object) $condition;
        
        // Support both old fieldIndex and new fieldUid formats for backward compatibility
        $target_field = null;
        $target_field_index = -1;
        if (isset($condition->fieldUid)) {
            $target_field = $this->find_field_by_uid($condition->fieldUid, $admin_custom_fields, $admin_index);
            $target_field_index = $this->find_field_index_by_uid($condition->fieldUid, $admin_custom_fields, $admin_index);
        } elseif (isset($condition->fieldIndex)) {
            // Backward compatibility for old fieldIndex format ( before 1.4.0)
            $target_field_index = intval($condition->fieldIndex);
            if ($target_field_index >= 0 && $target_field_index < count($admin_custom_fields)) {
                $target_field = $admin_custom_fields[$target_field_index];
            }
        }
        
        if (!$target_field || !isset($target_field->label)) {
            return false; // Field doesn't exist, condition fails
        }

        $field_key = (is_array($admin_index) && isset($admin_index['keyByIndex'][$target_field_index]))
            ? $admin_index['keyByIndex'][$target_field_index]
            : $this->get_field_key($target_field, $target_field_index);
        $field_value = $this->get_custom_field_value($custom_fields, $field_key);

        // Check condition type based on target field type
        if (isset($target_field->type) && $target_field->type === 'checkbox') {
            $checked = isset($condition->checked) ? (bool) $condition->checked : false;
            $has_checked_value = !empty($target_field->checkedValue);
            $is_checked = $has_checked_value
                ? ($field_value === $target_field->checkedValue)
                : ($field_value === 'yes' || $field_value === true);

            return $checked === $is_checked;
        }

        if (isset($target_field->type) && $target_field->type === 'select') {
            $selected_values = isset($condition->selectedValues) && is_array($condition->selectedValues) 
                ? $condition->selectedValues 
                : [];
            
            if (empty($selected_values)) {
                return false; // Invalid condition
            }

            $selected_value = $field_value !== null ? strval($field_value) : '';
            return $selected_value !== '' && in_array($selected_value, $selected_values, true);
        }

        if (isset($target_field->type) && ($target_field->type === 'text' || $target_field->type === 'textarea')) {
            $filled = isset($condition->filled) ? (bool) $condition->filled : false;
            $is_filled = $field_value !== null && trim(strval($field_value)) !== '';
            
            return $filled === $is_filled;
        }

        if (isset($target_field->type) && $target_field->type === 'number') {
            $operator = isset($condition->operator) ? $condition->operator : 'eq';
            $condition_value = isset($condition->value) ? floatval($condition->value) : 0;

            $numeric_value = $field_value !== null ? floatval($field_value) : null;

            if ($numeric_value === null || !is_finite($numeric_value)) {
                return false; // Invalid number
            }

            switch ($operator) {
                case 'eq':
                    return abs($numeric_value - $condition_value) < 0.0001; // Float comparison
                case 'neq':
                    return abs($numeric_value - $condition_value) >= 0.0001;
                case 'gt':
                    return $numeric_value > $condition_value;
                case 'lt':
                    return $numeric_value < $condition_value;
                default:
                    return false;
            }
        }

        return false; // Unknown field type, condition fails
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
        if ($field_index < 0 || $field_index >= count($admin_custom_fields)) {
            return false;
        }

        if (!is_array($visibility_cache)) {
            $visibility_cache = [];
        }

        if (!is_array($admin_index)) {
            $admin_index = $this->build_admin_custom_fields_index($admin_custom_fields);
        }

        if (array_key_exists($field_index, $visibility_cache)) {
            return (bool) $visibility_cache[$field_index];
        }

        $field = $admin_custom_fields[$field_index];
        $field_uid = isset($field->uid) ? $field->uid : 'index_' . $field_index;
        
        // Prevent infinite recursion in case of circular dependencies
        if (in_array($field_uid, $visited, true)) {
            $visibility_cache[$field_index] = false;
            return false;
        }
        $visited[] = $field_uid;

        // If no display conditions, always show
        if (empty($field->displayConditions) || !is_array($field->displayConditions)) {
            $visibility_cache[$field_index] = true;
            return true;
        }

        // Check all conditions - all must be met
        foreach ($field->displayConditions as $condition) {
            // Handle both object and array formats
            $condition = (object) $condition;
            
            // Find target field index for recursive visibility check
            // Support both old fieldIndex and new fieldUid formats
            $target_field_index = -1;
            if (isset($condition->fieldUid)) {
                $target_field_index = $this->find_field_index_by_uid($condition->fieldUid, $admin_custom_fields, $admin_index);
            } elseif (isset($condition->fieldIndex)) {
                $target_field_index = intval($condition->fieldIndex);
            }
            
            // First, check if the target field is visible (recursive check)
            $target_field_visible = $this->is_field_visible($target_field_index, $admin_custom_fields, $custom_fields, $visited, $visibility_cache, $admin_index);
            if (!$target_field_visible) {
                // If the target field is not visible, this condition fails
                $visibility_cache[$field_index] = false;
                return false;
            }

            // Then, check if the condition itself is met
            if (!$this->evaluate_display_condition($condition, $admin_custom_fields, $custom_fields, $admin_index)) {
                $visibility_cache[$field_index] = false;
                return false;
            }
        }

        $visibility_cache[$field_index] = true;
        return true;
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
        $adj = [];
        $count = count($admin_custom_fields);
        for ($i = 0; $i < $count; $i++) {
            $adj[$i] = [];
        }

        foreach ($admin_custom_fields as $index => $field) {
            if (empty($field->mutuallyExclusiveWith) || !is_array($field->mutuallyExclusiveWith)) {
                continue;
            }
            foreach ($field->mutuallyExclusiveWith as $exclusive_ref) {
                $exclusive_index = -1;
                if (is_string($exclusive_ref)) {
                    $exclusive_index = $this->find_field_index_by_uid($exclusive_ref, $admin_custom_fields, $admin_index);
                } elseif (is_int($exclusive_ref) || is_numeric($exclusive_ref)) {
                    $exclusive_index = intval($exclusive_ref);
                }

                if ($exclusive_index < 0 || $exclusive_index >= $count || $exclusive_index === $index) {
                    continue;
                }

                $adj[$index][$exclusive_index] = true;
                $adj[$exclusive_index][$index] = true;
            }
        }

        return $adj;
    }

    /**
     * Build connected components (groups) from adjacency list.
     *
     * @param array<int,array<int,bool>> $adj
     * @return array<int,array<int>> List of groups (each group is sorted indices)
     */
    private function build_mutual_exclusivity_groups_from_adjacency($adj) {
        $visited = [];
        $groups = [];

        foreach ($adj as $start => $neighbors) {
            if (isset($visited[$start])) {
                continue;
            }
            if (empty($neighbors)) {
                $visited[$start] = true;
                continue;
            }

            $stack = [$start];
            $group = [];
            $visited[$start] = true;

            while (!empty($stack)) {
                $i = array_pop($stack);
                $group[] = $i;
                foreach ($adj[$i] as $j => $_true) {
                    if (!isset($visited[$j])) {
                        $visited[$j] = true;
                        $stack[] = $j;
                    }
                }
            }

            sort($group);
            $groups[] = $group;
        }

        return $groups;
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

        if (!$custom_fields) {
            return null;
        }

        if (!is_object($custom_fields)) {
            return ['error' => \__('Invalid custom fields format', 'stachethemes-seat-planner-lite')];
        }

        $admin_custom_fields = $this->get_custom_fields_data();

        if (empty($admin_custom_fields)) {
            if (!empty((array) $custom_fields)) {
                return ['error' => \__('No seat options are configured for this product', 'stachethemes-seat-planner-lite')];
            }
            return null;
        }

        $admin_index = $this->build_admin_custom_fields_index($admin_custom_fields);
        $visibility_cache = [];

        $adj = $this->build_mutual_exclusivity_adjacency($admin_custom_fields, $admin_index);
        $mutual_groups = $this->build_mutual_exclusivity_groups_from_adjacency($adj);
        $group_by_index = [];
        foreach ($mutual_groups as $group_id => $group) {
            foreach ($group as $idx) {
                $group_by_index[$idx] = $group_id;
            }
        }
        $validated_group_ids = [];

        // Check for missing required fields (only if they are visible)
        foreach ($admin_custom_fields as $index => $admin_field) {
            if (empty($admin_field->required)) {
                continue; // Not required
            }

            // Check if field is visible - if not, skip validation
            if (!$this->is_field_visible($index, $admin_custom_fields, $custom_fields, [], $visibility_cache, $admin_index)) {
                continue; // Field is hidden, skip validation
            }

            // Check if this field is part of a mutual exclusivity group
            if (isset($group_by_index[$index])) {
                $group_id = $group_by_index[$index];

                // Only validate this group once
                if (isset($validated_group_ids[$group_id])) {
                    continue;
                }
                $validated_group_ids[$group_id] = true;

                $mutual_group = $mutual_groups[$group_id];
                
                // Check if at least one required visible field in the group has a value
                $any_has_value = false;
                $group_field_labels = [];
                
                foreach ($mutual_group as $group_index) {
                    $group_field = $admin_custom_fields[$group_index] ?? null;
                    if (!$group_field || empty($group_field->required) || !isset($group_field->label)) {
                        continue;
                    }
                    
                    // Check if this group field is visible
                    if (!$this->is_field_visible($group_index, $admin_custom_fields, $custom_fields, [], $visibility_cache, $admin_index)) {
                        continue;
                    }
                    
                    $group_field_key = $admin_index['keyByIndex'][$group_index] ?? $this->get_field_key($group_field, $group_index);
                    $group_field_labels[] = $group_field_key;
                    $group_field_value = $this->get_custom_field_value($custom_fields, $group_field_key);
                    
                    if ($this->has_field_value($group_field, $group_field_value)) {
                        $any_has_value = true;
                        break;
                    }
                }
                
                if (!$any_has_value && !empty($group_field_labels)) {
                    return [
                        'error' => sprintf(
                            // translators: %s is the field names
                            \__('At least one of these required seat options must be filled: %s', 'stachethemes-seat-planner-lite'),
                            implode(', ', $group_field_labels)
                        )
                    ];
                }
            } else {
                // Not part of mutual exclusivity - validate normally
                $field_key = $admin_index['keyByIndex'][$index] ?? $this->get_field_key($admin_field, $index);
                if (!property_exists($custom_fields, $field_key)) {
                    return [
                        // translators: %s is the field name
                        'error' => sprintf(\__('Required seat option: %1$s is missing', 'stachethemes-seat-planner-lite'), $field_key)
                    ];
                }
                
                $field_value = $custom_fields->{$field_key};
                if (!$this->has_field_value($admin_field, $field_value)) {
                    return [
                        // translators: %s is the field name
                        'error' => sprintf(\__('Required seat option: %s is empty', 'stachethemes-seat-planner-lite'), $field_key)
                    ];
                }
            }
        }

        // Validate mutual exclusivity
        $mutual_exclusivity_error = $this->validate_mutual_exclusivity($admin_custom_fields, $custom_fields, $admin_index, $adj);
        if ($mutual_exclusivity_error !== null) {
            return $mutual_exclusivity_error;
        }

        // Validate number fields min/max when value is present
        foreach ($admin_custom_fields as $index => $admin_field) {
            if (!isset($admin_field->type) || $admin_field->type !== 'number') {
                continue;
            }
            if (!$this->is_field_visible($index, $admin_custom_fields, $custom_fields, [], $visibility_cache, $admin_index)) {
                continue;
            }
            $field_key = $admin_index['keyByIndex'][$index] ?? $this->get_field_key($admin_field, $index);
            if (!property_exists($custom_fields, $field_key)) {
                continue;
            }
            $field_value = $custom_fields->{$field_key};
            if ($field_value === null || $field_value === '' || !is_numeric($field_value)) {
                continue;
            }
            $num = (float) $field_value;
            $min = isset($admin_field->min) ? (float) $admin_field->min : null;
            $max = isset($admin_field->max) ? (float) $admin_field->max : null;
            if ($min !== null && $num < $min) {
                return [
                    'error' => sprintf(
                        /* translators: 1: field label, 2: minimum value */
                        \__('Seat option "%1$s" must be at least %2$s.', 'stachethemes-seat-planner-lite'),
                        $field_key,
                        (string) $min
                    ),
                ];
            }
            if ($max !== null && $num > $max) {
                return [
                    'error' => sprintf(
                        /* translators: 1: field label, 2: maximum value */
                        \__('Seat option "%1$s" must be at most %2$s.', 'stachethemes-seat-planner-lite'),
                        $field_key,
                        (string) $max
                    ),
                ];
            }
        }

        return null; // valid
    }

    /**
     * Checks if a custom field value is considered empty (should not be stored in order data).
     *
     * @param mixed $field_value The field value
     * @return bool True if empty, false if has meaningful value
     */
    private function is_custom_field_value_empty($field_value): bool {
        if ($field_value === null || $field_value === '') {
            return true;
        }
        if (is_scalar($field_value) && trim((string) $field_value) === '') {
            return true;
        }
        return false;
    }

    /**
     * Checks if a field has a non-empty value.
     *
     * @param object $admin_field The admin field definition
     * @param mixed $field_value The field value
     * @return bool True if field has a value, false otherwise
     */
    private function has_field_value($admin_field, $field_value) {
        if ($field_value === null || $field_value === '') {
            return false;
        }

        // For checkbox fields, check if they're checked
        if (isset($admin_field->type) && $admin_field->type === 'checkbox') {
            $has_checked_value = !empty($admin_field->checkedValue);
            if ($has_checked_value) {
                return $field_value === $admin_field->checkedValue;
            }
            return $field_value === 'yes' || $field_value === true || $field_value === 1 || $field_value === '1';
        }

        // For number fields, check if value is a valid positive number
        // 0 or less is considered "empty" (no selection) for required fields
        if (isset($admin_field->type) && $admin_field->type === 'number') {
            $numeric_value = floatval($field_value);
            return is_finite($numeric_value) && $numeric_value > 0;
        }

        // For text/textarea/select, check if value is not empty string
        return trim(strval($field_value)) !== '';
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
        if (!is_array($admin_index)) {
            $admin_index = $this->build_admin_custom_fields_index($admin_custom_fields);
        }
        if (!is_array($adj)) {
            $adj = $this->build_mutual_exclusivity_adjacency($admin_custom_fields, $admin_index);
        }

        foreach ($admin_custom_fields as $index => $admin_field) {
            if (!isset($admin_field->label)) {
                continue;
            }

            $field_label = $admin_index['keyByIndex'][$index] ?? $this->get_field_key($admin_field, $index);
            $field_value = $this->get_custom_field_value($custom_fields, $field_label);

            if (!$this->has_field_value($admin_field, $field_value)) {
                continue;
            }

            if (empty($adj[$index])) {
                continue;
            }

            foreach ($adj[$index] as $neighbor_index => $_true) {
                $neighbor_field = $admin_custom_fields[$neighbor_index] ?? null;
                if (!$neighbor_field || !isset($neighbor_field->label)) {
                    continue;
                }

                $neighbor_label = $admin_index['keyByIndex'][$neighbor_index] ?? $this->get_field_key($neighbor_field, $neighbor_index);
                $neighbor_value = $this->get_custom_field_value($custom_fields, $neighbor_label);

                if ($this->has_field_value($neighbor_field, $neighbor_value)) {
                    return [
                        'error' => sprintf(
                            // translators: %1$s and %2$s are field names
                            \__('Seat options "%1$s" and "%2$s" cannot both have values. They are mutually exclusive.', 'stachethemes-seat-planner-lite'),
                            $field_label,
                            $neighbor_label
                        )
                    ];
                }
            }
        }

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
        if (!$custom_fields || !is_object($custom_fields)) {
            return new \stdClass();
        }

        $admin_custom_fields = $this->get_custom_fields_data();
        if (empty($admin_custom_fields)) {
            return new \stdClass();
        }

        $admin_index = $this->build_admin_custom_fields_index($admin_custom_fields);
        $allowed_keys = $admin_index['indexByKey'];
        $visibility_cache = [];

        $filtered = new \stdClass();
        foreach ((array) $custom_fields as $field_name => $field_value) {
            $field_name_key = trim((string) $field_name);

            // Check if field is in allowed list
            if (!isset($allowed_keys[$field_name_key])) {
                continue;
            }

            // Check if value is empty
            if ($this->is_custom_field_value_empty($field_value)) {
                continue;
            }

            // Check if field is visible based on display conditions
            $field_index = $allowed_keys[$field_name_key];
            if (!$this->is_field_visible($field_index, $admin_custom_fields, $custom_fields, [], $visibility_cache, $admin_index)) {
                continue;
            }

            $filtered->{$field_name_key} = $field_value;
        }

        return $filtered;
    }
}
