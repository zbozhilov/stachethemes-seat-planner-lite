import { useResizableWorkflowObject } from '../hooks';
import './Generic.scss';
import { GenericObjectProps } from './types';

const Generic = (props: GenericObjectProps) => {

    const { combinedProps, isResizing, resizeDimensions, handleResizeStart } = useResizableWorkflowObject(props, 'stachesepl-generic');

    return (
        <div {...combinedProps}>
            {props.label}
            
            {/* Resize handle */}
            <div 
                className='stachesepl-object-resize-handle'
                onMouseDown={handleResizeStart}
            />
            
            {/* Resize dimensions tooltip */}
            {isResizing && resizeDimensions && (
                <div className='stachesepl-object-resize-tooltip' style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed' }}>
                    {Math.round(resizeDimensions.width)} × {Math.round(resizeDimensions.height)}
                </div>
            )}
        </div>
    )
}

export default Generic;