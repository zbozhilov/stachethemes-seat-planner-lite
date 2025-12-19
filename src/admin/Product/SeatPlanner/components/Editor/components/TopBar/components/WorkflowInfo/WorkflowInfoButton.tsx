import { useState } from "react";
import Button from "../Button/Button";
import WorkflowInfoDialog from "./components/WorkflowInfoDialog/WorkflowInfoDialog";
import { Info } from "@mui/icons-material";
import { __ } from "@src/utils";

const WorkflowInfoButton = () => {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    return (
        <>
            <WorkflowInfoDialog isOpen={open} onClose={handleClose} />
            <Button onClick={handleOpen} icon={Info} title={__('KEYSTROKE_ACTIONS')} />
        </>
    )
}

export default WorkflowInfoButton