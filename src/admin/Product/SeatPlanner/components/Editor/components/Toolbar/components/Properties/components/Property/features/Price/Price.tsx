import { isSeatObject, SeatObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types';
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import InputText from '../../../../../../../UI/InputText/InputText';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';

const Price = (props: {
    objects: SeatObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { price } = firstObject;
    const areSamePrice = props.objects.every(object => object.price === price);
    const displayPrice = areSamePrice ? price : '';

    const handlePriceChange = (value: string) => {

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id) || !isSeatObject(object)) {
                    return { ...object };
                }

                return {
                    ...object,
                    price: Number(value) || 0
                }

            })
        });
    }

    return (

        <InputWrap>
            <InputText
                id='stachesepl-toolbar-properties-price'
                label={__('PRICE')}
                labelFor='stachesepl-toolbar-properties-price'
                placeholder={__('PRICE')}
                value={displayPrice}
                onChange={(value) => {
                    handlePriceChange(value.toString());
                }}
            />
        </InputWrap>
    )
}

export default Price