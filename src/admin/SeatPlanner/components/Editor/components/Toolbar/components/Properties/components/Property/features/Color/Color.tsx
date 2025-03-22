import { useState } from "react";
import { BaseObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";

import { __ } from '@src/utils';
import './Color.scss';

const Color = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { color } = firstObject;
    const areSameColor = props.objects.every(object => object.color === color);
    const displayValue = areSameColor ? color : '';
    const [updateColor, setUpdateColor] = useState(displayValue);

    const handleColorChange = () => {

        if (updateColor === displayValue) {
            return;
        }

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    color: updateColor
                }
            })
        });
    }

    return (

        <div className='stachesepl-toolbar-properties-color'>

            <label htmlFor='stachesepl-toolbar-properties-color'>{__('COLOR')}</label>
            <input
                id='stachesepl-toolbar-properties-color'
                type="color"
                placeholder={__('COLOR')}
                value={displayValue}
                onChange={e => {
                    setUpdateColor(e.target.value)
                }}
                onBlur={handleColorChange} />

        </div>
    )
}

export default Color