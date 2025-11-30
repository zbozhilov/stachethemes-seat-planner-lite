import { Accessible } from '@mui/icons-material';
import Modal from '@src/front/AddToCart/components/Modal/Modal';
import { __ } from '@src/utils';
import { useState } from 'react';
import { FrontWorkflowObject } from 'src/front/AddToCart/types';
import './SeatObject.scss';

const SeatObject = (props: {
    data: FrontWorkflowObject;
    selectedSeats: string[];
    style: React.CSSProperties;
    handleSeatSelectToggle: (seatId: string) => void;
}) => {

    const [modalMessage, setModalMessage] = useState<string | null>(null);

    if (props.data.type !== 'seat') {
        return null;
    }

    const isSelected = props.selectedSeats.includes(props.data.seatId);

    const classNameArray = ['stachesepl-object', 'stachesepl-object-seat'];

    if (isSelected) {
        classNameArray.push('selected');
    }

    if (!props.data.seatId || 'unavailable' === props.data.status) {
        classNameArray.push('disabled');
    }

    if (props.data.taken || props.data.status === 'sold-out') {
        classNameArray.push('taken');
    } else if (props.data.status === 'on-site') {
        classNameArray.push('onsite');
    }

    const onSiteOnly = props.data.status === 'on-site' && !props.data.taken;

    const handleModalClose = () => {
        setModalMessage(null);
    }

    return (
        <>
            {onSiteOnly && <>
                <Modal
                    open={!!modalMessage}
                    onClose={handleModalClose}
                    onOutsideClick={handleModalClose}
                >
                    <div className='stachesepl-modal-message'>
                        <p>{modalMessage}</p>
                        <button onClick={handleModalClose}>{__('CLOSE')}</button>
                    </div>
                </Modal>
            </>}
            <div
                className={classNameArray.join(' ')}
                style={props.style}
                onMouseDown={e => e.stopPropagation()}
                onClick={(e) => {

                    if ('status' in props.data && (props.data.status && ['unavailable', 'sold-out'].includes(props.data.status))) {
                        return;
                    }

                    if (onSiteOnly) {
                        setModalMessage(__('THIS_SEAT_IS_ONLY_AVAILABLE_ON_SITE'));
                        return;
                    }

                    if (props.data.type === 'seat' && props.data.seatId && !props.data.taken) {
                        props.handleSeatSelectToggle(props.data.seatId);
                    }

                }}>
                {props.data.isHandicap && <Accessible />}
                {!props.data.isHandicap && props.data.label}
            </div>
        </>
    )

}

export default SeatObject