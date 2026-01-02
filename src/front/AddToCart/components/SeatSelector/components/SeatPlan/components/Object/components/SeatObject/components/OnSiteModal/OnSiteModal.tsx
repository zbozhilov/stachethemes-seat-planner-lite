import Modal from '@src/front/AddToCart/components/Modal/Modal';
import { __ } from '@src/utils';

interface OnSiteModalProps {
    open: boolean;
    message: string | null;
    onClose: () => void;
}

const OnSiteModal = ({ open, message, onClose }: OnSiteModalProps) => {
    return (
        <Modal open={open} onClose={onClose} onOutsideClick={onClose}>
            <div className="stachesepl-modal-message">
                <h3>{__('NOTICE')}</h3>
                <p>{message}</p>
                <button onClick={onClose}>{__('CLOSE')}</button>
            </div>
        </Modal>
    );
};

export default OnSiteModal;

