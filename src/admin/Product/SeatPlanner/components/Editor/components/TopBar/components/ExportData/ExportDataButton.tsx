import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { __ } from "@src/utils";
import Button from "../Button/Button";
import toast from 'react-hot-toast';

const ExportDataButton = () => {

    const handleExportData = () => {
        toast.error(__('EXPORT_SEAT_DATA_NOT_SUPPORTED'));
    }

    return (
        <Button
            onClick={handleExportData}
            icon={FileDownloadIcon}
            title={__('EXPORT_SEAT_DATA')}
        />
    )
}

export default ExportDataButton