import { getFormatteDate, getFormattedTime } from '@src/utils';
import type { FormattedDateTime } from './types';

export const formatDateTime = (dateTimeString: string): FormattedDateTime => {
    const dateObj = new Date(dateTimeString);
    
    // Use utility functions for formatted display values
    const dateKey = dateTimeString.split('T')[0];
    const date = getFormatteDate(dateKey);
    
    // Extract time portion from datetime string for getFormattedTime
    // Handle formats like: "2024-01-15T14:30:00", "2024-01-15T14:30:00.000Z", "2024-01-15T14:30:00+00:00"
    let timePortion = '';
    if (dateTimeString.includes('T')) {
        const timePart = dateTimeString.split('T')[1];
        // Remove milliseconds and timezone info
        timePortion = timePart.split('.')[0].split('+')[0].split('-')[0].split('Z')[0];
    }
    const time = timePortion ? getFormattedTime(timePortion) : '';

    // Extract calendar widget values from Date object
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const day = dateObj.getDate().toString();
    const year = dateObj.getFullYear();
    const monthNum = dateObj.getMonth();
    const monthYearKey = `${year}-${String(monthNum + 1).padStart(2, '0')}`;

    return { date, time, dayName, month, day, year, monthNum, monthYearKey };
};
