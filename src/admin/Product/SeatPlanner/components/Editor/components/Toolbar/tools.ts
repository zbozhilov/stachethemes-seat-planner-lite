import { CropSquare, EventSeat, TextFields } from "@mui/icons-material";
import { ToolItemProps } from "./components/ToolItem/types";
import PanoramaHorizontalIcon from '@mui/icons-material/PanoramaHorizontal';
import TableRows from '@mui/icons-material/TableRows';
import { __ } from '@src/utils';

export const tools: ToolItemProps[] = [
    {
        id: 'screen',
        label: __('SCREEN'),
        icon: PanoramaHorizontalIcon,
        creates: 'screen'
    },
    {
        id: 'seat',
        label: __('SEAT'),
        icon: EventSeat,
        creates: 'seat'
    },
    // @todo Not Implement yet
    // {
    //     id: 'seat-row',
    //     label: __('SEAT_ROW'),
    //     icon: TableRows,
    //     creates: 'seat-row'
    // },
    {
        id: 'generic',
        label: __('GENERIC_OBJECT'),
        icon: CropSquare,
        creates: 'generic'
    },
    {
        id: 'text',
        label: __('TEXT'),
        icon: TextFields,
        creates: 'text'
    },
]