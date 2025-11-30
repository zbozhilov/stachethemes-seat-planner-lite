import { useEditorGridGap, useEditorObjects, useSelectObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { isCtrlKey } from "@src/admin/SeatPlanner/components/utils";
import { useEffect, useRef, useState } from "react";
import { hasBackgroundColor, isRounded, WorkflowObject } from "./types";
import { getFontSizeByType } from "./helpers";

export const useDraggable = (
    elementRef: React.RefObject<HTMLDivElement | null>
) => {

    const { setObjects } = useEditorObjects();
    const { selectedObjects } = useSelectObjects();

    const [isDragging, setIsDragging] = useState(false);
    const initialElementPos = useRef({ x: 0, y: 0 });
    const initialSiblingsPos = useRef<{ x: number; y: number }[]>([]);
    const selectedSiblings = useRef<HTMLElement[] | null>(null);
    const { gridGap } = useEditorGridGap();

    const getSelectedSiblings = (element: HTMLElement) => {
        const parentContainer = element.parentElement;
        if (!parentContainer) return [];

        const siblings = Array.from(parentContainer.children).filter(
            (sibling) => sibling !== element && sibling.classList.contains('stachesepl-movable')
        ) as HTMLElement[];

        return siblings.filter((sibling) =>
            sibling.classList.contains('selected')
        );
    };

    useEffect(() => {

        const element = elementRef.current;

        if (!element || !isDragging) {
            initialSiblingsPos.current = [];
            selectedSiblings.current = null;
            return;
        }

        initialElementPos.current = {
            x: parseInt(element.style.left || "0", 10),
            y: parseInt(element.style.top || "0", 10),
        };

        const siblings = getSelectedSiblings(element);

        if (siblings.length === 0) {
            selectedSiblings.current = null;
            initialSiblingsPos.current = [];
            return;
        }

        initialSiblingsPos.current = siblings.map((sibling) => ({
            x: parseInt(sibling.style.left || "0", 10),
            y: parseInt(sibling.style.top || "0", 10),
        }));

        selectedSiblings.current = siblings;

    }, [elementRef, isDragging, selectedObjects]);

    useEffect(() => {

        const element = elementRef.current;

        if (!element) {
            return;
        }

        const parentContainer = element.parentElement as HTMLElement;

        const getClampedPosition = (x: number, y: number) => {

            const allSelectedElements = [element, ...(selectedSiblings.current || [])];
            const containerRect = parentContainer.getBoundingClientRect();

            // Calculate the bounding box for the element and its siblings relative to the container
            const combinedRect = allSelectedElements.reduce(
                (acc, el) => {
                    const elRect = el.getBoundingClientRect();
                    return {
                        left: Math.min(acc.left, elRect.left - containerRect.left),
                        top: Math.min(acc.top, elRect.top - containerRect.top),
                        right: Math.max(acc.right, elRect.right - containerRect.left),
                        bottom: Math.max(acc.bottom, elRect.bottom - containerRect.top),
                    };
                },
                { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
            );

            // Mouse position adjusted relative to the container
            const relativeX = x - element.offsetWidth / 2 - containerRect.left;
            const relativeY = y - element.offsetHeight / 2 - containerRect.top;

            // Calc the offset from the combined bounding box to the element
            const elementBoundBox = element.getBoundingClientRect();
            const offsetX = combinedRect.left - elementBoundBox.left + containerRect.left
            const offsetY = combinedRect.top - elementBoundBox.top + containerRect.top

            // Clamping based on the combined bounding box of selected elements
            const clampedX = Math.max(
                -1 * offsetX,
                Math.min(
                    relativeX,
                    containerRect.width - (combinedRect.right - combinedRect.left) - offsetX
                )
            );

            const clampedY = Math.max(
                -1 * offsetY,
                Math.min(
                    relativeY,
                    containerRect.height - (combinedRect.bottom - combinedRect.top) - offsetY
                )
            );

            // Snap to grid
            return {
                x: Math.max(Math.abs(offsetX), clampedX - (clampedX % gridGap)),
                y: Math.max(Math.abs(offsetY), clampedY - (clampedY % gridGap)),
            };
        };

        const handleDragStart = (e: MouseEvent) => {

            if (isCtrlKey(e) || e.altKey) {
                return
            };

            setIsDragging(true);
        };

        const handleDragMove = (e: MouseEvent) => {

            if (!isDragging || !element) {
                return;
            }

            const { x, y } = getClampedPosition(e.clientX, e.clientY);

            const deltaX = initialElementPos.current.x - x;
            const deltaY = initialElementPos.current.y - y;

            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            // Move selected siblings
            selectedSiblings.current?.forEach((sibling, index) => {
                const { x: siblingX, y: siblingY } = initialSiblingsPos.current[index];
                sibling.style.left = `${siblingX - deltaX}px`;
                sibling.style.top = `${siblingY - deltaY}px`;
            });
        };

        const handleDragEnd = () => {

            if (!isDragging || !element) {
                return;
            }

            setIsDragging(false);

            setObjects(objects =>
                objects.map((object) =>
                    selectedObjects.includes(object.id)
                        ? {
                            ...object,
                            move: {
                                x:
                                    object.move.x +
                                    parseInt(element.style.left || "0", 10) -
                                    initialElementPos.current.x,
                                y:
                                    object.move.y +
                                    parseInt(element.style.top || "0", 10) -
                                    initialElementPos.current.y,
                            },
                        }
                        : object
                )
            );
        };

        parentContainer.addEventListener("mousemove", handleDragMove);
        element.addEventListener("mousedown", handleDragStart);
        document.addEventListener("mouseup", handleDragEnd);

        return () => {
            parentContainer.removeEventListener("mousemove", handleDragMove);
            element.removeEventListener("mousedown", handleDragStart);
            document.removeEventListener("mouseup", handleDragEnd);
        };
    }, [elementRef, gridGap, isDragging, selectedObjects, setObjects]);

    return {
        className: 'stachesepl-movable',
    }

};

export const useSelectable = (id: number) => {

    const initialPos = useRef({ x: 0, y: 0 });
    const { getIsSelected, setSelectedObjects } = useSelectObjects();
    const isSelected = getIsSelected(id);

    const handleMouseDown = (event: React.MouseEvent) => {

        initialPos.current = {
            x: event.clientX,
            y: event.clientY
        }

        setSelectedObjects((selectedObjects) => {

            const isCtrlPressed = event.ctrlKey;

            if (isSelected) {

                if (!isCtrlPressed) {

                    return selectedObjects;
                }

                return isCtrlPressed ? selectedObjects.filter(objectId => objectId !== id) : [];
            }

            return isCtrlPressed ? [...selectedObjects, id] : [id];
        });
    };

    const handleMouseUp = (event: React.MouseEvent) => {

        const finalPos = {
            x: event.clientX,
            y: event.clientY
        }

        const wasMoved = finalPos.x !== initialPos.current.x || finalPos.y !== initialPos.current.y;

        if (wasMoved) {
            return;
        }

        setSelectedObjects((selectedObjects) => {

            const isCtrlPressed = event.ctrlKey;

            if (!isSelected || isCtrlPressed || selectedObjects.length === 1) {
                return selectedObjects;
            }

            return [id];

        });

    }

    return {
        className: isSelected ? 'stachesepl-selectable selected' : 'stachesepl-selectable',
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp
    }
}

export const useWorkflowObject = (
    objectProps: WorkflowObject,
    className: string,
) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const draggableProps = useDraggable(elementRef);
    const selectableProps = useSelectable(objectProps.id);

    const fontSize = getFontSizeByType(objectProps.fontSize);

    const style: React.CSSProperties = {
        width: objectProps.size.width,
        height: objectProps.size.height,
        color: objectProps.color,
        fontSize: fontSize,
        left: objectProps.move.x,
        top: objectProps.move.y,
        zIndex: objectProps.zIndex,
    }

    if (hasBackgroundColor(objectProps)) {
        style.backgroundColor = objectProps.backgroundColor
    }

    if (isRounded(objectProps)) {
        style.borderRadius = '50%';
    }

    // Don't show outline error if the object is selected
    if ('outlineError' in objectProps && objectProps.outlineError) {
        style.boxShadow = '0 0 0 2px inset #d32f2f';
    }

    const combinedProps = {
        ref: elementRef,
        ...draggableProps,
        ...selectableProps,
        style,
        className: [
            className,
            draggableProps.className,
            selectableProps.className
        ].filter(Boolean).join(' '),
    };

    return combinedProps;

}