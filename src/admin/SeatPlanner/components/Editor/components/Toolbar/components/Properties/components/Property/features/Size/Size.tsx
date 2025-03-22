import { BaseObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import './Size.scss';

const Size = (props: {
    objects: BaseObjectProps[]
}) => {


    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);

    const [firstObject] = props.objects;
    const { width: objectWidth, height: objectHeight } = firstObject.size;

    const areSameWidth = props.objects.every(({ size }) => size.width === objectWidth);
    const areSameHeight = props.objects.every(({ size }) => size.height === objectHeight);

    const displayWidth = areSameWidth ? objectWidth : '';
    const displayHeight = areSameHeight ? objectHeight : '';

    const handleResize = (value: string, direction: 'width' | 'height') => {

        const sizeValue = parseInt(value, 10) || 0;

        setObjects((prev) =>
            prev.map((object) => {
                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    size: {
                        ...object.size,
                        [direction]: sizeValue,
                    },
                };
            })
        );
    }

    return (
        <div className='stachesepl-toolbar-properties-size'>

            <div>
                <label htmlFor='stachesepl-toolbar-properties-size-width'>{__('WIDTH')}</label>
                <input id='stachesepl-toolbar-properties-size-width' type="text" placeholder={__('WIDTH')} value={displayWidth} onChange={(e) => {
                    handleResize(e.target.value, 'width')
                }} />
            </div>

            <div>
                <label htmlFor='stachesepl-toolbar-properties-size-height'>{__('HEIGHT')}</label>
                <input id='stachesepl-toolbar-properties-size-height' type="text" placeholder={__('HEIGHT')} value={displayHeight} onChange={(e) => {
                    handleResize(e.target.value, 'height')
                }} />
            </div>
        </div>
    )
}

export default Size