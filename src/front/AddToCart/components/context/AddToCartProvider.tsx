import { useState } from "react";
import AddToCartContext from "./AddToCartContext";
import { SeatPlanDataProps } from "../../types";
import { useEffect } from "react";

const AddToCartProvider = ({
    children,
    productId: initialProductId,
    dateSelector,
}: {
    productId: number;
    dateSelector: HTMLSelectElement | HTMLInputElement | null;
    children: React.ReactNode;
}) => {

    const [productId, setProductId] = useState<number>(initialProductId);
    const [modalOpen, setModalOpen] = useState<boolean>(true);
    const [showViewCartButton, setShowViewCartButton] = useState<boolean>(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [seatPlanData, setSeatPlanData] = useState<SeatPlanDataProps|null>(null); 
    const [selectedDate, setSelectedDate] = useState<string | null>(dateSelector?.value ?? null);

    useEffect(() => {

        if (!dateSelector) {
            return;
        }

        const updateSelectedDate = (e: Event) => {
            setSelectedDate((e.target as HTMLSelectElement).value);
            setSelectedSeats([]);
            setShowViewCartButton(false);
        }

        dateSelector.addEventListener('change', updateSelectedDate);

        return () => {
            if (dateSelector) {
                dateSelector.removeEventListener('change', updateSelectedDate);
            }
        }

    }, [dateSelector, setSelectedDate]);

    return (
        <AddToCartContext.Provider value={{

            productId,
            setProductId,

            selectedDate,
            setSelectedDate,

            modalOpen,
            setModalOpen,

            showViewCartButton,
            setShowViewCartButton,

            selectedSeats,
            setSelectedSeats,

            seatPlanData,
            setSeatPlanData,

        }}>
            {children}
        </AddToCartContext.Provider>
    );
};

export default AddToCartProvider;