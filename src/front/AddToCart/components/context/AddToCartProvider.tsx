import { useState } from "react";
import AddToCartContext from "./AddToCartContext";
import { SeatPlanDataProps } from "../../types";

const AddToCartProvider = ({
    children,
    productId,
    hasDate,
    initialDate,
    addToCartDefaultText,
}: {
    productId: number;
    hasDate: boolean;
    addToCartDefaultText: string;
    initialDate: string | null;
    children: React.ReactNode;
}) => {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [showViewCartButton, setShowViewCartButton] = useState<boolean>(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [seatPlanData, setSeatPlanData] = useState<SeatPlanDataProps|null>(null); 
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

    return (
        <AddToCartContext.Provider value={{

            productId,
            hasDate,
            addToCartDefaultText,

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