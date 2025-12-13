import Button from '@src/admin/CommonUI/Button/Button';
import Container from '@src/admin/CommonUI/Container/Container';
import { __ } from '@src/utils';
import { useState } from 'react';
import EditorModal from './components/Modal/EditorModal';
import './TabContainer.scss';

const TabContainer = () => {

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

            <Container label={__('SEAT_PLANNER_EDITOR_HEAD')} description={__('SEAT_PLANNER_EDITOR_SUBTITLE')}>

                <Button
                    className='stachesepl-seat-planner-tab-container-button'
                    onClick={handleOpen}>
                    {__('OPEN_SEAT_PLANNER')}
                </Button>

            </Container>

        </>
    )
}

export default TabContainer