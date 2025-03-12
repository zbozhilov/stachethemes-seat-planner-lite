import { createContext } from 'react';
import { SeatPlanDataProps } from '../../types';

export interface AddToCartContextProps {

    productId: number,
    setProductId: (id: number) => void

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