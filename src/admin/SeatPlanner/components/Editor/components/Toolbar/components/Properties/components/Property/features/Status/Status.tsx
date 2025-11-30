import { SeatObjectProps, Statuses } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import './Status.scss';

const Status = (props: {
    objects: SeatObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { status } = firstObject;
    const areSameStatus = props.objects.every(object => object.status === status);
    const displayValue = areSameStatus ? (status || 'available') : '';

    const handleChange = (value: Statuses) => {

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    status: value
                }
            })
        });
    }

    return (

        <div className='stachesepl-toolbar-properties-status'>

            <label htmlFor='stachesepl-toolbar-properties-status'>{__('SEAT_STATUS')}</label>

            <select id='stachesepl-toolbar-properties-status' value={displayValue} onChange={e => {
                handleChange(e.target.value as Statuses)
            }}>
                <option value='' disabled>{__('SEAT_STATUS')}</option>
                <option value='unavailable' onClick={() => handleChange('unavailable')}>{__('UNAVAILABLE')}</option>
                <option value='available' onClick={() => handleChange('available')}>{__('AVAILABLE')}</option>
                <option value='sold-out' onClick={() => handleChange('sold-out')}>{__('SOLD_OUT')}</option>
                <option value='on-site' onClick={() => handleChange('on-site')}>{__('PURCHASABLE_ON_SITE')}</option>
            </select>

        </div>
    )
}

export default Status