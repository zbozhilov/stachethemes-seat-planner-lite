import { useEffect, useRef, useState } from 'react';
import './Select.scss';

export interface SelectOption {
    value: string;
    label: string;
    prefix?: React.ReactNode
}

const Select = (props: {
    id?: string;
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
}) => {

    const { id, label, options, value, onChange } = props;

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const displayLabel = selectedOption?.label || label;

    const handleChange = (value: string) => {
        onChange(value);
        setIsOpen(false);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    return (
        <div id={id} className='stachesepl-select' ref={dropdownRef}>
            <label>{label}</label>

            <button
                type="button"
                className={`stachesepl-select-trigger ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="stachesepl-select-trigger-content">
                    {selectedOption ? selectedOption.prefix : null}
                    <span className={`stachesepl-select-trigger-text ${!selectedOption ? 'is-placeholder' : ''}`}>
                        {displayLabel}
                    </span>
                </span>
                <svg 
                    className="stachesepl-select-trigger-icon" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                >
                    <path fill="currentColor" d="M6 8L1 3h10z"/>
                </svg>
            </button>

            {isOpen && (
                <div className="stachesepl-select-dropdown" role="listbox">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={value === option.value}
                            className={`stachesepl-select-option ${value === option.value ? 'is-selected' : ''}`}
                            onClick={() => handleChange(option.value)}
                        >
                            <span className="stachesepl-select-option-content">
                                {option.prefix}
                                <span>{option.label}</span>
                            </span>
                            {value === option.value && (
                                <svg 
                                    className="stachesepl-select-option-check" 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5"
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Select