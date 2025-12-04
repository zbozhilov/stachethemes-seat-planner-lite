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

            <h4 className="stachesepl-seat-planner-editor-head">{__('SEAT_PLANNER_EDITOR_HEAD')}</h4>
            <p className="stachesepl-seat-planner-editor-subtitle">{__('SEAT_PLANNER_EDITOR_SUBTITLE')}</p>

            <div className='stachesepl-open-editor-button' onClick={handleOpen}>
                <SvgIcon component={BorderClearIcon} />
                <span>{__('OPEN_SEAT_PLANNER')}</span>
            </div>

        </>
    )
}

export default OpenEditorButton