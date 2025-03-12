import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { __ } from "@src/utils";
import toast from 'react-hot-toast';
import Button from "../Button/Button";

const ExportDataButton = () => {

    return (
        <div style={{
            opacity: 0.5,
        }}>
            <Button
                onClick={() => {
                    toast.error(__('EXPORT_DATA_DISABLED'));
                }}
                icon={FileDownloadIcon}
                title={__('EXPORT_SEAT_DATA')}
            />
        </div>
    )
}

export default ExportDataButton