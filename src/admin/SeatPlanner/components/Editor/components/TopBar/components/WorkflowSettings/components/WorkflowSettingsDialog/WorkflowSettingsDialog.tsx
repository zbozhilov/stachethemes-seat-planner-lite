import { __ } from '@src/utils';
import Dialog from '@src/admin/SeatPlanner/components/Editor/components/Dialog/Dialog';
import Settings from './components/Settings/Settings';

const WorkflowSettingsDialog = (props: {
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
            title={__('WORKFLOW_SETTINGS')}
            open={props.isOpen}
            onClose={handleOnClose}>

            <Settings />

        </Dialog>
    )
}

export default WorkflowSettingsDialog