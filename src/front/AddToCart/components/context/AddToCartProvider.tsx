import { useState } from "react";
import AddToCartContext from "./AddToCartContext";
import { SeatPlanDataProps } from "../../types";

const AddToCartProvider = ({
    children,
    productId: initialProductId,
}: {
    productId: number;
    children: React.ReactNode;
}) => {

    const [productId, setProductId] = useState<number>(initialProductId);
    const [modalOpen, setModalOpen] = useState<boolean>(true);
    const [showViewCartButton, setShowViewCartButton] = useState<boolean>(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [seatPlanData, setSeatPlanData] = useState<SeatPlanDataProps|null>(null); 

    return (
        <AddToCartContext.Provider value={{

            productId,
            setProductId,

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
