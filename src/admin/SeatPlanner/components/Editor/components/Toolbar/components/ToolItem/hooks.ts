import { genericProperties } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/properties";
import { screenProperties } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Screen/properties";
import { seatProperties } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/properties";
import { textProperties } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Text/properties";
import { ObjectTypes, WorkflowObject } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorGridGap, useEditorObjects, useEditorRef, useSelectObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { useEffect, useRef } from "react";

export const useDraggableToolItem = ({
    itemRef,
    creates,
}: {
    itemRef: React.RefObject<HTMLDivElement|null>,
    creates: ObjectTypes
}) => {

    const editorRef = useEditorRef();
    const cloneRef = useRef<HTMLDivElement | null>(null);
    const { objects, setObjects } = useEditorObjects();
    const { setSelectedObjects } = useSelectObjects();
    const { gridGap } = useEditorGridGap();

    const getObjectProperties = () => {

        switch (creates) {

            case 'seat':
                return seatProperties;

            case 'generic':
                return genericProperties;

            case 'screen':
                return screenProperties;

            case 'text':
                return textProperties;

            default: {
                return genericProperties;
            }

        }

    }

    const objectProperties = getObjectProperties();

    useEffect(() => {

        const editor = editorRef?.current;
        const item = itemRef.current;

        if (!editor || !item) {
            return
        };

        const getSnappedXYPosition = (x: number, y: number) => {

            return {
                x: Math.round(x / gridGap) * gridGap,
                y: Math.round(y / gridGap) * gridGap
            }
        }

        const createObjectAtPosition = ({ x, y }: {
            x: number, y: number
        }) => {

            const id = objects.reduce((acc, object) => object.id > acc ? object.id : acc, 0) + 1;

            const objectWidthHalf = objectProperties.size.width / 2;
            const objectHeightHalf = objectProperties.size.height / 2;

            const xy = getSnappedXYPosition(x - (objectWidthHalf), y - (objectHeightHalf));

            const newObject: WorkflowObject = {
                ...objectProperties,
                id: id,
                move: xy,
            }

            setObjects([...objects, newObject]);

            setSelectedObjects([newObject.id]);

        }

        const isCloneOverWorkflow = (cloneRect: DOMRect) => {

            const workflow = editor.querySelector('.stsp-workflow');

            if (!workflow) {
                return false;
            }

            const workflowRect = workflow.getBoundingClientRect();

            const cloneCenterX = (cloneRect.left + cloneRect.right) / 2;
            const cloneCenterY = (cloneRect.top + cloneRect.bottom) / 2;

            const isCloneInsideWorkflow =
                cloneCenterX > workflowRect.left &&
                cloneCenterX < workflowRect.right &&
                cloneCenterY > workflowRect.top &&
                cloneCenterY < workflowRect.bottom;

            return isCloneInsideWorkflow;
        }

        const handleMouseDown = (e: MouseEvent) => {

            const clone = item.cloneNode(true) as HTMLDivElement;

            clone.style.position = 'absolute';
            clone.classList.add('stsp-toolbar-item-dragging');
            clone.style.width = item.offsetWidth + 'px';
            clone.style.height = item.offsetHeight + 'px';
            clone.style.left = e.clientX - item.offsetWidth / 2 + 'px';
            clone.style.top = e.clientY - item.offsetHeight / 2 + 'px';
            clone.style.zIndex = '1000';

            cloneRef.current = editor.appendChild(clone) as HTMLDivElement;

        }

        const handleMouseMove = (e: MouseEvent) => {

            if (!cloneRef.current) {
                return;
            }

            cloneRef.current.style.left = e.clientX - cloneRef.current.offsetWidth / 2 + 'px';
            cloneRef.current.style.top = e.clientY - cloneRef.current.offsetHeight / 2 + 'px';

        }

        const handleMouseUp = (e: MouseEvent) => {

            if (!cloneRef.current || !editor) {
                return;
            }

            const workflow = editor.querySelector('.stsp-workflow');

            if (!workflow) {
                return;
            }

            const cloneRect = cloneRef.current.getBoundingClientRect();

            const isOverWorkflow = isCloneOverWorkflow(cloneRect);

            if (isOverWorkflow) {

                const workflowRect = workflow.getBoundingClientRect();

                const posX = e.clientX - workflowRect.left;
                const posY = e.clientY - workflowRect.top;

                createObjectAtPosition({
                    x: posX,
                    y: posY
                });
            }

            cloneRef.current.remove();
            cloneRef.current = null;

        }

        item.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            item.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

    }, [creates, editorRef, gridGap, itemRef, objectProperties, objects, setObjects, setSelectedObjects]);

}