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
            document.body.classList.add('stachesepl-modal-open');
        } else {
            window.removeEventListener('popstate', handlePopState);
            document.body.classList.remove('stachesepl-modal-open');
        }

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.classList.remove('stachesepl-modal-open');
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('keydown', handleEscape);
        }

    }, [open, onClose]);

    const handlePreventClose = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    if (!props.open) {
        return null;
    }

    return (
        <Portal>
            <div ref={containerRef} className='stachesepl-modal-overlay' onClick={onClose}>
                <div className='stachesepl-modal' onClick={handlePreventClose}>
                    {props.children}
                </div>
            </div>
        </Portal>
    )
}

export default Modal