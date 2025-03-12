import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ObjectTypes } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { SvgIconTypeMap } from "@mui/material";

export interface ToolItemProps {
    id: string
    label: string
    icon: OverridableComponent<SvgIconTypeMap> & { muiName: string }
    creates: ObjectTypes
}