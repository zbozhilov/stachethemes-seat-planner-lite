import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const useDropdownPosition = (props: {
    showDropdown: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}) => {

    const { showDropdown, containerRef, dropdownRef } = props;
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');

    // Calculate dropdown position and style for portal (desktop only)
    const calculateDropdownPosition = useCallback(() => {
        if (!containerRef.current) {
            return;
        }

        // On mobile, we don't need positioning (full-screen modal)
        if (window.innerWidth < 782) {
            setDropdownStyle({});
            return;
        }

        const inputElement = containerRef.current.querySelector('.stachesepl-date-time-input') as HTMLElement;
        if (!inputElement) {
            return;
        }

        const rect = inputElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Try to measure actual dropdown height
        const dropdownHeight = dropdownRef.current?.offsetHeight || 400;
        const minSpaceNeeded = dropdownHeight + 20;

        const isAbove = spaceBelow < minSpaceNeeded && spaceAbove > spaceBelow;
        setDropdownPosition(isAbove ? 'above' : 'below');

        // Get dropdown width to calculate horizontal positioning
        const dropdownWidth = dropdownRef.current?.offsetWidth || 500; // Default width if not measured yet
        const padding = 16; // Padding from screen edge

        // Calculate left position to prevent right-edge overflow
        let leftPosition = rect.left;
        const rightEdge = leftPosition + dropdownWidth;

        if (rightEdge > window.innerWidth - padding) {
            // Adjust left position to keep dropdown within viewport
            leftPosition = Math.max(padding, window.innerWidth - dropdownWidth - padding);
        }

        // Ensure dropdown doesn't go off the left edge
        leftPosition = Math.max(padding, leftPosition);

        // Calculate position for portal
        const style: React.CSSProperties = {
            position: 'fixed',
            left: `${leftPosition}px`,
            zIndex: 99999,
        };

        if (isAbove) {
            style.bottom = `${window.innerHeight - rect.top + 8}px`;
        } else {
            style.top = `${rect.bottom + 8}px`;
        }

        setDropdownStyle(style);
    }, [containerRef, dropdownRef]);

    // Handle scroll, resize, and delayed recalculation
    useEffect(() => {
        if (!showDropdown) {
            return;
        }

        // Recalculate after a short delay to use actual height
        const timeoutId = setTimeout(() => {
            calculateDropdownPosition();
        }, 0);

        // Handle scroll and resize events to reposition
        const handleRepositon = () => {
            calculateDropdownPosition();
        };

        window.addEventListener('scroll', handleRepositon, true);
        window.addEventListener('resize', handleRepositon);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', handleRepositon, true);
            window.removeEventListener('resize', handleRepositon);
        };
    }, [showDropdown, calculateDropdownPosition]);

    // Calculate immediately before browser paints
    useLayoutEffect(() => {
        if (!showDropdown) {
            setDropdownPosition('below');
            setDropdownStyle({});
            return;
        }

        // Calculate immediately before browser paints
        calculateDropdownPosition();
    }, [showDropdown, calculateDropdownPosition]);

    return {
        dropdownPosition,
        dropdownPositionStyle: dropdownStyle
    }
}

export default useDropdownPosition;