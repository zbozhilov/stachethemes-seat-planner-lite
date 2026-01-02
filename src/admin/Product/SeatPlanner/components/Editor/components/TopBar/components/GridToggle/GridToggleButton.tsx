import { GridOff, GridOn } from "@mui/icons-material";
import { useEditorGridEnabled } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import Button from "../Button/Button";

const GridToggleButton = () => {
    const { gridEnabled, setGridEnabled } = useEditorGridEnabled();

    const Icon = gridEnabled ? GridOn : GridOff;
    const title = `${__('TOGGLE_GRID')} (G)`;

    return (
        <Button
            title={title}
            onClick={() => setGridEnabled(prev => !prev)}
            icon={Icon}
        />
    );
};

export default GridToggleButton;


