import PublishIcon from '@mui/icons-material/Publish';
import { __ } from "@src/utils";
import Button from "../Button/Button";
import toast from 'react-hot-toast';

const ImportDataButton = () => {

    const handleWorkflowSettingsOpen = () => {
        toast.error(__('IMPORT_DATA_NOT_AVAILABLE_FOR_LITE_VERSION'));
    }

    return (
        <>
            <Button onClick={handleWorkflowSettingsOpen} icon={PublishIcon} title={__('IMPORT_SEAT_PLAN')} />
        </>
    )
}

export default ImportDataButton