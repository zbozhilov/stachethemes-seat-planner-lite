import { SeatObjectProps, Statuses } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import InputWrap from "../../../../../../../UI/InputWrap/InputWrap";
import Select, { SelectOption } from "../../../../../../../UI/Select/Select";
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

    const getPrefix = (color: string) => {
        return (
            <span
                className="stachesepl-status-dot"
                style={{ backgroundColor: color }}
            />
        )
    }

    const options: SelectOption[] = [
        { value: 'available', label: __('AVAILABLE'), prefix: getPrefix('#10b981') },
        { value: 'unavailable', label: __('UNAVAILABLE'), prefix: getPrefix('#71717a') },
        { value: 'sold-out', label: __('SOLD_OUT'), prefix: getPrefix('#ef4444') },
        { value: 'on-site', label: __('PURCHASABLE_ON_SITE'), prefix: getPrefix('#f59e0b') },
    ];

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

        <InputWrap>
            <Select
                id='stachesepl-toolbar-properties-status'
                label={__('SEAT_STATUS')}
                options={options}
                value={displayValue}
                onChange={(value) => handleChange(value as Statuses)}
            />
        </InputWrap>
    )
}


export default Status