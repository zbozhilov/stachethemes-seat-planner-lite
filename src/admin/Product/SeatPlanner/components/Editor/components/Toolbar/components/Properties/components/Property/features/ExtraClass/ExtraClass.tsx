import { BaseObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import InputText from '../../../../../../../UI/InputText/InputText';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';

const ExtraClass = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { extraClass } = firstObject;
    const areSameExtraClass = props.objects.every(object => object.extraClass === extraClass);
    const displayExtraClass = areSameExtraClass ? extraClass : '';

    const handleExtraClassChange = (value: string) => {

        setObjects(prev =>

            prev.map((object) => {

                if (!objectIds.includes(object.id)) {
                    return { ...object };
                }

                return {
                    ...object,
                    extraClass: value
                };
            })
        );

    }

    return (

        <InputWrap flexDirection='column'>

            <InputText
                id='stachesepl-toolbar-properties-extra-class'
                label={__('EXTRA_CLASS')}
                labelFor='stachesepl-toolbar-properties-extra-class'
                placeholder={__('EXTRA_CLASS')}
                value={displayExtraClass || ''}
                onChange={(value) => {
                    handleExtraClassChange(value.toString());
                }}
            />

        </InputWrap>
    )
}

export default ExtraClass