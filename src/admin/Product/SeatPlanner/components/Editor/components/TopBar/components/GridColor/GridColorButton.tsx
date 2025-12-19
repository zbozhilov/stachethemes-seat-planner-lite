import { FormatColorFill } from "@mui/icons-material";
import { useEditorGridColorIndex, useEditorGridEnabled } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import { GRID_COLOR_VALUES } from "@src/admin/Product/SeatPlanner/components/Editor/grid";

const GridColorButton = () => {
    const { gridEnabled } = useEditorGridEnabled();
    const { setGridColorIndex } = useEditorGridColorIndex();
    const title = `${__('GRID_COLOR')} (C)`;

    return (
        <div
            className={`stachesepl-top-button ${!gridEnabled && 'disabled'}`}
            title={title}
            onClick={() => setGridColorIndex(prev => (prev + 1) % GRID_COLOR_VALUES.length)}
        >
            <FormatColorFill />
        </div>
    );
};

export default GridColorButton;


