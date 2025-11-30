import { isSeatObject, SeatObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types';
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import './DiscountGroup.scss';

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

        <div className='stachesepl-toolbar-properties-discount-group'>
            <label htmlFor='stachesepl-toolbar-properties-discount-group'>{__('GROUP')}</label>
            <input id='stachesepl-toolbar-properties-group'
                type="text"
                placeholder={__('GROUP_NAME')}
                value={discountDiscountGroup}
                onChange={(e) => {
                    handleDiscountGroupChange(e.target.value)
                }} />
        </div>
    )
}

export default DiscountGroup