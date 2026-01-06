import { East as ArrowRight } from '@mui/icons-material';
import { __ } from "@src/utils";
import { useRef } from "react";
import { useAddToCartText, useModalState, useShowViewCartButton } from "../context/hooks";
import SeatSelectorModal from "../SeatSelectorModal/SeatSelectorModal";

const SelectSeatsButton = () => {

    const buttonRef = useRef<HTMLButtonElement>(null);
    const { addToCartText } = useAddToCartText();
    const { modalOpen, setModalOpen } = useModalState();
    const { showViewCartButton } = useShowViewCartButton();

    const handleButtonClick = (e: React.MouseEvent) => {

        e.preventDefault();

        if (modalOpen) {
            return;
        }

        setModalOpen(true);
    }

    return (
        <>

            <SeatSelectorModal />

            <button ref={buttonRef} className="stachesepl-select-seats-button" onClick={handleButtonClick}>
                {addToCartText}
            </button>

            {
                showViewCartButton &&
                <a href={window.seat_planner_add_to_cart.cart_url} className="stachesepl-view-cart-button" title="View cart">
                    {__('VIEW_CART')}
                    <ArrowRight />
                </a>
            }
        </>
    )
}

export default SelectSeatsButton;