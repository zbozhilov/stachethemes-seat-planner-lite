import { useResizableWorkflowObject } from '../hooks';
import './Screen.scss';
import { ScreenObjectProps } from './types';

const Screen = (props: ScreenObjectProps) => {

    const { combinedProps, isResizing, resizeDimensions, handleResizeStart } = useResizableWorkflowObject(props, 'stachesepl-screen');
    const { style, ...rest } = combinedProps;
    const { backgroundColor, ...restStyle } = style;

    return (
        <div {...rest} style={restStyle}>
            <div className='stachesepl-screen-label'>{props.label}</div>
            <div className='stachesepl-screen-persepective'>
                <div className='stachesepl-screen-vis' style={{
                    backgroundColor
                }}>
                </div>
            </div>
            
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
    );
}

export default Screen;