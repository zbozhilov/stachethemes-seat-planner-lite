import { useWorkflowObject } from '../hooks';
import './Screen.scss';
import { ScreenObjectProps } from './types';

const Screen = (props: ScreenObjectProps) => {

    const workflowObjectProps = useWorkflowObject(props, 'stachesepl-screen');
    const { style, ...rest } = workflowObjectProps;
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
        </div>
    );
}

export default Screen;