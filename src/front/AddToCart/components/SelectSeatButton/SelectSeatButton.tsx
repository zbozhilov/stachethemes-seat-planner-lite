import { __ } from "@src/utils";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Portal } from "react-portal";
import { useModalState, useProductId, useSelectedDate, useSelectedSeats, useShowViewCartButton } from "../context/hooks";
import Modal from "../Modal/Modal";
import SeatSelector from "../SeatSelector/SeatSelector";
import { useButtonLabel, useProductSeatPlan } from "./hooks";
import { hasSeatPlanData } from "./utils";

const SelectSeatButton = (props: {
    buttonAttribs: {
        Tag: string;
        attributes: { [key: string]: string };
        children: string;
    };
}) => {

    const { productId } = useProductId();
    const { selectedDate } = useSelectedDate();
    const { modalOpen, setModalOpen } = useModalState();
    const { showViewCartButton } = useShowViewCartButton();
    const { selectedSeats } = useSelectedSeats();

    const { data, dataState } = useProductSeatPlan({
        productId: productId,
        disabled: !modalOpen,
        selectedDate: selectedDate
    });

    const handleButtonClick = (e: React.MouseEvent) => {

        e.preventDefault();
        e.stopPropagation();

        if (modalOpen) {
            return;
        }

        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const buttonLabel = useButtonLabel({
        defaultText: props.buttonAttribs.children,
        selectSingleText: __('D_SEAT_SELECTED'),
        selectMultipleText: __('D_SEATS_SELECTED'),
    });

    const ButtonComponent = () => {

        const classString = [
            props.buttonAttribs.attributes.className,
            'st_select_seat_button_rendered',
            dataState === 'loading' && 'loading',
            selectedSeats.length > 0 && 'added'
        ].filter(Boolean).join(' ');

        return (
            React.createElement(props.buttonAttribs.Tag, {
                ...props.buttonAttribs.attributes,
                onClick: handleButtonClick,
                className: classString,
                dangerouslySetInnerHTML: { __html: buttonLabel }
            })
        )

    }

    const readyToOpenModal = modalOpen && dataState === 'ready';

    return (
        <>
            <Portal>
                <Toaster
                    position="top-center"
                    containerStyle={{
                        zIndex: 100000
                    }}

                    toastOptions={{
                        success: {
                            iconTheme: {
                                primary: '#4CAF50',
                                secondary: '#fff',
                            }
                        },
                        className: 'stachesepl-toast',
                        style: {
                            fontSize: '1rem'
                        }
                    }}
                />
            </Portal>

            <Modal
                open={readyToOpenModal}
                onClose={handleModalClose}>
                {
                    hasSeatPlanData(data) &&
                    <SeatSelector />
                }
            </Modal>

            <ButtonComponent />

            {
                showViewCartButton &&
                <a href={window.seat_planner_add_to_cart.cart_url} className="added_to_cart wc-forward" title="View cart">{__('VIEW_CART')}</a>
            }
        </>
    );
}

export default SelectSeatButton