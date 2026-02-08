import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { __ } from "@src/utils";
import toast from "react-hot-toast";
import Button from "../Button/Button";

const ExportDataButton = () => {

    const handleClick = () => {
        toast.error(__('EXPORT_SEAT_DATA_NOT_SUPPORTED_IN_LITE'));
    };

    return (
        <Button
            onClick={handleClick}
            icon={FileDownloadIcon}
            title={__('EXPORT_SEAT_DATA')}
        />
    );
};

export default ExportDataButton;