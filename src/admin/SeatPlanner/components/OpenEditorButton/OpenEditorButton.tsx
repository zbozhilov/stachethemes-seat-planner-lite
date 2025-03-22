import BorderClearIcon from '@mui/icons-material/BorderClear';
import { SvgIcon } from '@mui/material';
import { __ } from '@src/utils';
import { useState } from 'react';
import EditorModal from './components/Modal/EditorModal';
import './OpenEditorButton.scss';

const OpenEditorButton = () => {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    return (
        <>
            <EditorModal open={open} onClose={handleClose} />

            <div className='stachesepl-open-editor-button' onClick={handleOpen}>
                <SvgIcon component={BorderClearIcon} />
                <span>{__('OPEN_SEAT_PLANNER')}</span>
            </div>
        </>
    )
}

export default OpenEditorButton