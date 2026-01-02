export interface DayInfo {
    day: number;
    dateString: string;
    isAvailable: boolean;
}

export interface MonthInfo {
    year: number;
    month: number;
}

/**
 * Get the number of days in a given month
 */
export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * Get the first day of the month adjusted for week start
 * @param year - The year
 * @param month - The month (0-11)
 * @param weekStart - The day of the week the week starts on (0-6, where 0 = Sunday)
 * @returns The adjusted first day of the month (0-6)
 */
export const getFirstDayOfMonth = (year: number, month: number, weekStart: number): number => {
    const dayOfWeek = new Date(year, month, 1).getDay(); // 0-6, where 0 = Sunday
    // Adjust based on week_start: shift so that weekStart becomes 0
    return (dayOfWeek - weekStart + 7) % 7;
};

/**
 * Format a date as YYYY-MM-DD string
 */
export const formatDateString = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Generate calendar days for a given month
 * Always returns 42 cells (6 rows × 7 days) for consistent height
 */
export const generateDays = (
    year: number,
    month: number,
    datesList: string[],
    weekStart: number
): (DayInfo | null)[] => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month, weekStart);
    const days: (DayInfo | null)[] = [];
    const TOTAL_CELLS = 42; // 6 rows × 7 days

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = formatDateString(year, month, day);
        days.push({
            day,
            dateString,
            isAvailable: datesList.includes(dateString),
        });
    }

    // Pad with empty cells to always have 42 cells (6 rows)
    while (days.length < TOTAL_CELLS) {
        days.push(null);
    }

    return days;
};

/**
 * Navigate to the previous month
 */
export const getPrevMonth = (current: MonthInfo): MonthInfo => {
    if (current.month === 0) {
        return { year: current.year - 1, month: 11 };
    }
    return { year: current.year, month: current.month - 1 };
};

/**
 * Navigate to the next month
 */
export const getNextMonth = (current: MonthInfo): MonthInfo => {
    if (current.month === 11) {
        return { year: current.year + 1, month: 0 };
    }
    return { year: current.year, month: current.month + 1 };
};

