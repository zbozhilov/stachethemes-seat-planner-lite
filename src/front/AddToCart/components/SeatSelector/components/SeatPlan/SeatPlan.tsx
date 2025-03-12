import { useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { useLayoutEffect } from 'react'; // prevent flickering
import Object from './components/Object/Object';
import Workflow from './components/Workflow/Workflow';

const SeatPlan = () => {

    const { seatPlanData } = useSeatPlanData();
    const { selectedSeats, setSelectedSeats } = useSelectedSeats();

    if (!seatPlanData) {
        return null;
    }

    const { objects } = seatPlanData;

    // Remove seats from "selected" if these seats are flagged as taken by someone else
    useLayoutEffect(() => {

        if (!selectedSeats.length) {
            return;
        }

        setSelectedSeats(selectedSeats.filter(seatId => {
            const seat = objects.find(object => object.type === 'seat' && object.seatId === seatId);
            return seat && !seat.taken;
        }));

    }, [seatPlanData]);

    return (
        <Workflow>
            {objects.map(object => {

                return <Object
                    key={object.id}
                    data={object}
                />
            })}
        </Workflow>
    )
}

export default SeatPlan