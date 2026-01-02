import { useEffect } from "react";

const useOutsideHandler = (props: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    setShowDropdown: (show: boolean) => void;
}) => {

    const { containerRef, dropdownRef, setShowDropdown } = props;

    useEffect(() => {

        // outside click handler (only for desktop)
        const handleOutsideClick = (event: MouseEvent) => {
            // Skip on mobile since we use the overlay
            if (window.innerWidth < 782) return;

            const target = event.target as Node;
            const isInsideContainer = containerRef.current?.contains(target);
            const isInsideDropdown = dropdownRef.current?.contains(target);

            if (!isInsideContainer && !isInsideDropdown) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('click', handleOutsideClick);

        return () => document.removeEventListener('click', handleOutsideClick);

    }, [setShowDropdown, containerRef, dropdownRef]);

}

export default useOutsideHandler;