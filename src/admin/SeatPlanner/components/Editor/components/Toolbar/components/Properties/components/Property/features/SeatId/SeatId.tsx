import { SeatObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import './SeatId.scss';
import { getHasValidPattern, getIncrementValueByRegex } from "../utils";
import toast from "react-hot-toast";
import { useState } from "react";

const SeatId = (props: {
    objects: SeatObjectProps[]
}) => {

    const [displayError, setDisplayError] = useState(true);
    const { setObjects, getSeatsWithDuplicateSeatIds } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { seatId } = firstObject;
    const areSameSeatId = props.objects.every(object => object.seatId === seatId);
    const displayValue = areSameSeatId ? seatId : '';

    const handleValueChange = (value: string) => {

        const foundPattern = getHasValidPattern(value);

        setObjects(prev =>

            prev.map(object => {

                if (!objectIds.includes(object.id)) {
                    return { ...object };
                }

                const objectIndex = objectIds.indexOf(object.id);

                let theValue = getIncrementValueByRegex(value, objectIndex);

                return {
                    ...object,
                    seatId: theValue
                };
            })
        );

        if (foundPattern) {
            toast.success(__('PATTERN_APPLIED'));
        }
    }

    const duplicateSeatIds = getSeatsWithDuplicateSeatIds();

    const getErrorMessage = () => {

        if (duplicateSeatIds.includes(seatId)) {
            return <span className='stachesepl-toolbar-properties-input-error'>{__('SEAT_ID_DUPLICATE')}</span>;
        }

        return '';
    }

    return (

        <div className='stachesepl-toolbar-properties-seatid'>

            <label htmlFor='stachesepl-toolbar-properties-seatid'>{__('SEAT_ID')}</label>
            <input
                id='stachesepl-toolbar-properties-seatid'
                type="text"
                placeholder={__('SEAT_ID')} value={displayValue}
                onChange={(e) => {
                    handleValueChange(e.target.value);
                    setDisplayError(false);
                }}
                onBlur={() => {
                    setDisplayError(true);
                }}
            />
            {displayError && getErrorMessage()}

        </div>
    )
}

export default SeatId