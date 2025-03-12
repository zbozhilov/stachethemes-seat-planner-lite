import { __ } from '@src/utils';
import './Round.scss';
import { SeatObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from '@src/admin/SeatPlanner/components/Editor/hooks';
import { GenericObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types';

const Round = (props: {
    objects: SeatObjectProps[] | GenericObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const areAllChecked = props.objects.every(object => object.rounded === true);
    const displayValue = areAllChecked;

    const handleValueChange = (value: boolean) => {

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    rounded: value
                }
            })
        });
    }

    return (

        <div className='stsp-toolbar-properties-round'>

            <label htmlFor='stsp-toolbar-properties-round'>{__('ROUND_CORNERS')}</label>
            <input
                id='stsp-toolbar-properties-round'
                type="checkbox"
                checked={displayValue}
                onChange={(e) => {
                    handleValueChange(e.target.checked)
                }} />

        </div>
    )
}

export default Round