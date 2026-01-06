import useProductSeatPlan from "@src/front/AddToCart/hooks/useProductSeatPlan";
import { hasSeatPlanData } from "@src/front/AddToCart/utils/hasSeatPlanData";
import { __ } from "@src/utils";
import { useState } from "react";
import CircLoader from "../CircLoader/CircLoader";
import { useModalState } from "../context/hooks";
import Modal from "../Modal/Modal";
import SeatSelector from "../SeatSelector/SeatSelector";
import './SeatSelectorModal.scss';

const SeatSelectorModal = () => {

    const { modalOpen, setModalOpen } = useModalState();
    const [didLoad, setDidLoad] = useState(false);

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
                <CircLoader text={__('LOADING_SEATING_LAYOUT')}
                    accentColor="var(--stachesepl-accent-color)"
                    style={{
                        backgroundColor: 'var(--stachesepl-surface)',
                        padding: '2rem 3rem ',
                        borderRadius: 'var(--stachesepl-radius-lg)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        minWidth: 300
                    }} />
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
                (dataState !== 'ready' || !didLoad || !hasData) &&
                loaderContent
            }

            <SeatSelector
                readyToRender={dataState === 'ready' && hasData}
                onComponentLoaded={() => setDidLoad(true)} />
        </Modal>
    )
}

export default SeatSelectorModal;

