import PublishIcon from '@mui/icons-material/Publish';
import { __ } from "@src/utils";
import { useState } from "react";
import Button from "../Button/Button";
import ImportDialog from "./components/ImportDialog/ImportDialog";

const ImportDataButton = () => {

    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleWorkflowSettingsClose = () => {
        setSettingsOpen(false);
    }

    const handleWorkflowSettingsOpen = () => {
        setSettingsOpen(true);
    }

    return (
        <>
            <ImportDialog isOpen={settingsOpen} onClose={handleWorkflowSettingsClose} />
            <Button onClick={handleWorkflowSettingsOpen} icon={PublishIcon} title={__('IMPORT_SEAT_PLAN')} />
        </>
    )
}

export default ImportDataButton