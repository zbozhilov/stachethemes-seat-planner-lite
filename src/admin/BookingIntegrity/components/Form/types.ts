export type CheckType = 'double_booking' | 'ghost_booking';

// Double booking types
export type DoubleBookingDuplicate = {
    seat_id: string;
    selected_date: string;
    count: number;
    order_ids: number[];
}

export type DoubleBookingResult = {
    product_id: number;
    product_name: string;
    duplicates: DoubleBookingDuplicate[];
    has_duplicates: boolean;
}

// Ghost booking types
export type GhostSeat = {
    seat_id: string;
    selected_date: string;
    order_ids: number[];
    order_statuses: string[];
    order_count: number;
}

export type GhostBookingResult = {
    product_id: number;
    product_name: string;
    ghost_seats: GhostSeat[];
    has_ghost_seats: boolean;
}

export type ProductIdResponse = {
    product_ids: number[];
}

export type FixStatus = 'idle' | 'fixing' | 'fixed' | 'error';

