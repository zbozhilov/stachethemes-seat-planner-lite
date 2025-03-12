import React, { useEffect } from 'react';
import './Dialog.scss';
import { DialogProps } from './types';
import { __ } from '@src/utils';

const Dialog = (props: DialogProps) => {

    const handleOverlayClick = () => {
        props.onClose();
    }

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                props.onClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => { window.removeEventListener('keydown', handleKeyDown); }

    }, [props]);

    return (
        <dialog className='stsp-dialog' onClick={handleOverlayClick}>
            <div className='stsp-dialog-container' style={{
                maxWidth: props.maxWidth ? `${props.maxWidth}px` : 'auto'
            }} onClick={handleContainerClick}>

                <div className='stsp-dialog-title'>
                    <span>{props.title}</span>
                </div>

                <div className='stsp-dialog-content'>
                    {props.children}
                </div>

                <div className='stsp-dialog-actions'>
                    {
                        !props.overrideActions && <div className='stsp-dialog-actions-button' onClick={props.onClose}>{__('CLOSE')}</div>
                    }
                    {
                        !!props.overrideActions && props.overrideActions.map((action, index) => {
                            return <div key={index} className='stsp-dialog-actions-button' onClick={action.onClick}>{action.text}</div>
                        })
                    }
                </div>
            </div>
        </dialog>
    )
}

export default Dialog