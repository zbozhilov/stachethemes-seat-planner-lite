import type { FrontWorkflowObject } from '@src/front/AddToCart/types'

export type SeatStatus = 'available' | 'unavailable' | 'sold-out' | 'on-site';

export type SeatObjectData = FrontWorkflowObject & {
    type: 'seat';
    price: number;
    seatId: string;
    group?: string;
    status?: SeatStatus;
    taken?: boolean;
};

export type SeatDataWithOverride = {
    seat: SeatObjectData | null;
    currentStatus: SeatStatus;
    isTaken: boolean;
};


export type AuditoriumProduct = {
    id: number
    name: string
    permalink: string
    edit_link: string
    has_dates: boolean
    image: string
}

export type AuditoriumProductsResponse = {
    products: AuditoriumProduct[]
    total: number
    page: number
    per_page: number
    total_pages: number
}