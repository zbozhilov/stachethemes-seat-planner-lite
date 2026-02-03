type OrderData = {
    customer_email: string;
    customer_name: string;
    order_date: string;
    order_id: number;
    order_status: string;
    product_name: string;
    product_note: string;
    seat_id: string;
    seat_price: string | number;
    date_time: string;
    custom_fields?: Record<string, string | number | boolean | null>;
}

export type AjaxResponseData = OrderData[];