import { ExpandMore } from '@mui/icons-material';
import type { KeyboardEvent, ReactNode } from 'react';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import './SelectField.scss';
import Badge from '../Badge/Badge';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';

export type SelectFieldOption = {
    value: string;
    label: string;
    description?: string;
    /**
     * Optional right-side badge (e.g. "-10%", "VIP").
     */
    badge?: string;
    /**
     * Optional icon rendered on the left of the label in the option row.
     */
    icon?: ReactNode;
};

export type SelectFieldProps = {
    /**
     * Currently selected value. Use empty string or null for "no selection".
     */
    value: string | null;
    /**
     * Called when the user selects a value or clears selection.
     */
    onChange: (value: string | null, option: SelectFieldOption | null) => void;
    /**
     * Options shown in the dropdown.
     */
    options: SelectFieldOption[];
    /**
     * Placeholder text shown when there is no value.
     */
    placeholder?: string;
    /**
     * Label rendered inside the trigger when a value is selected.
     * If omitted, the option label will be used.
     */
    selectedLabelPrefix?: ReactNode;
    /**
     * Optional icon shown on the left side of the trigger when a value is selected.
     */
    triggerIcon?: ReactNode;
    /**
     * When true, shows a special first option that clears the selection.
     */
    allowClear?: boolean;
    /**
     * Label for the clear option (when allowClear is true).
     */
    clearLabel?: string;
    /**
     * Optional description for the clear option.
     */
    clearDescription?: string;
    /**
     * Additional className for the root container.
     */
    className?: string;
    /**
     * Whether the field has an error.
     */
    error?: boolean;
    /**
     * Error message to display when error is true.
     */
    errorMessage?: string;
};

const SelectField = ({
    value,
    onChange,
    options,
    placeholder,
    selectedLabelPrefix,
    triggerIcon,
    allowClear = false,
    clearLabel,
    clearDescription,
    className,
    error,
    errorMessage,
}: SelectFieldProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleSelect = useCallback(
        (newValue: string | null) => {
            const option = options.find((opt) => opt.value === newValue) || null;
            onChange(newValue, option);
            setIsOpen(false);
        },
        [onChange, options],
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        }
    };

    const handleOptionKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>, newValue: string | null) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(newValue);
            }
        },
        [handleSelect],
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = useMemo(
        () => options.find((opt) => opt.value === value) || null,
        [options, value],
    );

    const hasValue = Boolean(selectedOption);

    const rootClassName = [
        'stachesepl-select-field',
        isOpen ? 'is-open' : '',
        hasValue ? 'has-value' : '',
        error ? 'stachesepl-select-field-error' : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={rootClassName}
            ref={containerRef}
        >
            <div
                className="stachesepl-select-field-trigger"
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="stachesepl-select-field-trigger-content">
                    {hasValue ? (
                        <>
                            {triggerIcon && (
                                <span className="stachesepl-select-field-icon">
                                    {triggerIcon}
                                </span>
                            )}
                            <span className="stachesepl-select-field-name">
                                {selectedLabelPrefix}
                                {selectedLabelPrefix ? ' ' : ''}
                                {selectedOption?.label}
                            </span>
                            {selectedOption?.badge && (
                                <Badge
                                    html={selectedOption.badge}
                                    tone="success"
                                />
                            )}
                        </>
                    ) : (
                        <span className="stachesepl-select-field-placeholder">
                            {placeholder || ''}
                        </span>
                    )}
                </div>
                <ExpandMore className={`stachesepl-select-field-chevron ${isOpen ? 'rotated' : ''}`} />
            </div>

            {isOpen && (
                <div className="stachesepl-select-field-dropdown" role="listbox">
                    {allowClear && (
                        <div
                            className={`stachesepl-select-field-option ${!hasValue ? 'is-selected' : ''}`}
                            onClick={() => handleSelect(null)}
                            onKeyDown={(e) => handleOptionKeyDown(e, null)}
                            role="option"
                            tabIndex={0}
                            aria-selected={!hasValue}
                        >
                            <div className="stachesepl-select-field-option-content stachesepl-select-field-option-content-clear">
                                <span className="stachesepl-select-field-option-name">
                                    {clearLabel || placeholder || ''}
                                </span>
                                {clearDescription && (
                                    <span className="stachesepl-select-field-option-desc">
                                        {clearDescription}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {allowClear && options.length > 0 && (
                        <div className="stachesepl-select-field-divider" />
                    )}

                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <div
                                key={option.value}
                                className={`stachesepl-select-field-option ${isSelected ? 'is-selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                                onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                                role="option"
                                tabIndex={0}
                                aria-selected={isSelected}
                            >
                                <div className="stachesepl-select-field-option-content">
                                    <div className="stachesepl-select-field-option-main">
                                        {option.icon && (
                                            <span className="stachesepl-select-field-option-icon">
                                                {option.icon}
                                            </span>
                                        )}
                                        <span className="stachesepl-select-field-option-name">
                                            {option.label}
                                        </span>
                                    </div>
                                    {option.badge && (
                                        <Badge
                                            html={option.badge}
                                            tone="success"
                                        />
                                    )}
                                </div>
                                {option.description && (
                                    <div className="stachesepl-select-field-option-desc">
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {error && errorMessage && (
                <FieldErrorMessage message={errorMessage} />
            )}
        </div>
    );
};

export default SelectField;


