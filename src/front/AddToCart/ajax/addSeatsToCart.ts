import { __ } from "@src/utils";
import { CustomFieldsEntryData, MetaFieldsEntryData } from "../types";

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

/**
 * addSeatsToCart
 *
 * Sends a request to add one or more selected seats for an Auditorium product
 * to the WooCommerce cart via the plugin's AJAX endpoint.
 *
 * Params:
 * - productId: number
 * - selectedSeatsData: Array<{ seatId: string; discountId: string; customFields?: Record<string, string | number | boolean>; metaFields?: Record<string, string> }>
 *   Each item represents a seat ID (string), an optional discount ID, optional custom fields data, and optional meta fields data.
 * - signal: AbortSignal used to cancel the request if needed.
 *
 * Behavior:
 * - POSTs to the `seatplanner` action with task `add_seats_to_cart`, passing the
 *   product ID, JSON-encoded seat data, and security nonce.
 * - Expects a JSON response shaped as { success: boolean, data: { message?, error?, cart_fragments? } }.
 * - Throws an Error if the HTTP response is not ok (e.g., network/server error).
 *
 * Returns:
 * - A Promise resolving to the parsed JSON (`fetchResult`). When `success` is true,
 *   `data.cart_fragments` may include DOM fragments to refresh the mini cart UI.
 */
const addSeatsToCart = async ({ productId, selectedSeatsData, selectedDate, signal }: {
    productId: number
    selectedSeatsData: {
        seatId: string,
        discountId: string,
        customFields?: CustomFieldsEntryData,
        metaFields?: MetaFieldsEntryData,
    }[],
    selectedDate: string | null,
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
            selected_date: selectedDate || '',
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