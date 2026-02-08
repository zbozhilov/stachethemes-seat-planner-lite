import { East as ArrowRight } from '@mui/icons-material';
import DateTimePicker from '@src/front/DateTimePicker/DateTimePicker';
import { __ } from "@src/utils";
import { useRef } from "react";
import { useAddToCartText, useHasDate, useModalState, useProductId, useSelectedDate, useSelectedSeats, useShowViewCartButton } from "../context/hooks";
import SeatSelectorModal from "../SeatSelectorModal/SeatSelectorModal-compat";

const SelectSeatsButton = () => {

    const buttonRef = useRef<HTMLButtonElement>(null);
    const { addToCartText } = useAddToCartText();
    const { modalOpen, setModalOpen } = useModalState();
    const { showViewCartButton } = useShowViewCartButton();
    const { selectedDate, setSelectedDate } = useSelectedDate();
    const { selectedSeats, setSelectedSeats } = useSelectedSeats();
    const { hasDate } = useHasDate();
    const { productId } = useProductId();

    const handleButtonClick = (e: React.MouseEvent) => {

        e.preventDefault();

        if (selectedDate) {
            setModalOpen(true);
            return;
        }

        if (modalOpen) {
            return;
        }

        if (hasDate && !selectedDate) {

            if (buttonRef.current) {

                const rootContainer = buttonRef.current.closest('.stachesepl-add-to-cart-button-root');
                const datePickerInput = rootContainer?.querySelector('.stachesepl-date-time-input');

                if (datePickerInput) {
                    e.stopPropagation(); // prevents closing the datepicker
                    (datePickerInput as HTMLDivElement).click();
                    return;
                }
            }

            return;
        }

        setModalOpen(true);
    }

    const handleDateTimeChange = (dateTime: string) => {
        setSelectedDate(dateTime);

        if (selectedSeats.length > 0) {
            setSelectedSeats([]);
        }
    }

    return (
        <>
            <SeatSelectorModal />

            {
                hasDate &&
                <DateTimePicker
                    showAdjacentMonths={window.stachesepl_date_format.adjacent_months === 'yes'}
                    productId={productId}
                    selectedDateTime={selectedDate || ''}
                    onDateTimeSelected={handleDateTimeChange}
                    onConfirm={() => setModalOpen(true)} />
            }

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

