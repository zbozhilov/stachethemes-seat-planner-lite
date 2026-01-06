import { useMemo } from 'react';
import { useSelectedSeats, useSeatPlanData } from '@src/front/AddToCart/components/context/hooks';
import { validateSeatSelectionFromObjects } from '@src/front/AddToCart/utils/preventSingleEmptySeats';

/**
 * Hook for checking if the seats can be booked (checking for no single empty seat)
 * @returns true if all selected seats can be booked without violations, false otherwise
 */
const usePreventSingleEmptySeats = (): boolean => {
    
    const { selectedSeats } = useSelectedSeats();
    const { seatPlanData } = useSeatPlanData();
    
    const workflowProps = seatPlanData?.workflowProps;
    const pesEnabled = workflowProps?.pesEnabled;
    const pesVertTolerance = workflowProps?.pesVertTolerance;
    const pesGroupThreshold = workflowProps?.pesGroupThreshold;

    return useMemo(() => {

        if (!pesEnabled) {
            return true;
        }

        // If no seats are selected, validation passes (no violations)
        if (!selectedSeats || selectedSeats.length === 0) {
            return true;
        }

        // If no seat plan data or objects, validation fails
        if (!seatPlanData || !seatPlanData.objects || seatPlanData.objects.length === 0) {
            return false;
        }

        // Validate seat selection
        const validationConfig: {
            rowTolerance?: number;
            clusterSpacingMultiplier?: number;
        } = {};
        
        if (pesVertTolerance !== undefined) {
            validationConfig.rowTolerance = pesVertTolerance;
        }
        
        if (pesGroupThreshold !== undefined) {
            validationConfig.clusterSpacingMultiplier = pesGroupThreshold;
        }
        
        const { canBook } = validateSeatSelectionFromObjects(
            seatPlanData.objects,
            selectedSeats,
            validationConfig
        );

        // Check if all selected seats can be booked
        const allSeatsCanBeBooked = selectedSeats.every(seatId => {
            const canBookSeat = canBook.get(seatId);
            return canBookSeat === true;
        });

        return allSeatsCanBeBooked;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSeats, seatPlanData, pesEnabled, pesVertTolerance, pesGroupThreshold]);
};

export default usePreventSingleEmptySeats;

