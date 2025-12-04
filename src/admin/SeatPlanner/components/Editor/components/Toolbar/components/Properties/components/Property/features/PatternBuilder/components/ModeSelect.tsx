import { useState, useRef, useEffect } from 'react';
import { __ } from '@src/utils';
import { KeyboardArrowDown, Check } from '@mui/icons-material';
import { PatternType, ModeOption } from '../types';

const modeOptions: ModeOption[] = [
    { value: 'linear', label: 'SIMPLE', description: '1, 2, 3…' },
    { value: 'linear-repeat', label: 'REPEAT_EACH', description: '1, 1, 1, 2, 2, 2…' },
    { value: 'cyclic', label: 'CYCLE', description: '1, 2, 3, 1, 2, 3…' }
];

interface ModeSelectProps {
    value: PatternType;
    onChange: (value: PatternType) => void;
    segmentId: string;
}

const ModeSelect = (props: ModeSelectProps) => {
    const { value, onChange, segmentId } = props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = modeOptions.find(opt => opt.value === value);

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

    const handleSelect = (optionValue: PatternType) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="stachesepl-pattern-select" ref={dropdownRef}>
            <button
                type="button"
                className={`stachesepl-pattern-select-trigger ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                id={`mode-select-${segmentId}`}
            >
                <span className="stachesepl-pattern-select-text">
                    {selectedOption ? __(selectedOption.label) : __('SELECT')}
                </span>
                <KeyboardArrowDown 
                    className="stachesepl-pattern-select-icon" 
                    sx={{ fontSize: 18 }}
                />
            </button>

            {isOpen && (
                <div className="stachesepl-pattern-select-dropdown" role="listbox">
                    {modeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={value === option.value}
                            className={`stachesepl-pattern-select-option ${value === option.value ? 'is-selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            <span className="stachesepl-pattern-select-option-content">
                                <span className="stachesepl-pattern-select-option-label">
                                    {__(option.label)}
                                </span>
                                <span className="stachesepl-pattern-select-option-desc">
                                    {option.description}
                                </span>
                            </span>
                            {value === option.value && (
                                <Check 
                                    className="stachesepl-pattern-select-option-check" 
                                    sx={{ fontSize: 16 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModeSelect;

