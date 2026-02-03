import PublishIcon from '@mui/icons-material/Publish';
import { __ } from "@src/utils";
import Button from "../Button/Button";
import toast from "react-hot-toast";

const ImportDataButton = () => {

    const handleImportData = () => {
        toast.error(__('IMPORT_SEAT_PLAN_NOT_SUPPORTED'));
    }

    return (
        <>
            <Button onClick={handleImportData} icon={PublishIcon} title={__('IMPORT_SEAT_PLAN')} />
        </>
    )
}

export default ImportDataButton