import { AddBox } from "@mui/icons-material";
import { useEditorGridEnabled, useEditorGridGap } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import { GRID_GAP_VALUES, getNextInList } from "@src/admin/Product/SeatPlanner/components/Editor/grid";
import Button from "../Button/Button";

const GridSizeIncreaseButton = () => {
    const { gridEnabled } = useEditorGridEnabled();
    const { setGridGap } = useEditorGridGap();
    const title = `${__('INCREASE_GRID_SIZE')} (])`;

    return (
        <Button
            disabled={!gridEnabled}
            title={title}
            onClick={() => setGridGap(prev => getNextInList(GRID_GAP_VALUES, prev))}
            icon={AddBox}
        />
    );
};

export default GridSizeIncreaseButton;


