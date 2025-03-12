declare global {
    interface Window {
        seat_scanner: {
            ajax_url: string;
            nonce: string;
        };
    }
}

type qrProductDataSuccess = {
    scanned: boolean;
    order_id: number;
    order_key: string;
    order_status: string;
    product_id: string;
    product_title: string;
    price: string;
    seat_id: string;
    order_link: string;
    customer_name: string;
};

type qrProductDataError = {
    error: string;
}

export type qrProductDataProps = qrProductDataSuccess | qrProductDataError;
