import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import { useState, useRef, useEffect } from 'react';
import './FontSize.scss';

type FontSizeValue = 'small' | 'medium' | 'large';

interface FontSizeOption {
    value: FontSizeValue;
    label: string;
}

const FontSize = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { fontSize } = firstObject;
    const areSameSize = props.objects.every(object => object.fontSize === fontSize);
    const displayValue = areSameSize ? fontSize : '';

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options: FontSizeOption[] = [
        { value: 'small', label: __('FONT_SIZE_SMALL') },
        { value: 'medium', label: __('FONT_SIZE_MEDIUM') },
        { value: 'large', label: __('FONT_SIZE_LARGE') },
    ];

    const selectedOption = options.find(opt => opt.value === displayValue);
    const displayLabel = selectedOption?.label || __('SELECT_FONT_SIZE');

    const handleLabelChange = (value: FontSizeValue) => {
        setObjects(prev => {
            return prev.map(object => {
                if (!objectIds.includes(object.id)) return { ...object };
                return {
                    ...object,
                    fontSize: value
                }
            })
        });
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
        <div className='stachesepl-toolbar-properties-fontsize' ref={dropdownRef}>
            <label>{__('FONT_SIZE')}</label>

            <button
                type="button"
                className={`stachesepl-fontsize-trigger ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`stachesepl-fontsize-trigger-text ${!selectedOption ? 'is-placeholder' : ''}`}>
                    {displayLabel}
                </span>
                <svg 
                    className="stachesepl-fontsize-trigger-icon" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                >
                    <path fill="currentColor" d="M6 8L1 3h10z"/>
                </svg>
            </button>

            {isOpen && (
                <div className="stachesepl-fontsize-dropdown" role="listbox">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={displayValue === option.value}
                            className={`stachesepl-fontsize-option ${displayValue === option.value ? 'is-selected' : ''}`}
                            onClick={() => handleLabelChange(option.value)}
                        >
                            {option.label}
                            {displayValue === option.value && (
                                <svg 
                                    className="stachesepl-fontsize-option-check" 
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

export default FontSize