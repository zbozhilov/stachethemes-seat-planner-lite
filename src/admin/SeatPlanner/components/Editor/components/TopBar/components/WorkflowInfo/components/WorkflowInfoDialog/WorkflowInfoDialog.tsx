import { __ } from '@src/utils';
import Dialog from '@src/admin/SeatPlanner/components/Editor/components/Dialog/Dialog';
import Content from './components/Content/Content';

const WorkflowInfoDialog = (props: {
    isOpen: boolean,
    onClose: () => void
}) => {

    const handleOnClose = () => {
        props.onClose();
    }

    if (!props.isOpen) {
        return null;
    }

    return (
        <Dialog
            title={__('KEYSTROKE_ACTIONS')}
            open={props.isOpen}
            onClose={handleOnClose}>

            <Content />

        </Dialog>
    )
}

export default WorkflowInfoDialog