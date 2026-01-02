import PublishIcon from '@mui/icons-material/Publish';
import { __ } from "@src/utils";
import toast from "react-hot-toast";
import Button from "../Button/Button";

const ImportDataButton = () => {

    const handleClick = () => {
        toast.error(__('IMPORT_DATA_NOT_AVAILABLE_FOR_LITE_VERSION'));
    };

    return (
        <Button
            onClick={handleClick}
            icon={PublishIcon}
            title={__('IMPORT_SEAT_PLAN')}
        />
    )
}

export default ImportDataButton