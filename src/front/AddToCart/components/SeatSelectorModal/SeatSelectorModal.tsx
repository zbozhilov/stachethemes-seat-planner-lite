import useProductSeatPlan from "@src/front/AddToCart/hooks/useProductSeatPlan";
import { hasSeatPlanData } from "@src/front/AddToCart/utils/hasSeatPlanData";
import { __ } from "@src/utils";
import CircLoader from "../CircLoader/CircLoader";
import { useModalState } from "../context/hooks";
import Modal from "../Modal/Modal";
import LazySeatSelector from "../SeatSelector/LazySeatSelector";
import { useState } from "react";
import './SeatSelectorModal.scss';

const SeatSelectorModal = () => {

    const { modalOpen, setModalOpen } = useModalState();
    const [didLazyLoad, setDidLazyLoad] = useState(false);

    const { data, dataState } = useProductSeatPlan({
        disabled: !modalOpen,
    });

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const readyToOpenModal = modalOpen;

    const getLoaderContent = () => {
        return (
            <div className='stachesepl-seat-selector-loader-container'>
                <CircLoader text={__('LOADING_SEATING_LAYOUT')} colorMode="light" />
            </div>
        )
    }

    const loaderContent = getLoaderContent();
    const hasData = hasSeatPlanData(data);

    return (
        <Modal
            open={readyToOpenModal}
            onClose={handleModalClose}>


            {
                (dataState !== 'ready' || !didLazyLoad || !hasData) &&
                loaderContent
            }

            <LazySeatSelector
                readyToRender={dataState === 'ready' && hasData}
                onComponentLoaded={() => setDidLazyLoad(true)} />
        </Modal>
    )
}

export default SeatSelectorModal;