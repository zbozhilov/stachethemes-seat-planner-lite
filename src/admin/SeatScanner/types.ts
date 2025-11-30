import { Statuses } from "../SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";

type qrProductDataSuccess = {
    scanned: boolean;
    scan_date: string;
    scan_author: string;
    order_id: number;
    order_key: string;
    order_display_status: string;
    order_status: string;
    product_id: string;
    product_title: string;
    price: string;
    seat_id: string;
    order_link: string;
    customer_name: string;
    seat_status?: Statuses;
    date_time?: string;
    date_time_timestamp?: number; // php unix timestamp
};

type qrProductDataError = {
    error: string;
}

export type qrProductDataProps = qrProductDataSuccess | qrProductDataError;
