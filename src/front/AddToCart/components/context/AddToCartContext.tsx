import { createContext } from 'react';
import { SeatPlanDataProps } from '../../types';

export interface AddToCartContextProps {

    productId: number,
    hasDate: boolean;
    addToCartDefaultText: string;

    selectedDate: string | null,
    setSelectedDate: (date: string | null) => void

    modalOpen: boolean,
    setModalOpen: (open: boolean) => void

    showViewCartButton: boolean,
    setShowViewCartButton: (show: boolean) => void

    selectedSeats: string[],
    setSelectedSeats: (seats: string[]) => void

    seatPlanData: SeatPlanDataProps|null,
    setSeatPlanData: (data: SeatPlanDataProps|null) => void
    
}

const AddToCartContext = createContext<AddToCartContextProps | undefined>(undefined);

export default AddToCartContext;