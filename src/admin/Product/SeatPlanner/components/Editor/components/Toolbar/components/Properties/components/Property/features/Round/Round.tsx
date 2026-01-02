import { __ } from '@src/utils';
import { SeatObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';
import { GenericObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';
import ToggleButton from '../../../../../../../UI/ToggleButton/ToggleButton';

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
        <InputWrap>

            <ToggleButton
                id='stachesepl-toolbar-properties-round'
                label={__('ROUND_CORNERS')}
                labelFor='stachesepl-toolbar-properties-round'
                value={displayValue}
                onChange={(value) => handleValueChange(value)}
            />
            
        </InputWrap>
    )
}

export default Round