import { useWorkflowProps } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';
import './PropertiesContent.scss';

/**
 * This is the .stachesepl-tooltip-properties-content container that holds the content of the properties.
 * It is a scrollable container that will adjust its height based on the height of the workflow.
 */
const PropertiesContent = (props: {
    children: React.ReactNode
}) => {

    const { workflowProps: { height } } = useWorkflowProps();

    const style: React.CSSProperties = {
        maxHeight: `min(calc(${height}px - 86px), calc(100dvh - 135px))`
    }

    return (
        <>
            <div className="stachesepl-tooltip-properties-content" style={style}>
                {props.children}
            </div>
        </>
    )
}

export default PropertiesContent