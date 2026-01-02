import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { __ } from '@src/utils';
import { MonthInfo, generateDays, getPrevMonth, getNextMonth } from './utils';

export interface UseMonthNavigationReturn {
    currentMonth: MonthInfo;
    prevMonth: MonthInfo | null;
    animationDirection: 'left' | 'right' | null;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    handleAnimationEnd: () => void;
}

/**
 * Custom hook for managing month navigation and animations
 */
export const useMonthNavigation = (initialDate?: string): UseMonthNavigationReturn => {
    const [currentMonth, setCurrentMonth] = useState<MonthInfo>(() => {
        if (initialDate) {
            const date = new Date(initialDate + 'T00:00:00');
            if (!isNaN(date.getTime())) {
                return { year: date.getFullYear(), month: date.getMonth() };
            }
        }
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const [prevMonth, setPrevMonth] = useState<MonthInfo | null>(null);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const lastSyncedDateRef = useRef<string | undefined>(initialDate);

    const handlePrevMonth = () => {
        if (isAnimating) return;

        setPrevMonth(currentMonth);
        setAnimationDirection('right');
        setIsAnimating(true);

        setCurrentMonth(getPrevMonth);
    };

    const handleNextMonth = () => {
        if (isAnimating) return;

        setPrevMonth(currentMonth);
        setAnimationDirection('left');
        setIsAnimating(true);

        setCurrentMonth(getNextMonth);
    };

    const handleAnimationEnd = () => {
        // Use setTimeout to ensure state updates happen after animation completes
        setTimeout(() => {
            setAnimationDirection(null);
            setPrevMonth(null);
            setIsAnimating(false);
        }, 0);
    };

    // Sync to initialDate when it changes (but not during animation)
    useEffect(() => {
        if (!initialDate || isAnimating || initialDate === lastSyncedDateRef.current) return;

        const date = new Date(initialDate + 'T00:00:00');
        if (isNaN(date.getTime())) return;

        const targetMonth = { year: date.getFullYear(), month: date.getMonth() };
        
        setCurrentMonth(targetMonth);
        lastSyncedDateRef.current = initialDate;
    }, [initialDate, isAnimating]);

    // Cleanup: ensure prevMonth is cleared if animation direction is cleared
    useEffect(() => {
        if (!animationDirection && prevMonth) {
            setPrevMonth(null);
            setIsAnimating(false);
        }
    }, [animationDirection, prevMonth]);

    return {
        currentMonth,
        prevMonth,
        animationDirection,
        handlePrevMonth,
        handleNextMonth,
        handleAnimationEnd,
    };
};

/**
 * Get week start from settings (0-6, where 0 = Sunday)
 */
export const useWeekStart = (): number => {
    return useMemo(() => {
        return parseInt(window.stachesepl_date_format?.week_start || '0', 10);
    }, []);
};

/**
 * Get localized month names
 */
export const useMonthNames = (): string[] => {
    return useMemo(() => [
        __('JANUARY'),
        __('FEBRUARY'),
        __('MARCH'),
        __('APRIL'),
        __('MAY'),
        __('JUNE'),
        __('JULY'),
        __('AUGUST'),
        __('SEPTEMBER'),
        __('OCTOBER'),
        __('NOVEMBER'),
        __('DECEMBER'),
    ], []);
};

/**
 * Get localized weekday names, adjusted for week start
 */
export const useWeekDays = (weekStart: number): string[] => {
    return useMemo(() => {
        const allWeekDays = [
            __('SUNDAY_SHORT'),
            __('MONDAY_SHORT'),
            __('TUESDAY_SHORT'),
            __('WEDNESDAY_SHORT'),
            __('THURSDAY_SHORT'),
            __('FRIDAY_SHORT'),
            __('SATURDAY_SHORT'),
        ];

        return [
            ...allWeekDays.slice(weekStart),
            ...allWeekDays.slice(0, weekStart),
        ];
    }, [weekStart]);
};

/**
 * Generate calendar days for current and previous months
 */
export const useCalendarDays = (
    currentMonth: MonthInfo,
    prevMonth: MonthInfo | null,
    datesList: string[],
    weekStart: number
) => {
    const currentDays = useMemo(
        () => generateDays(currentMonth.year, currentMonth.month, datesList, weekStart),
        [currentMonth.year, currentMonth.month, datesList, weekStart]
    );

    const prevDays = useMemo(() => {
        if (!prevMonth) return null;
        return generateDays(prevMonth.year, prevMonth.month, datesList, weekStart);
    }, [prevMonth, datesList, weekStart]);

    return { currentDays, prevDays };
};

export interface UseSwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    minSwipeDistance?: number;
}

export interface UseSwipeReturn {
    touchHandlers: {
        onTouchStart: (e: React.TouchEvent) => void;
        onTouchMove: (e: React.TouchEvent) => void;
        onTouchEnd: (e: React.TouchEvent) => void;
    };
}

/**
 * Custom hook for detecting swipe gestures on mobile devices
 */
export const useSwipe = (options: UseSwipeOptions = {}): UseSwipeReturn => {
    const { onSwipeLeft, onSwipeRight, minSwipeDistance = 50 } = options;
    
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
        touchEndX.current = null;
        touchEndY.current = null;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchEndX.current = touch.clientX;
        touchEndY.current = touch.clientY;
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!touchStartX.current || !touchEndX.current || !touchStartY.current || !touchEndY.current) {
            return;
        }

        const deltaX = touchEndX.current - touchStartX.current;
        const deltaY = touchEndY.current - touchStartY.current;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Only trigger swipe if horizontal movement is greater than vertical (horizontal swipe)
        // and the distance is greater than the minimum threshold
        if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
            if (deltaX > 0 && onSwipeRight) {
                // Swipe right
                onSwipeRight();
            } else if (deltaX < 0 && onSwipeLeft) {
                // Swipe left
                onSwipeLeft();
            }
        }

        // Reset touch positions
        touchStartX.current = null;
        touchStartY.current = null;
        touchEndX.current = null;
        touchEndY.current = null;
    }, [onSwipeLeft, onSwipeRight, minSwipeDistance]);

    return {
        touchHandlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
    };
};

