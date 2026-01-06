import { useContext } from "react";
import AddToCartContext, { AddToCartContextProps } from "../context/AddToCartContext";
import { __ } from "@src/utils";

export const useTheContext = () => {

    const context = useContext(AddToCartContext);

    if (null === context) {
        throw new Error('AddToCartContext is not available');
    }

    return context as AddToCartContextProps;

}

export const useProductId = () => {

    const { productId } = useTheContext();

    return {
        productId,
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

export const useCustomFields = () => {
    const { seatPlanData } = useSeatPlanData();

    const customFields = seatPlanData?.customFields || [];
    const hasCustomFields = customFields.length > 0;

    return {
        customFields,
        hasCustomFields,
    }
}

export const useSelectedDate = () => {
    return {
        selectedDate: null,
        setSelectedDate: (date: string | null) => { },
    }
}

export const useHasDate = () => {
    return {
        hasDate: false
    }
}

// The main button add to cart text
export const useAddToCartText = () => {

    const { addToCartDefaultText } = useTheContext();
    const { selectedDate } = useSelectedDate();
    const { selectedSeats } = useSelectedSeats();
    const { hasDate } = useHasDate();

    const selectSingleText = __('D_SEAT_SELECTED');
    const selectMultipleText = __('D_SEATS_SELECTED');

    const getText = () => {

        if (hasDate && !selectedDate) {
            return __('SELECT_DATE');
        } else if (selectedSeats.length === 0) {
            return addToCartDefaultText;
        } else if (selectedSeats.length === 1) {
            return selectSingleText.replace('%d', selectedSeats.length.toString());
        } else {
            return selectMultipleText.replace('%d', selectedSeats.length.toString());
        }
    }

    return {
        addToCartText: getText(),
    }
}