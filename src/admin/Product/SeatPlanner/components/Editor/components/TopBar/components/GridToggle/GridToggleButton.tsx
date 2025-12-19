import { GridOff, GridOn } from "@mui/icons-material";
import { useEditorGridEnabled } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";

const GridToggleButton = () => {
    const { gridEnabled, setGridEnabled } = useEditorGridEnabled();

    const Icon = gridEnabled ? GridOn : GridOff;
    const title = `${__('TOGGLE_GRID')} (G)`;

    return (
        <div
            className='stachesepl-top-button'
            title={title}
            onClick={() => setGridEnabled(prev => !prev)}
        >
            <Icon />
        </div>
    );
};

export default GridToggleButton;


