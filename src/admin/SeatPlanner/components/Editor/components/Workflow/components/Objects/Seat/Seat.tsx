import { Accessible } from '@mui/icons-material';
import { useEditorSeatDisplayLabel } from '@src/admin/SeatPlanner/components/Editor/hooks';
import { useWorkflowObject } from '../hooks';
import './Seat.scss';
import { SeatObjectProps } from './types';

const Seat = (props: SeatObjectProps) => {

    const workflowObjectProps = useWorkflowObject(props, 'stsp-sesat');
    const { seatDisplayLabel } = useEditorSeatDisplayLabel();

    const getDisplayLabel = () => {

        switch(seatDisplayLabel) {

            case 'seatid': {
                return props.seatId;
            }

            case 'price': {
                return props.price;
            }

            default: {
                return props.label;
            }
        }

    }

    const displayLabel = getDisplayLabel();

    return (
        <div {...workflowObjectProps}>
            {!props.isHandicap && displayLabel}
            {props.isHandicap && <Accessible />}
        </div>
    )
}

export default Seat;