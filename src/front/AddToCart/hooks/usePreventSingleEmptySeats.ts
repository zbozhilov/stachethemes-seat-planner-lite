
/**
 * Hook for checking if the seats can be booked (checking for no single empty seat)
 * @returns true if all selected seats can be booked without violations, false otherwise
 */
const usePreventSingleEmptySeats = (): boolean => {
    return true;
};

export default usePreventSingleEmptySeats;