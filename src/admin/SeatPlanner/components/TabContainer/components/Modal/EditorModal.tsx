import Editor from '@src/admin/SeatPlanner/components/Editor/Editor';
import { useEffect, useRef } from 'react';
import { Portal } from 'react-portal';
import './EditorModal.scss';
import Toaster from '../../../../../CommonUI/Toaster/Toaster';

const EditorModal = (props: {
    open: boolean;
    onClose: () => void;
}) => {

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (props.open) {
            document.body.classList.add('stachesepl-seat-planner-editor-portal-open');
            document.body.style.overflow = 'hidden';

            if (containerRef.current) {
                containerRef.current?.parentElement?.classList.add('stachesepl-seat-planner-editor-portal-wrapper');
            }

        } else {
            document.body.classList.remove('stachesepl-seat-planner-editor-portal-open');
            document.body.style.overflow = 'auto';

            setTimeout(() => {
                // Trigger resize to fix the elements size
                window.dispatchEvent(new Event('resize'));
            }, 0);
        }


    }, [props.open]);

    if (!props.open) {
        return null;
    }

    return (
        <Portal>
            <Toaster />

            <div ref={containerRef} className='stachesepl-seat-planner-editor-portal'>

                <Editor onClose={props.onClose} />
            </div>
        </Portal>
    )
}

export default EditorModal