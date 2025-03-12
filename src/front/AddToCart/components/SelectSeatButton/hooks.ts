import { useEffect, useState } from "react";
import fetchSeatPlanData from "../../ajax/fetchSeatPlanData";
import { useSeatPlanData, useSelectedSeats } from "../context/hooks";

export const useProductSeatPlan = (props: {
    productId: number;
    disabled: boolean;
}) => {

    const { seatPlanData, setSeatPlanData } = useSeatPlanData();
    const [dataState, setDataState] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {

        const controller = new AbortController();

        const fetchData = async () => {

            try {

                setDataState('loading');

                const seatPlanData = await fetchSeatPlanData({
                    productId: props.productId,
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

    }, [props.disabled, props.productId, setSeatPlanData]);

    return {
        data: seatPlanData,
        dataState,
    }
}

export const useButtonLabel = (props: {
    defaultText: string;
    selectSingleText: string;
    selectMultipleText: string;
}) => {

    const { selectedSeats } = useSelectedSeats();

    const [label, setLabel] = useState<string>(props.defaultText);

    useEffect(() => {

        const selectedSeatsCount = selectedSeats.length;

        if (0 === selectedSeatsCount) {
            setLabel(props.defaultText);
        } else if (1 === selectedSeatsCount) {
            setLabel(props.selectSingleText.replace('%d', selectedSeatsCount.toString()));
        } else {
            setLabel(props.selectMultipleText.replace('%d', selectedSeatsCount.toString()));
        }


    }, [props.defaultText, props.selectMultipleText, props.selectSingleText, selectedSeats.length]);

    return label;

}