import { Accessible, Check, Block, Store, RemoveShoppingCart } from '@mui/icons-material';
import { useEditorSeatDisplayLabel } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';
import './Seat.scss';
import { SeatObjectProps } from './types';
import { useResizableWorkflowObject } from '../hooks';

const Seat = (props: SeatObjectProps) => {

    const { combinedProps, isResizing, resizeDimensions, handleResizeStart } = useResizableWorkflowObject(props, 'stachesepl-seat');
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
        <div {...combinedProps}>
            {/* Resize handle */}
            <div 
                className='stachesepl-object-resize-handle'
                onMouseDown={handleResizeStart}
            />
            
            {/* Resize dimensions tooltip */}
            {isResizing && resizeDimensions && (
                <div className='stachesepl-object-resize-tooltip' style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed' }}>
                    {Math.round(resizeDimensions.width)} × {Math.round(resizeDimensions.height)}
                </div>
            )}
            {displayLabel}
        </div>
    )
}

export default Seat;