import { useEffect, useRef } from 'react';
import { Portal } from 'react-portal';
import './Modal.scss';

const Modal = (props: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onOutsideClick?: () => void;
}) => {

    const { open, onClose } = props;
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (!open) {
            return;
        }

        // Check for modal stack and close only if the current modal is the last one
        const onCloseCheck = () => {
            const modals = document.querySelectorAll('.stachesepl-seat-planner-portal');

            if (modals.length > 1) {
                const isLastModal = containerRef.current === modals[modals.length - 1];
                if (!isLastModal) return;
            }

            onClose();
        }

        const handlePopState = (e: PopStateEvent) => {
            e.preventDefault();
            onCloseCheck();
        };

        const handleEscape = (e: KeyboardEvent) => {

            if (!open) {
                return;
            }

            if (e.key === 'Escape') {
                onCloseCheck();
            }
        }

        if (open) {
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handlePopState);
            document.body.classList.add('stachesepl-modal-open');
        } 

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.classList.remove('stachesepl-modal-open');
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('keydown', handleEscape);
        }

    }, [open, onClose]);

    if (!props.open) {
        return null;
    }

    return (
        <Portal>
            <div ref={containerRef} className='stachesepl-seat-planner-portal' onMouseDown={props.onOutsideClick}>
                <div style={{
                    display: 'contents'
                }} >
                    {props.children}
                </div>
            </div>
        </Portal>
    )
}

export default Modal