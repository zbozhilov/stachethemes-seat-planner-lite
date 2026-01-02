import { Contrast } from "@mui/icons-material";
import { useEditorGridEnabled, useEditorGridOpacityIndex } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import { GRID_OPACITY_VALUES } from "@src/admin/Product/SeatPlanner/components/Editor/grid";
import Button from "../Button/Button";

const GridContrastButton = () => {
    const { gridEnabled } = useEditorGridEnabled();
    const { setGridOpacityIndex } = useEditorGridOpacityIndex();
    const title = `${__('GRID_CONTRAST')} (H)`;

    return (
        <Button
            disabled={!gridEnabled}
            title={title}
            onClick={() => setGridOpacityIndex(prev => (prev + 1) % GRID_OPACITY_VALUES.length)}
            icon={Contrast}
        />
    );
};

export default GridContrastButton;


