import { IndeterminateCheckBox } from "@mui/icons-material";
import { useEditorGridEnabled, useEditorGridGap } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import { GRID_GAP_VALUES, getPrevInList } from "@src/admin/Product/SeatPlanner/components/Editor/grid";

const GridSizeDecreaseButton = () => {
    const { gridEnabled } = useEditorGridEnabled();
    const { setGridGap } = useEditorGridGap();
    const title = `${__('DECREASE_GRID_SIZE')} ([)`;

    return (
        <div
            className={`stachesepl-top-button ${!gridEnabled && 'disabled'}`}
            title={title}
            onClick={() => setGridGap(prev => getPrevInList(GRID_GAP_VALUES, prev))}
        >
            <IndeterminateCheckBox />
        </div>
    );
};

export default GridSizeDecreaseButton;


