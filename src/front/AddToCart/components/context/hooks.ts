import { useContext } from "react";
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

export const useDiscounts = () => {
 
    const { seatPlanData } = useSeatPlanData();
    const { selectedSeats } = useSelectedSeats();

    const discounts = seatPlanData?.discounts || [];
    const hasDiscounts = discounts.length > 0;

    // Build a map: seatId -> configured discount name (if any) coming from seat object
    const seatIdToConfiguredDiscountName = () => {
        if (!seatPlanData?.objects) return {} as { [seatId: string]: string };
        const seats = seatPlanData.objects.filter((o) => o.type === 'seat');
        const map: { [seatId: string]: string } = {};
        seats.forEach((seat) => {
            if ('seatId' in seat && seat.seatId) {
                map[seat.seatId] = seat.discount || '';
            }
        });
        return map;
    };

    const configuredDiscountMap = seatIdToConfiguredDiscountName();

    // Validate a discount name against the available discounts list
    const isValidDiscountName = (name: string): boolean => {
        if (!name) return false;
        return discounts.some((d) => d.name === name);
    };

    // Compute selected seats with their default discount assignment (if valid)
    const selectedSeatsWithDiscounts = selectedSeats.map((seatId) => {
        const configured = configuredDiscountMap[seatId] || '';
        return {
            seatId,
            discountName: isValidDiscountName(configured) ? configured : ''
        } as { seatId: string; discountName: string };
    });

    return {
        discounts,
        hasDiscounts,
        selectedSeatsWithDiscounts,
        isValidDiscountName,
    }
}


export const useSelectedDate = () => {
    
    const { selectedDate, setSelectedDate } = useTheContext();

    return {
        selectedDate,
        setSelectedDate,
    }
}