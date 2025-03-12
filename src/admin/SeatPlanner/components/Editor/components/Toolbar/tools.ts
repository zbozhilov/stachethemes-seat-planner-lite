import { CropSquare, EventSeat, TextFields } from "@mui/icons-material";
import { ToolItemProps } from "./components/ToolItem/types";
import PanoramaHorizontalIcon from '@mui/icons-material/PanoramaHorizontal';
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