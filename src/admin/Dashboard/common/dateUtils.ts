/**
 * Format a date string for datetime-local input (YYYY-MM-DDTHH:mm).
 */
export function formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    return dateString.substring(0, 16);
}
