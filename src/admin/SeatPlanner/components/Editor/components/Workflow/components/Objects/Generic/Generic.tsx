import { useWorkflowObject } from '../hooks';
import './Generic.scss';
import { GenericObjectProps } from './types';

const Generic = (props: GenericObjectProps) => {

    const workflowObjectProps = useWorkflowObject(props, 'stsp-generic');

    return (
        <div {...workflowObjectProps}>{ props.label }</div>
    )
}

export default Generic;