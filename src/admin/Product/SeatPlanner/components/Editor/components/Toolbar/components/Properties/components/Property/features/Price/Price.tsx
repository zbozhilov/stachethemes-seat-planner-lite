import { __ } from '@src/utils';
import './Price.scss';
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { isSeatObject, SeatObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types';

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

        <div className='stachesepl-toolbar-properties-price'>
            <label htmlFor='stachesepl-toolbar-properties-price'>{__('PRICE')}</label>
            <input id='stachesepl-toolbar-properties-price' type="text" placeholder={__('PRICE')} value={displayPrice} onChange={(e) => {
                handlePriceChange(e.target.value)
            }} />
        </div>
    )
}

export default Price