import { useContext, useEffect } from "react";
import AddToCartContext, { AddToCartContextProps } from "../context/AddToCartContext";

export const useTheContext = () => {

    const context = useContext(AddToCartContext);

    if (null === context) {
        throw new Error('AddToCartContext is not available');
    }

    return context as AddToCartContextProps;

}

export const useProductId = () => {

    const { productId, setProductId } = useTheContext();

    return {
        productId,
        setProductId,
    }
}

export const useSelectedSeats = () => {

    const { selectedSeats, setSelectedSeats } = useTheContext();

    return {
        selectedSeats,
        setSelectedSeats,
    }

}

export const useSeatPlanData = () => {

    const { seatPlanData, setSeatPlanData } = useTheContext();

    return {
        seatPlanData,
        setSeatPlanData,
    }

}

export const useModalState = () => {

    const { modalOpen, setModalOpen } = useTheContext();

    return {
        modalOpen,
        setModalOpen,
    }
}


export const useShowViewCartButton = () => {

    const { showViewCartButton, setShowViewCartButton } = useTheContext();

    return {
        showViewCartButton,
        setShowViewCartButton,
    }

}