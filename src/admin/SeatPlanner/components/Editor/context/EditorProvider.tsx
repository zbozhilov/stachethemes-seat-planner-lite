import { useState } from "react";
import EditorContext from "./EditorContext";
import { WorkflowObject } from "../components/Workflow/components/Objects/types";
import { WorkflowProps } from "../components/Workflow/types";
import { workflowProperties } from "../components/Workflow/properties";

const EditorProvider = ({
    children,
    editorRef
}: {
    children: React.ReactNode;
    editorRef: React.RefObject<HTMLDivElement|null>; 
}) => {

    const [workflowProps, setWorkflowProps] = useState<WorkflowProps>(workflowProperties);
    const [selectedObjects, setSelectedObjects] = useState<number[]>([]);
    const [workflowStates, setWorkflowStates] = useState<WorkflowObject[][]>([[]]);
    const [workflowStateIndex, setWorkflowStateIndex] = useState<number>(0);
    const [gridGap, setGridGap] = useState<number>(25);
    const [seatDisplayLabel, setSeatDisplayLabel] = useState<'label'|'price'|'seatid' | 'group' | 'status'>('label');

    return (
        <EditorContext.Provider value={{

            workflowProps,
            setWorkflowProps,

            selectedObjects,
            setSelectedObjects,
            
            workflowStates,
            setWorkflowStates,

            workflowStateIndex,
            setWorkflowStateIndex,

            gridGap,
            setGridGap,

            seatDisplayLabel,
            setSeatDisplayLabel,

            editorRef
        }}>
            {children}
        </EditorContext.Provider>
    );
};

export default EditorProvider;
