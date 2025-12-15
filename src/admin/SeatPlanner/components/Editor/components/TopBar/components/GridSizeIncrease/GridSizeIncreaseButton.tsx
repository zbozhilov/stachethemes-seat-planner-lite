import { AddBox } from "@mui/icons-material";
import { useEditorGridEnabled, useEditorGridGap } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import { GRID_GAP_VALUES, getNextInList } from "@src/admin/SeatPlanner/components/Editor/grid";

const GridSizeIncreaseButton = () => {
    const { gridEnabled } = useEditorGridEnabled();
    const { setGridGap } = useEditorGridGap();
    const title = `${__('INCREASE_GRID_SIZE')} (])`;

    return (
        <div
            className={`stachesepl-top-button ${!gridEnabled && 'disabled'}`}
            title={title}
            onClick={() => setGridGap(prev => getNextInList(GRID_GAP_VALUES, prev))}
        >
            <AddBox />
        </div>
    );
};

export default GridSizeIncreaseButton;


