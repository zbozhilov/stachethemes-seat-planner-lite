export type ResponseItem = {
    product_id: number;
    product_name: string;
    duplicates: {
        seat_id: number;
        count: number;
        order_ids: number[];
    }[];
    has_duplicates: boolean;
}

export type AjaxResponseData = ResponseItem[];

export type ProductIdResponse = {
    product_ids: number[];
}
