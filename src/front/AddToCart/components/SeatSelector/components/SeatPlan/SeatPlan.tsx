import { useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { useLayoutEffect } from 'react'; // prevent flickering
import Object from './components/Object/Object';
import Workflow from './components/Workflow/Workflow';

const SeatPlan = () => {

    const { seatPlanData } = useSeatPlanData();
    const { selectedSeats, setSelectedSeats } = useSelectedSeats();

    // Remove seats from "selected" if these seats are flagged as taken by someone else
    useLayoutEffect(() => {

        if (!selectedSeats.length || !seatPlanData?.objects) {
            return;
        }

        // Create a Map for O(1) seat lookups instead of O(n) find operations
        const seatMap = new Map<string, typeof seatPlanData.objects[0]>();
        seatPlanData.objects.forEach(object => {
            if (object.type === 'seat' && object.seatId) {
                seatMap.set(object.seatId, object);
            }
        });

        setSelectedSeats(selectedSeats.filter(seatId => {
            const seat = seatMap.get(seatId);
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