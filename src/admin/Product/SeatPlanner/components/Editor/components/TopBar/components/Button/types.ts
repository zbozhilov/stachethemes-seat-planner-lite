
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface ButtonProps {
    title?: string
    icon: OverridableComponent<SvgIconTypeMap> & { muiName: string }
    onClick: () => void
}