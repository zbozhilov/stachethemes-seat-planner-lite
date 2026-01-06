import { useRef, useEffect } from 'react';
import Slider from '@src/admin/Product/SeatPlanner/components/Editor/components/UI/Slider/Slider';
import { GenericObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types';
import { ScreenObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Screen/types';
import { SeatObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';
import { __, MAX_ROUNDED_VALUE } from '@src/utils';

const Round = (props: {
    objects: SeatObjectProps[] | GenericObjectProps[] | ScreenObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const areAllChecked = props.objects.every(object => object.rounded === true);
    const areAllRounded = areAllChecked;

    const [firstObject] = props.objects;
    const { roundedValue } = firstObject;
    const areSameValue = props.objects.every(object => object.roundedValue === roundedValue);
    const displayRoundedValue = areSameValue ? roundedValue : (areAllRounded ? 999 : 0);
  
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleRoundedValueChange = (value: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setObjects(prev => {

                return prev.map(object => {

                    if (!objectIds.includes(object.id)) return { ...object };

                    return {
                        ...object,
                        roundedValue: value
                    }
                })
            });
        }, 100);
    }

    return (
        <InputWrap>

            <Slider 
                id='stachesepl-toolbar-properties-round-slider'
                label={__('ROUND_CORNERS')}
                value={displayRoundedValue ?? 0}
                min={0}
                max={MAX_ROUNDED_VALUE}
                step={1}
                onChange={(value) => handleRoundedValueChange(Number(value))}
            />
        </InputWrap>
    )
}

export default Round