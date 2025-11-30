import { isEqual } from "lodash";
import { useContext, useMemo } from "react";
import EditorContext from "./context/EditorContext";
import { WorkflowObject } from "./components/Workflow/components/Objects/types";

const useEditorContext = () => {

    const context = useContext(EditorContext);

    if (!context) {
        throw new Error('useEditorObjects must be used within a <EditorProvider>');
    }

    return context;
}

export const useEditorRef = () => {
    const context = useEditorContext();
    return context.editorRef;
}

export const useWorkflowProps = () => {
    const context = useEditorContext();
  
    return {
        workflowProps: context.workflowProps,
        setWorkflowProps: context.setWorkflowProps,
    }
}

export const useEditorObjects = () => {

    const context = useEditorContext();

    const maxHistoryStates = 20;

    const {
        workflowStates: states,
        setWorkflowStates: setStates,
        workflowStateIndex: index,
        setWorkflowStateIndex: setIndex
    } = context;

    const objects = useMemo(() => states[index], [states, index]);

    const setObjects = (valueOrUpdater: WorkflowObject[] | ((prev: WorkflowObject[]) => WorkflowObject[])) => {

        const theNewObjects = typeof valueOrUpdater === "function"
            ? (valueOrUpdater as (prev: WorkflowObject[]) => WorkflowObject[])(objects)
            : valueOrUpdater;

        const maxAllowedObjects = 100;

        if (theNewObjects.length > maxAllowedObjects) {
            return;
        }

        if (isEqual(objects, theNewObjects)) {
            return;
        }

        const aNewState = [...states.slice(0, index + 1), theNewObjects].slice(-maxHistoryStates);

        setStates(aNewState);
        setIndex(aNewState.length - 1);
    };

    const resetState = (initialWorkflowState: WorkflowObject[]) => {
        setStates([initialWorkflowState]);
        setIndex(0);
    };

    const goBack = () => {
        setIndex(index => Math.max(0, index - 1));

    };

    const goForward = () => {
        setIndex(index => Math.min(states.length - 1, index + 1));
    };

    const getSeatsWithDuplicateSeatIds = () => {
        const seats = objects.filter(object => object.type === 'seat');
        const seatIds = seats.filter(seat => seat.seatId !== '').map(seat => seat.seatId);
        const duplicateSeatIds = seatIds.filter((seatId, index) => seatIds.indexOf(seatId) !== index);
        return duplicateSeatIds;
    }

    return {
        objects,
        setObjects,
        resetState,
        getSeatsWithDuplicateSeatIds,
        index,
        undo: goBack,
        redo: goForward,
    };

}

export const useSelectObjects = () => {

    const context = useEditorContext();
    const { selectedObjects, setSelectedObjects } = context;
    const getIsSelected = (id: number) => selectedObjects.includes(id);

    const setUniqueSelectedObjects = (
        updater: number[] | ((prevIds: number[]) => number[])
    ) => {
        setSelectedObjects((prevIds) => {
            const newIds =
                typeof updater === "function" ? updater(prevIds) : updater;
            return [...new Set(newIds)]; 
        });
    };

    return { selectedObjects, getIsSelected, setSelectedObjects: setUniqueSelectedObjects };
}

export const useEditorGridGap = () => {

    const context = useEditorContext();

    return {
        gridGap: context.gridGap,
        setGridGap: context.setGridGap,
    }

}

export const useEditorSeatDisplayLabel = () => {

    const context = useEditorContext();

    return {
        seatDisplayLabel: context.seatDisplayLabel,
        setSeatDisplayLabel: context.setSeatDisplayLabel,
    }

}
