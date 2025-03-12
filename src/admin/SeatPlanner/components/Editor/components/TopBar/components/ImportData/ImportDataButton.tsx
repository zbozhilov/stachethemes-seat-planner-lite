import PublishIcon from '@mui/icons-material/Publish';
import { __ } from "@src/utils";
import Button from "../Button/Button";
import toast from 'react-hot-toast';

const ImportDataButton = () => {

    return (
        <div style={{
            opacity: 0.5,
        }}>
            <Button onClick={() => {
                toast.error(__('IMPORT_DATA_DISABLED'));
            }} icon={PublishIcon} title={__('IMPORT_SEAT_PLAN')} />
        </div>
    )
}

export default ImportDataButton