import { __ } from "@src/utils";
import toast from "react-hot-toast";

export const useExportToCsv = () => {

    const handleClick = () => {
        toast.error(__('EXPORT_DATA_NOT_AVAILABLE_FOR_LITE_VERSION'));
    };

    return {
        handleClick
    }
}