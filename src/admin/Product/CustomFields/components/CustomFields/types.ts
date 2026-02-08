export type CustomFieldType = 'text' | 'textarea' | 'checkbox' | 'select' | 'number' | 'meta' | 'info';

/**
 * Display condition operators for number fields.
 */
export type NumberConditionOperator = 'eq' | 'neq' | 'gt' | 'lt';

/**
 * Display condition for checkbox fields.
 */
export interface CheckboxDisplayCondition {
    fieldUid: string;
    checked: boolean; // true = checked, false = not checked
}

/**
 * Display condition for select fields.
 */
export interface SelectDisplayCondition {
    fieldUid: string;
    selectedValues: string[]; // Array of option labels that should be selected
}

/**
 * Display condition for text/textarea fields.
 */
export interface TextDisplayCondition {
    fieldUid: string;
    filled: boolean; // true = filled, false = not filled
}

/**
 * Display condition for number fields.
 */
export interface NumberDisplayCondition {
    fieldUid: string;
    operator: NumberConditionOperator;
    value: number;
}

/**
 * Union type for all display condition types.
 */
export type DisplayCondition = 
    | CheckboxDisplayCondition 
    | SelectDisplayCondition 
    | TextDisplayCondition 
    | NumberDisplayCondition;

/**
 * Base properties shared by all custom field types.
 */
interface BaseFieldData {
    /**
     * Unique identifier for this field. Used for stable references in conditions
     * and mutual exclusivity that survive reordering.
     */
    uid: string;

    /**
     * Label that will be shown next to the input in the seat details form.
     */
    label: string;

    /**
     * Optional helper/description text shown under the label on the front-end.
     */
    description?: string;

    /**
     * Whether filling this field is required when purchasing a seat.
     */
    required?: boolean;

    /**
     * Whether this field will be visible on the front-end cart item meta details.
     */
    visible?: boolean;

    /**
     * Display conditions - field will only be shown if all conditions are met.
     * Only applicable to non-meta fields.
     */
    displayConditions?: DisplayCondition[];

    /**
     * Mutual exclusivity - array of field UIDs that this field is mutually exclusive with.
     * If this field has a value, fields in this array will be hidden.
     * Only applicable to non-meta fields.
     */
    mutuallyExclusiveWith?: string[];
}

/**
 * Text field - single-line text input.
 */
export interface TextFieldData extends BaseFieldData {
    type: 'text';
    /**
     * Placeholder text shown inside the input.
     */
    placeholder?: string;
}

/**
 * Textarea field - multi-line text input.
 */
export interface TextareaFieldData extends BaseFieldData {
    type: 'textarea';
    /**
     * Placeholder text shown inside the textarea.
     */
    placeholder?: string;
}

/**
 * Checkbox field - yes / no switch.
 */
export interface CheckboxFieldData extends BaseFieldData {
    type: 'checkbox';
    /**
     * Value to be displayed when the checkbox is checked.
     */
    checkedValue?: string;
    /**
     * Optional price to add when checkbox is checked.
     */
    price?: number;
}

/**
 * Select option with optional price.
 */
export interface SelectOption {
    /**
     * Label text for the option.
     */
    label: string;
    /**
     * Optional price for this option.
     */
    price?: number;
}

/**
 * Select field - dropdown with predefined options.
 */
export interface SelectFieldData extends BaseFieldData {
    type: 'select';
    /**
     * Options used for the dropdown.
     */
    options?: SelectOption[];
}

/**
 * Number field - numeric input with min/max constraints.
 */
export interface NumberFieldData extends BaseFieldData {
    type: 'number';
    /**
     * Minimum value allowed for the number input.
     */
    min?: number;
    /**
     * Maximum value allowed for the number input.
     */
    max?: number;
    /**
     * Placeholder text shown inside the input.
     */
    placeholder?: string;
    /**
     * Optional price to add per unit.
     */
    price?: number;
}

/**
 * Meta field - fixed name-value pair.
 */
export interface MetaFieldData extends BaseFieldData {
    type: 'meta';
    /**
     * The value for this meta field.
     */
    value?: string;
}

/**
 * Info field - display-only field with name and description.
 * No value or placeholder, but supports display conditions.
 */
export interface InfoFieldData extends BaseFieldData {
    type: 'info';
}

/**
 * Discriminated union of all custom field types.
 * This provides type safety - TypeScript will narrow the type based on the 'type' property.
 */
export type fieldsData = TextFieldData | TextareaFieldData | CheckboxFieldData | SelectFieldData | NumberFieldData | MetaFieldData | InfoFieldData;