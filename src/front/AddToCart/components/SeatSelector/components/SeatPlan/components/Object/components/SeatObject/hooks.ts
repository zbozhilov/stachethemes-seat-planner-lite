import { useCallback, useEffect, useRef, useState } from 'react';
import { TooltipPosition } from './types';
import { calculateTooltipPosition, getIsTooltipDisabled } from './utils';

/**
 * Custom hook to manage tooltip visibility and positioning
 */
export const useTooltip = () => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0, showBelow: false });
    const seatRef = useRef<HTMLDivElement>(null);

    const show = useCallback(() => {
        if (getIsTooltipDisabled()) return;
        setPosition(calculateTooltipPosition(seatRef.current));
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        if (getIsTooltipDisabled()) return;
        setVisible(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        show();
    }, [show]);

    const handleMouseLeave = useCallback(() => {
        hide();
    }, [hide]);

    return {
        seatRef,
        visible,
        position,
        handleMouseEnter,
        handleMouseLeave,
    };
};

/**
 * Custom hook to manage the on-site only modal state
 */
export const useOnSiteModal = () => {
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    const showModal = useCallback((message: string) => {
        setModalMessage(message);
    }, []);

    const hideModal = useCallback(() => {
        setModalMessage(null);
    }, []);

    return {
        modalMessage,
        isOpen: !!modalMessage,
        showModal,
        hideModal,
    };
};
