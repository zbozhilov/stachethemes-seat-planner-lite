import { useState } from "react";
import Button from "../Button/Button";
import WorkflowSettingsDialog from "./components/WorkflowSettingsDialog/WorkflowSettingsDialog";
import SettingsIcon from '@mui/icons-material/Settings';
import { __ } from "@src/utils";

const WorkflowSettingsButton = () => {

    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleWorkflowSettingsClose = () => {
        setSettingsOpen(false);
    }

    const handleWorkflowSettingsOpen = () => {
        setSettingsOpen(true);
    }

    return (
        <>
            <WorkflowSettingsDialog isOpen={settingsOpen} onClose={handleWorkflowSettingsClose} />
            <Button onClick={handleWorkflowSettingsOpen} icon={SettingsIcon} title={__('WORKFLOW_SETTINGS')} />
        </>
    )
}

export default WorkflowSettingsButton