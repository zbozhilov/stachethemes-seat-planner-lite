import { useEditorObjects, useWorkflowProps } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import Papa, { ParseResult } from 'papaparse';
import toast from "react-hot-toast";
import { GenericObjectProps } from "../../../../../Workflow/components/Objects/Generic/types";
import { ScreenObjectProps } from "../../../../../Workflow/components/Objects/Screen/types";
import { SeatObjectProps } from "../../../../../Workflow/components/Objects/Seat/types";
import { TextObjectProps } from "../../../../../Workflow/components/Objects/Text/types";
import { WorkflowObject } from "../../../../../Workflow/components/Objects/types";
import { WorkflowProps } from "../../../../../Workflow/types";

export const useImportFromCsv = ({
    inputRef,
    onClose
}: {
    inputRef: React.RefObject<HTMLInputElement | null>,
    onClose: () => void
}) => {

    const { setWorkflowProps } = useWorkflowProps();
    const { setObjects } = useEditorObjects();

    const getWorkflowPropsFromCsv = () => {

        return new Promise((resolve) => {
            const file = inputRef.current?.files?.[0];

            if (!file) {
                resolve(null);
                return;
            }

            Papa.parse<Record<string, string>>(file, {

                complete: (result: ParseResult<Record<string, string>>) => {
                    try {

                        const workflowObject = result.data.filter(row => row.type === 'workflow')[0];

                        if (!workflowObject) {
                            resolve(null);
                            return;
                        }

                        const workflowProps: WorkflowProps = {
                            width: parseFloat(workflowObject.sizeWidth ?? '0'),
                            height: parseFloat(workflowObject.sizeHeight ?? '0'),
                            backgroundColor: workflowObject.backgroundColor ?? '#fff',
                            backgroundImage: workflowObject.backgroundImage ?? '',
                            backgroundOpacity: workflowObject.backgroundOpacity ?? '1'
                        };

                        resolve(workflowProps);

                    } catch (error) {
                        resolve(null);
                    }
                },
                header: true,
                skipEmptyLines: true,
                error: (error) => {
                    resolve(null);
                }
            });
        });

    }

    const getObjectsFromCsv = () => {

        return new Promise((resolve) => {
            const file = inputRef.current?.files?.[0];

            if (!file) {
                resolve(null);
                return;
            }

            Papa.parse<Record<string, string>>(file, {

                complete: (result: ParseResult<Record<string, string>>) => {
                    try {

                        const parsedObjects = result.data
                            .map((row, index) => {

                                if (!(parseInt(row.id, 10) >= 0)) {
                                    return null;
                                }

                                const baseObject: Partial<WorkflowObject> = {
                                    type: row.type as 'seat' | 'generic' | 'screen' | 'text',
                                    id: parseInt(row.id, 10),
                                    move: row.moveX && row.moveY ? {
                                        x: parseFloat(row.moveX),
                                        y: parseFloat(row.moveY)
                                    } : {
                                        x: 0,
                                        y: 0
                                    },
                                    size: row.sizeWidth && row.sizeHeight ? {
                                        width: parseFloat(row.sizeWidth),
                                        height: parseFloat(row.sizeHeight)
                                    } : {
                                        width: 50,
                                        height: 50
                                    },
                                    zIndex: !isNaN(Number(row.zIndex)) ? Number(row.zIndex) : 0,
                                    fontSize: ['small', 'medium', 'large'].includes(row.fontSize) ?
                                        row.fontSize as 'small' | 'medium' | 'large' : 'medium',
                                    label: row.label ?? '',
                                    color: row.color ?? '#000'
                                };

                                switch (row.type) {

                                    case 'seat':
                                        return {
                                            ...baseObject,
                                            type: 'seat',
                                            price: parseFloat(row.price) >= 0 ? parseFloat(row.price) : 0,
                                            isHandicap: row.isHandicap === 'true',
                                            seatId: row.seatId ?? '',
                                            backgroundColor: row.backgroundColor ?? '#fff',
                                            rounded: row.rounded === 'true',
                                            group: row.group ?? '',
                                            status: row.status ?? '',
                                        } as SeatObjectProps;

                                    case 'generic':
                                        return {
                                            ...baseObject,
                                            type: 'generic',
                                            backgroundColor: row.backgroundColor ?? '#fff',
                                            rounded: row.rounded === 'true'
                                        } as GenericObjectProps;

                                    case 'screen':
                                        return {
                                            ...baseObject,
                                            type: 'screen',
                                            backgroundColor: row.backgroundColor ?? '#fff'
                                        } as ScreenObjectProps;

                                    case 'text':
                                        return {
                                            ...baseObject,
                                            type: 'text'
                                        } as TextObjectProps;

                                    default:
                                        return null;
                                }
                            })
                            .filter((obj): obj is WorkflowObject => obj !== null);

                        resolve(parsedObjects);
                    } catch (error) {
                        resolve(null);
                    }
                },
                header: true,
                skipEmptyLines: true,
                error: (error) => {
                    resolve(null);
                }
            });
        });

    }

    const handleClick = async () => {

        const workflowProps = await getWorkflowPropsFromCsv() as WorkflowProps | null;
        const objects = await getObjectsFromCsv() as WorkflowObject[] | null;

        if (workflowProps) {
            setWorkflowProps(prev => {
                return {
                    ...prev,
                    ...workflowProps
                };
            });
        }

        if (objects) {

            setObjects(objects);
            onClose();

            toast.success(__('D_OBJECTS_IMPORTED').replace('%d', objects.length.toString()));
        }

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    return {
        handleClick
    };
};