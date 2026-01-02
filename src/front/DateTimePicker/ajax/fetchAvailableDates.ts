import { __ } from "@src/utils";

type fetchResult = {
    success: boolean;
    data: string[] | {
        error?: string;
    };
}

const fetchAvailableDates = async ({ productId, signal }: {
    productId: number,
    signal: AbortSignal
}): Promise<string[]> => {
    const adminAjaxUrl = window.seat_planner_add_to_cart.ajax_url;

    const response = await fetch(adminAjaxUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'seatplanner',
            task: 'get_available_dates',
            product_id: productId.toString(),
            nonce: window.seat_planner_add_to_cart.nonce,
        }),
        signal,
    });

    if (!response.ok) {
        throw new Error(__('FAILED_TO_FETCH_AVAILABLE_DATES'));
    }

    const result: fetchResult = await response.json();

    if (!result.success) {
        const errorMessage = 'error' in result.data ? result.data.error : __('FAILED_TO_FETCH_AVAILABLE_DATES');
        throw new Error(errorMessage);
    }

    return result.data as string[];
}

export default fetchAvailableDates;