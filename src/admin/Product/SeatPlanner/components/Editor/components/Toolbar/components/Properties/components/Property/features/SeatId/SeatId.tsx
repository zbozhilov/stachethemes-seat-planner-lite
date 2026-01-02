import { AutoAwesome } from "@mui/icons-material";
import { SeatObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import { useState } from "react";
import toast from "react-hot-toast";
import InputText from "../../../../../../../UI/InputText/InputText";
import InputWrap from "../../../../../../../UI/InputWrap/InputWrap";
import PatternBuilder from "../PatternBuilder/PatternBuilder";
import { getHasValidPattern, getIncrementValueByRegex } from "../utils";

const SeatId = (props: {
    objects: SeatObjectProps[]
}) => {

    const [displayError, setDisplayError] = useState(true);
    const [showPatternBuilder, setShowPatternBuilder] = useState(false);
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

    const handlePatternApply = (pattern: string) => {
        handleValueChange(pattern);
    };

    const duplicateSeatIds = getSeatsWithDuplicateSeatIds();

    const getErrorMessage = () => {

        if (duplicateSeatIds.includes(seatId)) {
            return __('SEAT_ID_DUPLICATE');
        }

        return '';
    }

    const showPatternBuilderButton = props.objects.length > 1;

    return (

        <InputWrap flexDirection='column'>

            <InputText
                id='stachesepl-toolbar-properties-seatid'
                label={__('SEAT_ID')}
                labelFor='stachesepl-toolbar-properties-seatid'
                placeholder={__('SEAT_ID')}
                value={displayValue}
                onChange={(value) => {
                    handleValueChange(value.toString());
                    setDisplayError(false);
                }}
                inputProps={{
                    onBlur: () => {
                        setDisplayError(true);
                    }
                }}
                error={displayError ? getErrorMessage() : ''}
            />

            {showPatternBuilderButton && (
                <div className='stachesepl-pattern-builder-wrapper'>
                    <button
                        className='stachesepl-pattern-builder-trigger'
                        onClick={() => setShowPatternBuilder(true)}
                    >
                        <AutoAwesome sx={{ fontSize: 16 }} />
                        {__('AUTO_INCREMENT')}
                    </button>

                    {showPatternBuilder && (
                        <PatternBuilder
                            onApply={handlePatternApply}
                            onClose={() => setShowPatternBuilder(false)}
                            numItems={props.objects.length}
                        />
                    )}
                </div>
            )}

        </InputWrap>
    )
}

export default SeatId