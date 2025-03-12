import { useWorkflowObject } from '../hooks';
import './Screen.scss';
import { ScreenObjectProps } from './types';

const Screen = (props: ScreenObjectProps) => {

    const workflowObjectProps = useWorkflowObject(props, 'stsp-screen');
    const { style, ...rest } = workflowObjectProps;
    const { backgroundColor, ...restStyle } = style;

    return (
        <div {...rest} style={restStyle}>
            <div className='stsp-screen-label'>{props.label}</div>
            <div className='stsp-screen-persepective'>
                <div className='stsp-screen-vis' style={{
                    backgroundColor
                }}>
                </div>
            </div>
        </div>
    );
}

export default Screen;