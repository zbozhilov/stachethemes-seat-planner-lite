import { SeatObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';
import { __ } from '@src/utils';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';
import ToggleButton from '../../../../../../../UI/ToggleButton/ToggleButton';

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

        <InputWrap>
            <ToggleButton
                id='stachesepl-toolbar-properties-handicap'
                label={__('HANDICAP_SEAT')}
                labelFor='stachesepl-toolbar-properties-handicap'
                value={displayValue}
                onChange={(value) => handleValueChange(value)}
            />
        </InputWrap>

    )
}

export default Handicap