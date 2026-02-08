import type { ManagerDiscountData, ManagerCustomFieldData } from '../../../Manager/types'

export type SeatData = {
    seatId: string
    selectedDate: string
    customFields?: Record<string, string>
    qr_code?: string
    qr_code_secret?: string
    qr_code_scanned?: boolean
    qr_code_scanned_author?: number
    qr_code_scanned_timestamp?: number
}

export type OrderItem = {
    item_id: number
    product_id: number
    product_name: string
    seat_data: SeatData
    seat_discount?: {
        name: string
        value: number
        type: 'percentage' | 'fixed'
    }
    seat_price: number
    has_dates: boolean
    discounts?: ManagerDiscountData[]
    customFields?: ManagerCustomFieldData[]
}

export type OrderData = {
    order_id: number
    order_status: string
    order_total_formatted?: string
    items: OrderItem[]
}

export type ItemEdits = Partial<SeatData> & { discountName?: string }
