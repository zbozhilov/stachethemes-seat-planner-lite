import { useEffect } from "react";

const useMobileBackButton = (props: {
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
}) => {

    const { showDropdown, setShowDropdown } = props;

    useEffect(() => {
        if (!showDropdown) {
            return;
        }

        // Only handle back button on mobile
        if (window.innerWidth >= 782) {
            return;
        }

        const handlePopState = (e: PopStateEvent) => {
            e.preventDefault();
            setShowDropdown(false);
        };

        // Push state to history when modal opens
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [showDropdown, setShowDropdown]);

}

export default useMobileBackButton;