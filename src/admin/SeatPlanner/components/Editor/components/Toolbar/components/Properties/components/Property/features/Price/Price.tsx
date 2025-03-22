import { __ } from '@src/utils';
import './Price.scss';
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { isSeatObject, SeatObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types';
import toast from 'react-hot-toast';
import { useRef } from 'react';

const Price = (props: {
    objects: SeatObjectProps[]
}) => {

    const { objects, setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { price } = firstObject;
    const areSamePrice = props.objects.every(object => object.price === price);
    const displayPrice = areSamePrice ? price : '';

    const seatObjectsCount = objects.filter(isSeatObject).length;
    const selectedObjectsCount = objectIds.length;

    let errorToastID: any = useRef(null);

    const handlePriceChange = (value: string) => {

        if (seatObjectsCount !== selectedObjectsCount) {

            if (!errorToastID.current) {
                errorToastID.current = toast.error(
                    __('DYNAMIC_PRICE_CHANGE_NOT_SUPPORTED'),
                    {
                        duration: 5000
                    }
                );
                setTimeout(() => {
                    if (errorToastID.current) {
                        errorToastID.current = null;
                    }
                }, 5000);
            }
        }

        setObjects(prev => {

            return prev.map(object => {

                if (!isSeatObject(object)) {
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