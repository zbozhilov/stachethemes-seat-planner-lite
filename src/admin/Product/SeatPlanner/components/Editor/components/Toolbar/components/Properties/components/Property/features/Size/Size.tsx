import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import InputText from "../../../../../../../UI/InputText/InputText";
import InputWrap from "../../../../../../../UI/InputWrap/InputWrap";
    
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
        <InputWrap>

            <InputText
                id='stachesepl-toolbar-properties-size-width'
                label={__('WIDTH')}
                labelFor='stachesepl-toolbar-properties-size-width'
                value={displayWidth}
                onChange={(value) => {
                    handleResize(value.toString(), 'width')
                }}
            />  

            <InputText
                id='stachesepl-toolbar-properties-size-height'
                label={__('HEIGHT')}
                labelFor='stachesepl-toolbar-properties-size-height'
                value={displayHeight}
                onChange={(value) => {
                    handleResize(value.toString(), 'height')
                }}
            />

        </InputWrap>
    )
}

export default Size