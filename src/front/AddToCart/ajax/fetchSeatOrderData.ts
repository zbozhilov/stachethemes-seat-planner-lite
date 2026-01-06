import { __ } from "@src/utils";

export type SeatOrderData = {
    order_id: number;
    order_edit_url: string;
    order_date: string;
    order_status: string;
    customer_name: string;
    customer_email: string;
    product_name: string;
    seat_id: string;
    seat_price: number;
    date_time: string;
}

type fetchResult = {
    success: boolean;
    data: SeatOrderData | {
        error?: string;
    };
}

const fetchSeatOrderData = async ({ productId, seatId, selectedDate, signal }: {
    productId: number,
    seatId: string,
    selectedDate: string | null,
    signal: AbortSignal
}): Promise<SeatOrderData> => {
    const adminAjaxUrl = window.seat_planner_add_to_cart.ajax_url;

    const response = await fetch(adminAjaxUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'seatplanner',
            task: 'get_order_details_by_seat_id',
            product_id: productId.toString(),
            seat_id: seatId,
            selected_date: selectedDate || '',
            nonce: window.seat_planner_add_to_cart.nonce,
        }),
        signal,
    });

    if (!response.ok) {
        throw new Error(__('FAILED_TO_FETCH_SEAT_ORDER_DATA'));
    }

    const result: fetchResult = await response.json();

    if (!result.success) {
        const errorMessage = 'error' in result.data ? result.data.error : __('FAILED_TO_FETCH_SEAT_ORDER_DATA');
        throw new Error(errorMessage);
    }

    return result.data as SeatOrderData;
}

export default fetchSeatOrderData;