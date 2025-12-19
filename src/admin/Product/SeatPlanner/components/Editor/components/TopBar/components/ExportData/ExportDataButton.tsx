import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { __ } from "@src/utils";
import Button from "../Button/Button";
import { useExportToCsv } from './hooks';

const ExportDataButton = () => {

    const { handleClick } = useExportToCsv();

    return (
        <Button
            onClick={handleClick}
            icon={FileDownloadIcon}
            title={__('EXPORT_SEAT_DATA')}
        />
    )
}

export default ExportDataButton