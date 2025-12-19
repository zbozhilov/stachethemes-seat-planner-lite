type OrderData = {
    customer_email: string;
    customer_name: string;
    order_date: string;
    order_id: number;
    order_status: string;
    product_name: string;
    product_note: string;
    seat_id: string;
    seat_price: string;
}

export type AjaxResponseData = OrderData[];