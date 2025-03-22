import { GenericObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types';
import { ScreenObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Screen/types';
import { SeatObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types';
import { TextObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Text/types';
import { ObjectTypes, WorkflowObject } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects, useSelectObjects } from '@src/admin/SeatPlanner/components/Editor/hooks';
import { useEffect } from 'react';
import BaseProperties from './components/Property/BaseProperties/BaseProperties';
import GenericProperties from './components/Property/GenericProperties/GenericProperties';
import ScreenProperties from './components/Property/ScreenProperties/ScreenProperties';
import SeatProperties from './components/Property/SeatProperties/SeatProperties';
import TextProperties from './components/Property/TextProperties/TextProperties';
import './Properties.scss';
import SelectedCount from './components/SelectedCount/SelectedCount';

const Properties = () => {

    const { selectedObjects, setSelectedObjects } = useSelectObjects();
    const { objects } = useEditorObjects();

    const getObjectsById = (ids: number[]) => {

        const theObjects = ids.map(selectedObject => {

            const found = objects.find(object => object.id === selectedObject);

            if (found) {
                return found;
            }

            return null;

        }).filter(object => object !== null) as WorkflowObject[];

        return theObjects;
    }

    const getObjectsTypes = (objects: WorkflowObject[]) => {

        const types: ObjectTypes[] = [];

        objects.forEach(object => {
            if (!types.includes(object.type)) {
                types.push(object.type);
            }
        });

        return types;

    }

    const getPropertiesByType = (theObjects: WorkflowObject[]) => {

        const types = getObjectsTypes(theObjects);

        if (types.length > 1) {
            return <BaseProperties objects={theObjects} />;
        }

        const typeComponentMap: Record<ObjectTypes, JSX.Element> = {
            seat: <SeatProperties objects={theObjects as SeatObjectProps[]} />,
            screen: <ScreenProperties objects={theObjects as ScreenObjectProps[]} />,
            text: <TextProperties objects={theObjects as TextObjectProps[]} />,
            generic: <GenericProperties objects={theObjects as GenericObjectProps[]} />,
        };

        return typeComponentMap[types[0]] ?? <BaseProperties objects={theObjects} />;
    };

    const theObjects = getObjectsById(selectedObjects);
    const hasObjects = theObjects.length > 0;

    // Check if the selected objects are still in the workflow
    // Problem can occur during undo/redo hence the check
    useEffect(() => {

        if (hasObjects) {
            return;
        }

        setSelectedObjects([]);

    }, [setSelectedObjects, hasObjects]);

    if (!hasObjects) {
        return null;
    }

    const propertiesContent = getPropertiesByType(theObjects);

    return (
        <div className='stachesepl-tooltip-properties'>
            {propertiesContent}
            <SelectedCount />
        </div>
    )
}

export default Properties