import { FormatColorFill } from "@mui/icons-material";
import { GRID_COLOR_VALUES } from "@src/admin/Product/SeatPlanner/components/Editor/grid";
import { useEditorGridColorIndex, useEditorGridEnabled } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import Button from "../Button/Button";

const GridColorButton = () => {
    const { gridEnabled } = useEditorGridEnabled();
    const { setGridColorIndex } = useEditorGridColorIndex();
    const title = `${__('GRID_COLOR')} (C)`;

    return (
        <Button
            disabled={!gridEnabled}
            title={title}
            onClick={() => setGridColorIndex(prev => (prev + 1) % GRID_COLOR_VALUES.length)}
            icon={FormatColorFill}
        />
    );
};

export default GridColorButton;


