import { BaseObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import './Zindex.scss';

const Zindex = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { zIndex } = firstObject;
    const areSameZIndex = props.objects.every(object => object.zIndex === zIndex);
    const displayZIndex = areSameZIndex && zIndex !== undefined && zIndex !== null ? String(zIndex) : '';

    const handleValueChange = (value: number) => {

        const clampedValue = Math.min(99, value);

        setObjects(prev =>

            prev.map((object) => {

                if (!objectIds.includes(object.id)) {
                    return { ...object };
                }

                return {
                    ...object,
                    zIndex: clampedValue
                };
            })
        );

    }

    return (

        <div className='stachesepl-toolbar-properties-zindex'>

            <label htmlFor='stachesepl-toolbar-properties-zindex'>{__('ZINDEX')}</label>
            <input id='stachesepl-toolbar-properties-zindex'
                type="number"
                min={0}
                max={99}
                placeholder={__('ZINDEX')}
                value={displayZIndex} onChange={(e) => {

                    const numberValue = Number(e.target.value);

                    if (isNaN(numberValue)) {
                        return;
                    }

                    handleValueChange(numberValue)
                }} />

        </div>
    )
}

export default Zindex