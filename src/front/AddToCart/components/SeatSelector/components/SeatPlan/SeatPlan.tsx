import { useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { useLayoutEffect } from 'react'; // prevent flickering
import Object from './components/Object/Object';
import Workflow from './components/Workflow/Workflow';

const SeatPlan = () => {

    const { seatPlanData } = useSeatPlanData();
    const { selectedSeats, setSelectedSeats } = useSelectedSeats();

    // Remove seats from "selected" if these seats are flagged as taken by someone else
    useLayoutEffect(() => {

        if (!selectedSeats.length) {
            return;
        }

        setSelectedSeats(selectedSeats.filter(seatId => {
            const seat = objects.find(object => object.type === 'seat' && object.seatId === seatId);
            return seat && !seat.taken;
        }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seatPlanData]);

    if (!seatPlanData) {
        return null;
    }

    const { objects } = seatPlanData;

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