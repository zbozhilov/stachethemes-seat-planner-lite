import { __ } from '@src/utils';
import './Handicap.scss';
import { SeatObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from '@src/admin/SeatPlanner/components/Editor/hooks';

const Handicap = (props: {
    objects: SeatObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const areAllChecked = props.objects.every(object => object.isHandicap === true);
    const displayValue = areAllChecked;

    const handleValueChange = (value: boolean) => {

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    isHandicap: value
                }
            })
        });
    }

    return (

        <div className='stsp-toolbar-properties-handicap'>

            <label htmlFor='stsp-toolbar-properties-handicap'>{__('HANDICAP_SEAT')}</label>
            <input
                id='stsp-toolbar-properties-handicap'
                type="checkbox"
                checked={displayValue}
                onChange={(e) => {
                    handleValueChange(e.target.checked)
                }} />

        </div>
    )
}

export default Handicap