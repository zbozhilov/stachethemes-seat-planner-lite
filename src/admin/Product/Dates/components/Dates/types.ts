// Format: "2025-01-01T10:00" - used for backend storage
export type dateData = string;

// Format: "10:00" - time only
export type timeData = string;

// Grouped format for the UI - a date with multiple times
export interface DateGroup {
    date: string; // Format: "2025-01-01"
    times: timeData[];
}

// Helper to convert flat array to grouped format
export const flatToGrouped = (flatDates: dateData[]): DateGroup[] => {
    const grouped: Map<string, timeData[]> = new Map();
    
    flatDates.forEach(dateTime => {
        const [date, time] = dateTime.split('T');
        if (!grouped.has(date)) {
            grouped.set(date, []);
        }
        grouped.get(date)!.push(time);
    });
    
    // Convert map to array and sort by date
    const result: DateGroup[] = [];
    grouped.forEach((times, date) => {
        result.push({ date, times: times.sort() });
    });
    
    return result.sort((a, b) => a.date.localeCompare(b.date));
};

// Helper to convert grouped format to flat array for backend
export const groupedToFlat = (grouped: DateGroup[]): dateData[] => {
    const flat: dateData[] = [];
    
    grouped.forEach(group => {
        group.times.forEach(time => {
            flat.push(`${group.date}T${time}`);
        });
    });
    
    // Sort and return unique values
    return [...new Set(flat)].sort();
};
