import { useRef } from "react";
import { useDraggableToolItem } from "./hooks";
import './ToolItem.scss';
import { ToolItemProps } from "./types";
import { SvgIcon } from "@mui/material";

const ToolItem = (props: ToolItemProps) => {

    const itemRef = useRef<HTMLDivElement|null>(null);
    const { creates } = props;

    useDraggableToolItem({
        itemRef,
        creates
    });

    return (
        <div className='stachesepl-toolbar-item' ref={itemRef}>
            <div className='stachesepl-toolbar-item-icon'>
                <SvgIcon component={props.icon} />
            </div>
            <div className='stachesepl-toolbar-item-label'>
                {props.label}
            </div>
        </div>
    )
}

export default ToolItem