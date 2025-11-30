import { Accessible, Check, Block, Store, RemoveShoppingCart } from '@mui/icons-material';
import { useEditorSeatDisplayLabel } from '@src/admin/SeatPlanner/components/Editor/hooks';
import './Seat.scss';
import { SeatObjectProps } from './types';
import { useWorkflowObject } from '../hooks';

const Seat = (props: SeatObjectProps) => {

    const workflowObjectProps = useWorkflowObject(props, 'stachesepl-sesat');
    const { seatDisplayLabel } = useEditorSeatDisplayLabel();

    const getDisplayLabel = () => {

        switch (seatDisplayLabel) {

            case 'group': {
                return props.group;
            }

            case 'seatid': {
                return props.seatId;
            }

            case 'price': {
                return props.price;
            }

            case 'status': {

                switch (props.status) {

                    case 'on-site': {
                        return <Store />
                    }

                    case 'unavailable': {
                        return <Block />
                    }

                    case 'available': {
                        return <Check />
                    }

                    case 'sold-out': {
                        return <RemoveShoppingCart />
                    }

                    default: {
                        return <Check />
                    }
                }

            }

            default: {
                return props.isHandicap ? <Accessible /> : props.label;
            }
        }

    }

    const displayLabel = getDisplayLabel();

    return (
        <div {...workflowObjectProps}>
            {displayLabel}
        </div>
    )
}

export default Seat;