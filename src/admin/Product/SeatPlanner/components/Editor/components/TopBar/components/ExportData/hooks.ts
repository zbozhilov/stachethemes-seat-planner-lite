import { useEditorObjects, useWorkflowProps } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import { WorkflowObject } from "../../../Workflow/components/Objects/types";
import toast from "react-hot-toast";

interface ProcessedCsvObject {
    type: string;
    id: number;
    moveX?: string | number;
    moveY?: string | number;
    sizeWidth?: string | number;
    sizeHeight?: string | number;
    zIndex?: string | number;
    fontSize?: string;
    label?: string;
    color?: string;
    price?: string | number;
    isHandicap?: string | boolean;
    seatId?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOpacity?: string | number;
    rounded?: string | boolean;
    group?: string;
}

export const useExportToCsv = () => {

    const { workflowProps } = useWorkflowProps();
    const { objects: workflowObjects } = useEditorObjects();

    const getCsvContent = (objects: WorkflowObject[]): string => {

        if (!Array.isArray(objects)) {
            return '';
        }

        // Process objects into a consistent format
        const processedObjects = objects.map(obj => {
            // Common properties for all types
            const baseObject: ProcessedCsvObject = {
                type: obj.type,
                id: obj.id,
                moveX: obj.move?.x ?? '',
                moveY: obj.move?.y ?? '',
                sizeWidth: obj.size?.width ?? '',
                sizeHeight: obj.size?.height ?? '',
                zIndex: obj.zIndex ?? '',
                fontSize: obj.fontSize ?? '',
                label: obj.label ?? '',
                color: obj.color ?? '',
            };

            // Type-specific properties
            switch (obj.type) {

                case 'seat':
                    return {
                        ...baseObject,
                        price: obj.price ?? '',
                        isHandicap: obj.isHandicap ?? false,
                        seatId: obj.seatId ?? '',
                        backgroundColor: obj.backgroundColor ?? '',
                        // rounded: obj.rounded ?? false, // legacy property, roundedValue is the new property
                        roundedValue: obj.roundedValue ?? undefined,
                        group: obj.group ?? '',
                        status: obj.status ?? '',
                    };

                case 'generic':
                    return {
                        ...baseObject,
                        backgroundColor: obj.backgroundColor ?? '',
                        // rounded: obj.rounded ?? false, // legacy property, roundedValue is the new property
                        roundedValue: obj.roundedValue ?? undefined,
                    };

                case 'screen':
                    return {
                        ...baseObject,
                        backgroundColor: obj.backgroundColor ?? ''
                    };

                case 'text':
                    return {
                        ...baseObject
                    };

                default:
                    throw new Error(`Unknown object type`);
            }
        });

        // push the workflow props as object of type 'workflow'
        processedObjects.push({
            type: 'workflow',
            id: 0,
            moveX: 0,
            moveY: 0,
            sizeWidth: workflowProps.width,
            sizeHeight: workflowProps.height,
            backgroundColor: workflowProps.backgroundColor,
            backgroundImage: workflowProps.backgroundImage,
            backgroundOpacity: workflowProps.backgroundOpacity,
        });

        // Get all possible headers from all objects
        const headers = new Set<keyof ProcessedCsvObject>();
        processedObjects.forEach(obj => {
            Object.keys(obj).forEach(key => headers.add(key as keyof ProcessedCsvObject));
        });
        const headerArray = Array.from(headers);

        // Convert to CSV
        const csvRows = [
            // Header row
            headerArray.map(header => `"${header}"`).join(','),
            // Data rows
            ...processedObjects.map(obj =>
                headerArray.map(header => {
                    const value = obj[header] ?? '';
                    // Handle special characters and quotes
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return `"${value}"`;
                }).join(',')
            )
        ];

        return csvRows.join('\n');
    };

    const handleClick = () => {

        toast.success(__('EXPORTING_DATA'));

        const csvContent = getCsvContent(workflowObjects);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'seat_plan.csv'); // Set the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return {
        handleClick
    }
}