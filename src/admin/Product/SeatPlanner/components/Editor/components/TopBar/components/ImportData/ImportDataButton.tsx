import PublishIcon from '@mui/icons-material/Publish';
import { __ } from "@src/utils";
import toast from "react-hot-toast";
import Button from "../Button/Button";

const ImportDataButton = () => {

    const handleClick = () => {
        toast.error(__('IMPORT_SEAT_PLAN_NOT_SUPPORTED_IN_LITE'));
    };

    return (
        <Button onClick={handleClick} icon={PublishIcon} title={__('IMPORT_SEAT_PLAN')} />
    );
};

export default ImportDataButton;