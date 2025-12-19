import { SeatObjectProps, Statuses } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import { useState, useRef, useEffect } from 'react';
import './Status.scss';

interface StatusOption {
    value: Statuses;
    label: string;
    color: string;
}

const Status = (props: {
    objects: SeatObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { status } = firstObject;
    const areSameStatus = props.objects.every(object => object.status === status);
    const displayValue = areSameStatus ? (status || 'available') : '';

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options: StatusOption[] = [
        { value: 'available', label: __('AVAILABLE'), color: '#10b981' },
        { value: 'unavailable', label: __('UNAVAILABLE'), color: '#71717a' },
        { value: 'sold-out', label: __('SOLD_OUT'), color: '#ef4444' },
        { value: 'on-site', label: __('PURCHASABLE_ON_SITE'), color: '#f59e0b' },
    ];

    const selectedOption = options.find(opt => opt.value === displayValue);
    const displayLabel = selectedOption?.label || __('SEAT_STATUS');

    const handleChange = (value: Statuses) => {
        setObjects(prev => {
            return prev.map(object => {
                if (!objectIds.includes(object.id)) return { ...object };
                return {
                    ...object,
                    status: value
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
        <div className='stachesepl-toolbar-properties-status' ref={dropdownRef}>
            <label>{__('SEAT_STATUS')}</label>

            <button
                type="button"
                className={`stachesepl-status-trigger ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="stachesepl-status-trigger-content">
                    {selectedOption && (
                        <span 
                            className="stachesepl-status-dot" 
                            style={{ backgroundColor: selectedOption.color }}
                        />
                    )}
                    <span className={`stachesepl-status-trigger-text ${!selectedOption ? 'is-placeholder' : ''}`}>
                        {displayLabel}
                    </span>
                </span>
                <svg 
                    className="stachesepl-status-trigger-icon" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                >
                    <path fill="currentColor" d="M6 8L1 3h10z"/>
                </svg>
            </button>

            {isOpen && (
                <div className="stachesepl-status-dropdown" role="listbox">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={displayValue === option.value}
                            className={`stachesepl-status-option ${displayValue === option.value ? 'is-selected' : ''}`}
                            onClick={() => handleChange(option.value)}
                        >
                            <span className="stachesepl-status-option-content">
                                <span 
                                    className="stachesepl-status-dot" 
                                    style={{ backgroundColor: option.color }}
                                />
                                <span>{option.label}</span>
                            </span>
                            {displayValue === option.value && (
                                <svg 
                                    className="stachesepl-status-option-check" 
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

export default Status