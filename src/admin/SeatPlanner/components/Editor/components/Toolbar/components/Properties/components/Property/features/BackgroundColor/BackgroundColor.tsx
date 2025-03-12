import { useState } from "react";
import { __ } from '@src/utils';
import './BackgroundColor.scss';
import { BaseObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";

type AcceptType = BaseObjectProps & { backgroundColor: string };

const BackgroundColor = (props: {
    objects: AcceptType[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { backgroundColor } = firstObject;
    const areSameBGColor = props.objects.every(object => object.backgroundColor === backgroundColor);
    const displayValue = areSameBGColor ? backgroundColor : '';
    const [updateBGColor, setUpdateBGColor] = useState(displayValue);

    const handleLabelChange = () => {

        if (updateBGColor === displayValue) {
            return;
        }

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    backgroundColor: updateBGColor
                }
            })
        });
    }

    return (

        <div className='stsp-toolbar-properties-bgcolor'>

            <label htmlFor='stsp-toolbar-properties-bgcolor'>{__('BACKGROUND_COLOR')}</label>
            <input
                id='stsp-toolbar-properties-bgcolor'
                type="color"
                placeholder={__('BACKGROUND_COLOR')}
                value={displayValue}
                onChange={(e) => {
                    setUpdateBGColor(e.target.value)
                }}

                onBlur={handleLabelChange}
            />

        </div>
    )
}

export default BackgroundColor