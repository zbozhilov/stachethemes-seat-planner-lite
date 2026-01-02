import { __ } from "@src/utils";
import { SeatPlanDataProps } from "../types";

type fetchResult = {
    success: boolean;
    data: SeatPlanDataProps | {
        error?: string;
    };
}

const fetchSeatPlanData = async ({ productId, signal }: {
    productId: number,
    signal: AbortSignal
}): Promise<SeatPlanDataProps> => {
    const adminAjaxUrl = window.seat_planner_add_to_cart.ajax_url;

    const response = await fetch(adminAjaxUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'seatplanner',
            task: 'get_seat_plan_data',
            product_id: productId.toString(),
            nonce: window.seat_planner_add_to_cart.nonce,
        }),
        signal,
    });

    if (!response.ok) {
        throw new Error(__('FAILED_TO_FETCH_SEAT_PLAN_DATA'));
    }

    const result: fetchResult = await response.json();

    if (!result.success) {
        const errorMessage = 'error' in result.data ? result.data.error : __('FAILED_TO_FETCH_SEAT_PLAN_DATA');
        throw new Error(errorMessage);
    }

    return result.data as SeatPlanDataProps;
}

export default fetchSeatPlanData;