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

export type ManagerDiscountData = {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
};

export type ManagerCustomFieldOption = {
    label: string;
    price?: number;
};

/** Display condition operators for number fields. */
export type ManagerNumberConditionOperator = 'eq' | 'neq' | 'gt' | 'lt';

/** Display condition (matches product admin / frontend shape). */
export type ManagerDisplayCondition =
    | { fieldUid: string; checked: boolean }
    | { fieldUid: string; selectedValues: string[] }
    | { fieldUid: string; filled: boolean }
    | { fieldUid: string; operator: ManagerNumberConditionOperator; value: number };

export type ManagerCustomFieldData = {
    uid?: string;
    label: string;
    type: 'text' | 'textarea' | 'checkbox' | 'select' | 'number' | 'meta' | 'info';
    required?: boolean;
    placeholder?: string;
    options?: ManagerCustomFieldOption[];
    checkedValue?: string;
    price?: number;
    min?: number;
    max?: number;
    displayConditions?: ManagerDisplayCondition[];
    mutuallyExclusiveWith?: string[];
};

export type SeatDataWithOverride = {
    seat: SeatObjectData | null;
    currentStatus: SeatStatus;
    isTaken: boolean;
    discounts?: ManagerDiscountData[];
    customFields?: ManagerCustomFieldData[];
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