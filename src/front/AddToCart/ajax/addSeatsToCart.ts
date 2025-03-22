import { __ } from "@src/utils";

type fetchResult = {
    success: boolean;
    data: {
        error?: string;
        message?: string;
        cart_fragments?: {
            [key: string]: string;
        }
    } 
}

const addSeatsToCart = async ({ productId, selectedSeatsData, signal }: {
    productId: number
    selectedSeatsData: {
        seatId: string
    }[],
    signal: AbortSignal
}): Promise<fetchResult> => {
    const adminAjaxUrl = window.seat_planner_add_to_cart.ajax_url;

    const response = await fetch(adminAjaxUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'seatplanner',
            task: 'add_seats_to_cart',
            selected_seats: JSON.stringify(selectedSeatsData),
            product_id: productId.toString(),
            nonce: window.seat_planner_add_to_cart.nonce
        }),
        signal,
    });

    if (!response.ok) {
        throw new Error(__('FAILED_TO_ADD_SEATS_TO_CART'));
    }

    const result: fetchResult = await response.json();

    return result;

}

export default addSeatsToCart;