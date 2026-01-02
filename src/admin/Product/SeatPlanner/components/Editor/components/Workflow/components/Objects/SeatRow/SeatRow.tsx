import { useWorkflowObject } from '../hooks';
import './SeatRow.scss';
import { SeatRowObjectProps } from './types';
import Seat from '../Seat/Seat';

const SeatRow = (props: SeatRowObjectProps) => {

    const combinedProps = useWorkflowObject(props, 'stachesepl-seat-row');
    const { seats } = props;

    return (
        <div {...combinedProps}>
            {
                seats.map(seat => (
                    <Seat key={seat.id} {...seat} />
                ))
            }
        </div>
    )
}

export default SeatRow;