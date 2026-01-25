import fetchSeatOrderData, { SeatOrderData } from '@src/front/AddToCart/ajax/fetchSeatOrderData';
import { useRef, useState } from 'react';

type UseSeatOrderModalParams = {
    productId: number | null;
    selectedDate: string | null;
};

export function useSeatOrderModal({ productId, selectedDate }: UseSeatOrderModalParams) {
    const [seatOrderData, setSeatOrderData] = useState<SeatOrderData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const canViewSeatOrders = 'yes' === (window.seat_planner_add_to_cart?.can_view_seat_orders ?? 'no');

    const openModal = async (seatId: string) => {
        if (!canViewSeatOrders || !productId) {
            return;
        }

        // Abort any previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setIsOpen(true);

        try {
            const data = await fetchSeatOrderData({
                productId,
                seatId,
                selectedDate,
                signal: abortControllerRef.current.signal,
            });

            setSeatOrderData(data);
        } catch (error) {
            // Don't log abort errors
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Failed to fetch seat order data:', error);
            }
            setSeatOrderData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        // Abort ongoing request when modal is closed
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        setIsOpen(false);
        setSeatOrderData(null);
        setIsLoading(false);
    };

    return {
        isOpen,
        isLoading,
        seatOrderData,
        canViewSeatOrders,
        openModal,
        closeModal,
    };
}

