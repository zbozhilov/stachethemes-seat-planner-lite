import { createContext } from 'react';
import { WorkflowObject } from '../components/Workflow/components/Objects/types';
import { WorkflowProps } from '../components/Workflow/types';

interface EditorContextProps {

    workflowProps: WorkflowProps,
    setWorkflowProps: (props: WorkflowProps | ((prev: WorkflowProps) => WorkflowProps)) => void;

    selectedObjects: number[];
    setSelectedObjects: (objects: number[] | ((prev: number[]) => number[])) => void;

    workflowStates: WorkflowObject[][];
    setWorkflowStates: (states: WorkflowObject[][] | ((prev: WorkflowObject[][]) => WorkflowObject[][])) => void;

    workflowStateIndex: number;
    setWorkflowStateIndex: (index: number | ((prev: number) => number)) => void;

    gridGap: number;
    setGridGap: (gap: number | ((prev: number) => number)) => void;

    seatDisplayLabel: 'label'|'price'|'seatid';
    setSeatDisplayLabel: (label: 'label'|'price'|'seatid' | ((prev: 'label'|'price'|'seatid') => 'label'|'price'|'seatid')) => void;

    editorRef: React.RefObject<HTMLDivElement|null>;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export default EditorContext;