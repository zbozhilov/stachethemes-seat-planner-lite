import { useWorkflowObject } from '../hooks';
import './Text.scss';
import { TextObjectProps } from './types';

const Text = (props: TextObjectProps) => {

    const workflowObjectProps = useWorkflowObject(props, 'stsp-text');

    return (
        <div {...workflowObjectProps}>{props.label}</div>
    )
}

export default Text;