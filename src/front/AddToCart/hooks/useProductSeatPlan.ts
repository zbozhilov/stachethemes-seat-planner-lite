import { useEffect, useState } from "react";
import { useProductId, useSeatPlanData } from "../components/context/hooks";
import fetchSeatPlanData from "../ajax/fetchSeatPlanData";

const useProductSeatPlan = (props: {
    disabled: boolean;
}) => {

    const { productId } = useProductId();
    const { seatPlanData, setSeatPlanData } = useSeatPlanData();
    const [dataState, setDataState] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {

        const controller = new AbortController();

        const fetchData = async () => {

            try {

                setDataState('loading');

                const seatPlanData = await fetchSeatPlanData({
                    productId: productId,
                    signal: controller.signal,
                });

                setSeatPlanData(seatPlanData);
                setDataState('ready');

            } catch (e) {

                if (controller.signal.aborted) {
                    return;
                }

                setDataState('error');
            }

        }

        if (true === props.disabled) {
            return;
        }

        fetchData();

        return () => {
            controller.abort();
        }

    }, [props.disabled, productId, setSeatPlanData]);

    return {
        data: seatPlanData,
        dataState,
    }
}

export default useProductSeatPlan;