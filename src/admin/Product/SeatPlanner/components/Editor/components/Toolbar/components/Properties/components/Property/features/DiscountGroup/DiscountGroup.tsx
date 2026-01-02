import { isSeatObject, SeatObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types';
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';
import InputText from '../../../../../../../UI/InputText/InputText';

const DiscountGroup = (props: {
    objects: SeatObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { group } = firstObject;
    const areSameGroup = props.objects.every(object => object.group === group);
    const discountDiscountGroup = areSameGroup ? (group ?? '') : '';

    const handleDiscountGroupChange = (value: string) => {

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id) || !isSeatObject(object)) {
                    return { ...object };
                }

                return {
                    ...object,
                    group: value
                }

            })
        });
    }

    return (

        <InputWrap>
            <InputText
                id='stachesepl-toolbar-properties-discount-group'
                label={__('GROUP')}
                labelFor='stachesepl-toolbar-properties-discount-group'
                value={discountDiscountGroup}
                onChange={(value) => {
                    handleDiscountGroupChange(value.toString())
                }}
            />
        </InputWrap>

    )
}

export default DiscountGroup