import React, { useEffect, useRef, useState } from 'react'
import { ColorPicker as ReactColorPicker, useColor } from 'react-color-palette'
import "react-color-palette/css"
import { useOutsideHandler } from './hooks'
import './ColorPicker.scss'

type ColorPickerProps = {
    label?: string
    description?: string
    value?: string
    defaultValue?: string
    onChange?: (color: string) => void
    name?: string
    id?: string
    disabled?: boolean
}

const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>((props, ref) => {
    const { label, description, value, defaultValue, onChange, name, id, disabled } = props;

    const initialColor = value || defaultValue || '#6366f1';
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useColor(initialColor);
    const [displayValue, setDisplayValue] = useState(initialColor);
    const [inputValue, setInputValue] = useState(initialColor.toUpperCase());

    const dropdownRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const pendingColor = useRef<string>(initialColor);

    // Sync with external value changes
    useEffect(() => {
        if (value !== undefined && value !== color.hex) {
            setColor({ ...color, hex: value });
            setDisplayValue(value);
            setInputValue(value.toUpperCase());
            pendingColor.current = value;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handlePreviewClick = () => {
        if (!disabled) {
            setShowColorPicker(!showColorPicker);   
        }
    }

    useOutsideHandler([dropdownRef, previewRef], () => {
        if (showColorPicker) {
            setShowColorPicker(false);
            if (pendingColor.current !== displayValue) {
                setDisplayValue(pendingColor.current);
                onChange?.(pendingColor.current);
            }
        }
    })

    // Position the dropdown
    useEffect(() => {
        if (!showColorPicker || !dropdownRef.current || !previewRef.current || !wrapperRef.current) {
            return;
        }

        const positionDropdown = () => {
            const dropdownElement = dropdownRef.current;
            const previewElement = previewRef.current;
            const wrapperElement = wrapperRef.current;
            if (!dropdownElement || !previewElement || !wrapperElement) return;

            const previewRect = previewElement.getBoundingClientRect();
            const dropdownRect = dropdownElement.getBoundingClientRect();
            const wrapperRect = wrapperElement.getBoundingClientRect();

            // Calculate offsets relative to the positioned parent (wrapper)
            const previewLeftRelative = previewRect.left - wrapperRect.left;
            const previewTopRelative = previewRect.top - wrapperRect.top;

            // Check if dropdown should appear above or below
            const spaceBelow = window.innerHeight - previewRect.bottom;
            const showAbove = spaceBelow < dropdownRect.height + 16 && previewRect.top > dropdownRect.height + 16;

            // Position horizontally - keep within viewport, but relative to wrapper
            let left = previewLeftRelative; 
            const viewportLeft = previewRect.left;
            if (viewportLeft + dropdownRect.width > window.innerWidth - 16) {
                // Adjust to keep within viewport, but maintain relative positioning
                left = (window.innerWidth - dropdownRect.width - 16) - wrapperRect.left;
            }
            if (viewportLeft < 16) {
                // Adjust to keep within viewport
                left = 16 - wrapperRect.left;
            }
            // Ensure dropdown doesn't go outside wrapper bounds
            if (left < 0) {
                left = 0;
            }
            if (left + dropdownRect.width > wrapperRect.width) {
                left = wrapperRect.width - dropdownRect.width;
            }
            dropdownElement.style.left = `${left - 10}px`

            // Position vertically relative to wrapper
            if (showAbove) {
                dropdownElement.style.top = `${previewTopRelative - dropdownRect.height - 8}px`;
                dropdownElement.classList.add('stachesepl-color-picker-dropdown-top');
            } else {
                dropdownElement.style.top = `${previewTopRelative + 50}px`;
                dropdownElement.classList.remove('stachesepl-color-picker-dropdown-top');
            }
        }

        // Position immediately and also after a frame (to get correct dropdown dimensions)
        positionDropdown();
        requestAnimationFrame(positionDropdown);
    }, [showColorPicker]);

    const handleColorChange = (newColor: typeof color) => {
        setColor(newColor);
        setInputValue(newColor.hex.toUpperCase());
        pendingColor.current = newColor.hex;
    };

    // Validate and update color from input
    const validateAndUpdateColor = (input: string) => {
        // Remove any whitespace
        const trimmed = input.trim();
        
        // Check if it's a valid hex color (with or without #)
        const hexPattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
        if (hexPattern.test(trimmed)) {
            // Add # if missing
            const hexColor = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
            // Normalize to 6-digit hex if 3-digit
            const normalizedHex = hexColor.length === 4 
                ? `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`
                : hexColor;
            
            setColor({ ...color, hex: normalizedHex });
            setInputValue(normalizedHex.toUpperCase());
            setDisplayValue(normalizedHex);
            pendingColor.current = normalizedHex;
            onChange?.(normalizedHex);
        } else {
            // Invalid color, revert to current color
            setInputValue(color.hex.toUpperCase());
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue.toUpperCase());
    };

    const handleInputBlur = () => {
        validateAndUpdateColor(inputValue);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateAndUpdateColor(inputValue);
            e.currentTarget.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setInputValue(color.hex.toUpperCase());
            e.currentTarget.blur();
        }
    };

    return (
        <div ref={wrapperRef} className={`stachesepl-color-picker-wrapper ${disabled ? 'stachesepl-color-picker-disabled' : ''}`}>
            {label && (
                <label className="stachesepl-color-picker-label">
                    {label}
                </label>
            )}
            {description && (
                <span className="stachesepl-color-picker-description">
                    {description}
                </span>
            )}
            <div className="stachesepl-color-picker-input-wrapper">
                <div
                    ref={previewRef}
                    className="stachesepl-color-picker-swatch"
                    style={{ backgroundColor: color.hex }}
                    onClick={handlePreviewClick}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handlePreviewClick()
                        }
                    }}
                    role="button"
                    aria-label="Open color picker"
                    aria-expanded={showColorPicker}
                />
                <div className="stachesepl-input-container stachesepl-color-picker-value-container">
                    <input
                        type="text"
                        className="stachesepl-input stachesepl-color-picker-value"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        disabled={disabled}
                        aria-label="Color hex value"
                    />
                </div>
                {/* Hidden input for form compatibility */}
                <input
                    ref={(node) => {
                        // Handle both refs
                        if (typeof ref === 'function') {
                            ref(node)
                        } else if (ref) {
                            ref.current = node
                        }
                        hiddenInputRef.current = node
                    }}
                    type="hidden"
                    name={name}
                    id={id}
                    value={color.hex}
                />
            </div>

            {showColorPicker && <div className="stachesepl-color-picker-dropdown" ref={dropdownRef}>
                <ReactColorPicker
                    hideAlpha={false}
                    hideInput={['rgb', 'hsv']}
                    color={color}
                    onChange={handleColorChange}
                />
            </div>}
        </div>
    )
})

ColorPicker.displayName = 'ColorPicker'

export default ColorPicker
