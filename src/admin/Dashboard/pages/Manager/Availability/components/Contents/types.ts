import type { FrontWorkflowObject } from '@src/front/AddToCart/types';

export type SeatAvailabilityStatus = 'available' | 'sold-out' | 'unavailable' | 'on-site';

export type SeatObject = FrontWorkflowObject & {
    type: 'seat';
    seatId: string;
};

