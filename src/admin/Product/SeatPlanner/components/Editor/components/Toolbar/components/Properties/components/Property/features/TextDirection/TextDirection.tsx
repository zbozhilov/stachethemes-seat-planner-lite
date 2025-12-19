import { TextDirection as TextDirectionType } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { TextObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Text/types";
import { GenericObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import { useState, useRef, useEffect } from 'react';
import './TextDirection.scss';

interface TextDirectionOption {
    value: TextDirectionType;
    label: string;
}

const TextDirection = (props: {
    objects: TextObjectProps[] | GenericObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const textDirection = firstObject.textDirection || 'horizontal';
    const areSameDirection = props.objects.every(object => (object.textDirection || 'horizontal') === textDirection);
    const displayValue = areSameDirection ? textDirection : 'horizontal';

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options: TextDirectionOption[] = [
        { value: 'horizontal', label: __('TEXT_DIR_HORIZONTAL') },
        { value: 'vertical-upright', label: __('TEXT_DIR_VERTICAL_UPRIGHT') },
        { value: 'rotated-cw', label: __('TEXT_DIR_ROTATED_CW') },
    ];

    const selectedOption = options.find(opt => opt.value === displayValue);
    const displayLabel = selectedOption?.label || __('TEXT_DIR_HORIZONTAL');

    const handleDirectionChange = (value: TextDirectionType) => {
        setObjects(prev => {
            return prev.map(object => {
                if (!objectIds.includes(object.id)) return { ...object };
                return {
                    ...object,
                    textDirection: value
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
        <div className='stachesepl-toolbar-properties-textdirection' ref={dropdownRef}>
            <label>{__('TEXT_DIRECTION')}</label>

            <button
                type="button"
                className={`stachesepl-textdirection-trigger ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`stachesepl-textdirection-trigger-text ${!selectedOption ? 'is-placeholder' : ''}`}>
                    {displayLabel}
                </span>
                <svg 
                    className="stachesepl-textdirection-trigger-icon" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                >
                    <path fill="currentColor" d="M6 8L1 3h10z"/>
                </svg>
            </button>

            {isOpen && (
                <div className="stachesepl-textdirection-dropdown" role="listbox">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={displayValue === option.value}
                            className={`stachesepl-textdirection-option ${displayValue === option.value ? 'is-selected' : ''}`}
                            onClick={() => handleDirectionChange(option.value)}
                        >
                            {option.label}
                            {displayValue === option.value && (
                                <svg 
                                    className="stachesepl-textdirection-option-check" 
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

export default TextDirection

