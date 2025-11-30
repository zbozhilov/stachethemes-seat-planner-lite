import { isCtrlKey } from "@src/admin/SeatPlanner/components/utils";
import { useEffect, useRef, useState } from "react";
import { useEditorGridGap, useEditorObjects, useEditorSeatDisplayLabel, useSelectObjects } from "../../hooks";
import { WorkflowObject } from "./components/Objects/types";
import toast from "react-hot-toast";
import { __ } from "@src/utils";

export const useMarquee = (workflowRef: React.RefObject<HTMLDivElement | null>) => {

    const { objects } = useEditorObjects();
    const { setSelectedObjects } = useSelectObjects();

    const marqueeRef = useRef<HTMLDivElement | null>(null);
    const initialPoint = useRef({ x: 0, y: 0 });
    const workflowRectRef = useRef<DOMRect | null>(null);

    useEffect(() => {

        const workflow = workflowRef.current;

        if (!workflow) {
            return;
        }

        const handleInverseSelectionAndSelectAll = (e: KeyboardEvent) => {

            if ((e.target as HTMLElement).tagName === 'INPUT') {
                return;
            }

            const keyValue = e.key.toLowerCase();

            if (isCtrlKey(e) && keyValue === 'i') {
                setSelectedObjects(prev => objects.filter(object => !prev.includes(object.id)).map(object => object.id));
                return;
            }

            if (isCtrlKey(e) && keyValue === 'a') {

                e.preventDefault(); // Prevents select all ( this can become problem )

                setSelectedObjects(objects.map(object => object.id));
            }
        }

        const handleMouseDown = (e: MouseEvent) => {

            if (e.target !== workflow) {
                return;
            }

            /**
             * Obtain the bounding rect of the workflow on mouse down
             * This is done to prevent problems for instance when the browser window is scaled
             */
            workflowRectRef.current = workflow.getBoundingClientRect();

            if (workflowRef?.current?.querySelector('.stachesepl-marquee')) {
                workflowRef?.current?.querySelector('.stachesepl-marquee')?.remove();
            }

            initialPoint.current.x = e.clientX - workflowRectRef.current.left;
            initialPoint.current.y = e.clientY - workflowRectRef.current.top;

            const marqueHtml = document.createElement('div');

            marqueHtml.classList.add('stachesepl-marquee');
            marqueHtml.style.left = `${initialPoint.current.x}px`;
            marqueHtml.style.top = `${initialPoint.current.y}px`;

            marqueeRef.current = workflow.appendChild(marqueHtml);

        };

        const handleMouseMove = (e: MouseEvent) => {

            const marquee = marqueeRef.current;

            if (!marquee || !workflowRectRef.current) {
                return;
            }

            const x = e.clientX - workflowRectRef.current.left;
            const y = e.clientY - workflowRectRef.current.top;

            const width = x - initialPoint.current.x;
            const height = y - initialPoint.current.y;

            marquee.style.width = `${Math.abs(width)}px`;
            marquee.style.height = `${Math.abs(height)}px`;

            marquee.style.left = `${Math.min(x, initialPoint.current.x)}px`;
            marquee.style.top = `${Math.min(y, initialPoint.current.y)}px`;

        }

        const handleMouseUp = (e: MouseEvent) => {

            const marquee = marqueeRef.current;

            if (!marquee || !workflowRectRef.current) {
                return;
            }

            const selectorRect = marquee.getBoundingClientRect();

            const selectorLeft = selectorRect.left - workflowRectRef.current.left;
            const selectorRight = selectorRect.right - workflowRectRef.current.left;
            const selectorTop = selectorRect.top - workflowRectRef.current.top;
            const selectorBottom = selectorRect.bottom - workflowRectRef.current.top;

            const overObjects = objects.filter(object => {

                const objectWidth = object.size.width;
                const objectHeight = object.size.height;
                const objectX = object.move.x;
                const objectY = object.move.y;

                const objectLeft = objectX;
                const objectRight = objectX + objectWidth;
                const objectTop = objectY;
                const objectBottom = objectY + objectHeight;

                const isOver = selectorLeft < objectRight && selectorRight > objectLeft && selectorTop < objectBottom && selectorBottom > objectTop;

                return isOver;

            });

            const isCtrlPressed = isCtrlKey(e);
            const isAltPressed = e.altKey;

            setSelectedObjects(prev => {

                if (isAltPressed) {
                    return prev.filter(id => !overObjects.map(object => object.id).includes(id));
                }

                if (isCtrlPressed) {
                    return [...prev, ...overObjects.map(object => object.id)];
                }

                return overObjects.map(object => object.id);

            });

            marquee.remove();

            marqueeRef.current = null;

        }

        document.addEventListener('keydown', handleInverseSelectionAndSelectAll);
        workflow.addEventListener('mousedown', handleMouseDown);
        workflow.addEventListener('mousemove', handleMouseMove);
        workflow.addEventListener('mouseup', handleMouseUp);

        return () => {

            if (marqueeRef.current) {
                marqueeRef.current.remove();
            }

            document.removeEventListener('keydown', handleInverseSelectionAndSelectAll);
            workflow.removeEventListener('mousedown', handleMouseDown);
            workflow.removeEventListener('mousemove', handleMouseMove);
            workflow.removeEventListener('mouseup', handleMouseUp);
        }

    }, [initialPoint, objects, setSelectedObjects, workflowRef]);
}

export const useGrid = (workflowRef: React.RefObject<HTMLDivElement | null>) => {

    const [enabled, setEnabled] = useState(true);
    const [gridOpacityIndex, setGridOpacityIndex] = useState(0);
    const [gridColorIndex, setGridColorIndex] = useState(1);
    const { gridGap, setGridGap } = useEditorGridGap();

    useEffect(() => {

        const workflow = workflowRef.current;

        if (!workflow) {
            return;
        }

        const opacityValues = [0.1, 0.2, 0.3, 0.4, 0.5];
        const colorValues = ['0,0,0', '255,255,255'];
        const gridGapValues = [5, 10, 25, 50, 75, 100];

        const noModifiers = (e: KeyboardEvent) => !isCtrlKey(e) && !e.altKey && !e.shiftKey;

        const updateGridStyles = () => {

            if (!workflow) {
                return;
            }

            const opacity = opacityValues[gridOpacityIndex];
            const color = colorValues[gridColorIndex];

            workflow.style.backgroundImage = `
                linear-gradient(to right, rgba(${color}, ${opacity}) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(${color}, ${opacity}) 1px, transparent 1px)
            `;
            workflow.style.backgroundSize = `${gridGap}px ${gridGap}px, ${gridGap}px ${gridGap}px`;
            workflow.style.backgroundPosition = `0 0, 0 0`;

        };

        const handleKeyDown = (e: KeyboardEvent) => {

            if ((e.target as HTMLElement).tagName === 'INPUT') {
                return;
            }

            if (noModifiers(e)) {

                switch (e.key.toLowerCase()) {

                    case ']': {
                        setGridGap(prev => gridGapValues[gridGapValues.indexOf(prev) + 1] || prev);
                        return;
                    }

                    case '[': {
                        setGridGap(prev => gridGapValues[gridGapValues.indexOf(prev) - 1] || prev);
                        return;
                    }

                    case 'h':
                        setGridOpacityIndex(prev => (prev + 1) % opacityValues.length);
                        break;
                    case 'c':
                        setGridColorIndex(prev => (prev + 1) % colorValues.length);
                        break;
                    case 'g':
                        setEnabled(prev => !prev);
                        break;
                }
            }
        };

        if (enabled) {
            updateGridStyles();
        } else if (workflow) {
            workflow.style.backgroundImage = '';
            workflow.style.backgroundSize = '';
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            if (workflow) {
                workflow.style.backgroundImage = '';
                workflow.style.backgroundSize = '';
            }
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [workflowRef, gridGap, enabled, gridOpacityIndex, gridColorIndex, setGridGap]);
};

export const useToggleSeatLabelDisplay = () => {

    const { setSeatDisplayLabel } = useEditorSeatDisplayLabel();

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {

            if ((e.target as HTMLElement).tagName === 'INPUT') {
                return;
            }

            if (e.key.toLowerCase() === 'l') {
                setSeatDisplayLabel(prev => {

                    switch (prev) {
                        case 'seatid':
                            return 'price';
                        case 'price':
                            return 'group';
                        case 'group':
                            return 'status';
                        case 'status':
                            return 'label';
                        default:
                            return 'seatid';
                    }
                });
            }

        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }

    }, [setSeatDisplayLabel]);

}

export const useCopyPaste = () => {

    const { objects, setObjects } = useEditorObjects();
    const { selectedObjects, setSelectedObjects } = useSelectObjects();
    const disable = useRef(false); // Prevents spamming of copy and paste
    const copiedObjects = useRef<WorkflowObject[]>([]);

    useEffect(() => {

        const clearDisable = () => {
            disable.current = false;
        }

        const handleCopy = (e: KeyboardEvent) => {

            if (!selectedObjects.length || !isCtrlKey(e) || e.key.toLowerCase() !== 'c') {
                return;
            }

            if (disable.current) {
                return;
            }

            if ((e.target as HTMLElement).tagName === 'INPUT') {
                return;
            }

            copiedObjects.current = objects.filter(object => selectedObjects.includes(object.id));

            toast.success(__('OBJECTS_COPIED'));

            disable.current = true;

        }

        const handlePaste = (e: KeyboardEvent) => {

            if (!isCtrlKey(e) || e.key.toLowerCase() !== 'v') {
                return;
            }

            if (disable.current) {
                return;
            }

            if ((e.target as HTMLElement).tagName === 'INPUT') {
                return;
            }

            let id = objects.reduce((acc, object) => object.id > acc ? object.id : acc, 0) + 1;

            const newObjects = copiedObjects.current.map(object => {

                const newObject = { ...object, id: id++ }

                return newObject;

            });

            setObjects(prev => [...prev, ...newObjects]);

            setSelectedObjects(newObjects.map(object => object.id));

            toast.success(__('OBJECTS_PASTED'));

            disable.current = true;

        }

        document.addEventListener('keyup', clearDisable);
        document.addEventListener('keydown', handleCopy);
        document.addEventListener('keydown', handlePaste);


        return () => {
            document.removeEventListener('keyup', clearDisable);
            document.removeEventListener('keydown', handleCopy);
            document.removeEventListener('keydown', handlePaste);
        }


    }, [objects, selectedObjects, setObjects, setSelectedObjects]);

}

export const useDeleteAndEscapeKey = () => {

    const { setObjects } = useEditorObjects();
    const { selectedObjects, setSelectedObjects } = useSelectObjects();

    useEffect(() => {

        const noModifiers = (e: KeyboardEvent) => !isCtrlKey(e) && !e.altKey && !e.shiftKey;

        const handleDeleteAndEscape = (e: KeyboardEvent) => {

            if (!selectedObjects.length || !noModifiers(e)) {
                return;
            }

            if ((e.target as HTMLElement).tagName === 'INPUT') {
                return;
            }

            switch (e.key) {
                case 'Backspace':
                case 'Delete': {
                    setObjects(prev => prev.filter(object => !selectedObjects.includes(object.id)));
                    setSelectedObjects([]);
                    break;
                }

                case 'Escape': {
                    setSelectedObjects([]);
                    break;
                }
            }

        }

        document.addEventListener('keydown', handleDeleteAndEscape);

        return () => {
            document.removeEventListener('keydown', handleDeleteAndEscape);
        }


    }, [selectedObjects, setObjects, setSelectedObjects]);

}

export const useHistory = () => {

    const { redo, undo } = useEditorObjects();

    useEffect(() => {

        const handleUndo = (e: KeyboardEvent) => {
            if (isCtrlKey(e) && e.code === 'KeyZ') {
                e.preventDefault();
                undo();
            }
        }

        const handleRedo = (e: KeyboardEvent) => {
            if (isCtrlKey(e) && e.code === 'KeyY') {
                e.preventDefault();
                redo();
            }
        }

        document.addEventListener('keydown', handleUndo);
        document.addEventListener('keydown', handleRedo);

        return () => {
            document.removeEventListener('keydown', handleUndo);
            document.removeEventListener('keydown', handleRedo);
        }

    }, [redo, undo]);

}