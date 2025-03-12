import { useEffect, useRef } from 'react';
import { Portal } from 'react-portal';
import './Modal.scss';

const Modal = (props: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) => {

    const { open, onClose } = props;
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const handlePopState = (e: PopStateEvent) => {
            e.preventDefault();
            onClose();
        };

        const handleEscape = (e: KeyboardEvent) => {

            if (!open) {
                return;
            }

            if (e.key === 'Escape') {
                onClose();
            }
        }

        if (open) {
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handlePopState);
            document.body.classList.add('stsp-modal-open');
        } else {
            window.removeEventListener('popstate', handlePopState);
            document.body.classList.remove('stsp-modal-open');
        }

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.classList.remove('stsp-modal-open');
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('keydown', handleEscape);
        }

    }, [open, onClose]);

    if (!props.open) {
        return null;
    }

    return (
        <Portal>
            <div ref={containerRef} className='stsp-seat-planner-portal'>
                {props.children}
            </div>
        </Portal>
    )
}

export default Modal