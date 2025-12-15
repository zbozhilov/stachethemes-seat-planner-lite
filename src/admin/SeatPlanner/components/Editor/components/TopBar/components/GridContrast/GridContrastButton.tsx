import { Contrast } from "@mui/icons-material";
import { useEditorGridEnabled, useEditorGridOpacityIndex } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import { GRID_OPACITY_VALUES } from "@src/admin/SeatPlanner/components/Editor/grid";

const GridContrastButton = () => {
    const { gridEnabled } = useEditorGridEnabled();
    const { setGridOpacityIndex } = useEditorGridOpacityIndex();
    const title = `${__('GRID_CONTRAST')} (H)`;

    return (
        <div
            className={`stachesepl-top-button ${!gridEnabled && 'disabled'}`}
            title={title}
            onClick={() => setGridOpacityIndex(prev => (prev + 1) % GRID_OPACITY_VALUES.length)}
        >
            <Contrast />
        </div>
    );
};

export default GridContrastButton;


