import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";

import { __ } from '@src/utils';
import InputColor from "../InputColor/InputColor";
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

    const handleColorChange = (color: string) => {

        if (color === displayValue) {
            return;
        }

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    color: color
                }
            })
        });
    }

    return (

        <div className='stachesepl-toolbar-properties-color'>

            <label htmlFor='stachesepl-toolbar-properties-color'>{__('COLOR')}</label>

            <InputColor
                value={displayValue}
                onChange={handleColorChange}
            />

            {/* <input
                id='stachesepl-toolbar-properties-color'
                type="color"
                placeholder={__('COLOR')}
                value={displayValue}
                onChange={e => {
                    setUpdateColor(e.target.value)
                }}
                onBlur={handleColorChange} /> */}

        </div>
    )
}

export default Color