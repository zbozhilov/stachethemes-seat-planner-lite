import type { SeatPlanDataProps } from '@src/front/AddToCart/types';
import { __ } from '@src/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { AuditoriumProduct, AuditoriumProductsResponse, SeatDataWithOverride, SeatObjectData, SeatStatus } from './types';

export const useAuditoriumProducts = (
    search: string = '',
    page: number = 1,
    perPage: number = 10
) => {
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, error } = useQuery<AuditoriumProductsResponse>({
        queryKey: ['auditorium-products', debouncedSearch, page, perPage],
        queryFn: async ({ signal }) => {
            const response = await axios.post(
                window.stachesepl_ajax.ajax_url,
                new URLSearchParams({
                    action: 'seatplanner',
                    task: 'get_auditorium_products',
                    search: debouncedSearch,
                    page: page.toString(),
                    per_page: perPage.toString(),
                    nonce: window.stachesepl_ajax.nonce,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    signal,
                }
            )

            const result = response.data;

            if (!result.success) {
                throw new Error(result.data?.error || __('FAILED_TO_FETCH_PRODUCTS'));
            }

            return result.data;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 0
    })

    return { 
        data: data ?? null, 
        loading: isLoading, 
        error: error instanceof Error ? error.message : error ? String(error) : null,
        search: debouncedSearch,
    };
}

export const useAuditoriumProduct = (
    productId: number | undefined,  
    options: {
        includeDates?: boolean;
    } = {
        includeDates: false,
    }
) => {
    const { data, isLoading, error } = useQuery<AuditoriumProduct & { dates?: string[] }>({
        queryKey: ['auditorium-product', productId, options.includeDates],
        queryFn: async ({ signal }) => {
            const response = await axios.post(
                window.stachesepl_ajax.ajax_url,
                new URLSearchParams({
                    action: 'seatplanner',
                    task: 'get_auditorium_product',
                    product_id: productId?.toString() || '',
                    include_dates: options.includeDates ? 'yes' : 'no',
                    nonce: window.stachesepl_ajax.nonce,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    signal,
                }
            )

            const result = response.data;

            if (!result.success) {
                throw new Error(result.data?.error || __('FAILED_TO_FETCH_PRODUCT'));
            }

            return result.data;
        },
        enabled: !!productId,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 0,
    });

    
    return { 
        data: data ?? null, 
        loading: isLoading, 
        error: error instanceof Error ? error.message : error ? String(error) : null 
    };
}

export const useAuditoriumProductAvailability = (
    productId: number | undefined,
    dateTime: string | undefined,
) => {
    const [reloadTimestamp, setReloadTimestamp] = useState(Date.now());
    const [data, setData] = useState<SeatPlanDataProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(() => {
        setReloadTimestamp(Date.now());
    }, []);

    useEffect(() => {

        if (!productId) {
            setError(__('PRODUCT_ID_IS_REQUIRED'));
            setLoading(false);
            return;
        }

        const abortController = new AbortController();

        const fetchAvailability = async () => {

            setLoading(true);
            setError(null);

            try {
                const response = await axios.post(
                    window.stachesepl_ajax.ajax_url,
                    new URLSearchParams({
                        action: 'seatplanner',
                        task: 'get_seat_plan_data',
                        product_id: productId.toString(),
                        selected_date: dateTime || '',
                        nonce: window.stachesepl_ajax.nonce,
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        signal: abortController.signal,
                    }
                )

                const result = response.data;

                if (!result.success) {
                    throw new Error(result.data?.error || __('FAILED_TO_FETCH_SEAT_AVAILABILITY'));
                }

                setData(result.data);
                setLoading(false);
            } catch (err) {

                if (axios.isCancel(err)) {
                    return;
                }

                if (err instanceof Error) {
                    setError(err.message);
                }

                setLoading(false);

            } 
        };

        fetchAvailability();

        return () => {
            abortController.abort();
        };
    }, [productId, dateTime, reloadTimestamp]);

    return { data, loading, error, reload };
}

export const useSeatData = (
    productId: number | undefined,
    seatId: string | undefined,
    dateTime: string | undefined
) => {
    const [data, setData] = useState<SeatDataWithOverride | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId || !seatId) {
            setError(__('FAILED_TO_FETCH_SEAT_DATA'));
            setLoading(false);
            return;
        }

        const abortController = new AbortController();

        const fetchSeatData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.post(
                    window.stachesepl_ajax.ajax_url,
                    new URLSearchParams({
                        action: 'seatplanner',
                        task: 'get_seat_plan_data',
                        product_id: productId.toString(),
                        selected_date: dateTime || '',
                        nonce: window.stachesepl_ajax.nonce,
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        signal: abortController.signal,
                    }
                )

                const result = response.data;

                if (!result.success) {
                    throw new Error(result.data?.error || __('FAILED_TO_FETCH_SEAT_DATA'));
                }

                const seatPlanData = result.data as SeatPlanDataProps;

                // Find the specific seat
                const seat = seatPlanData.objects?.find(
                    obj => obj.type === 'seat' && (obj as SeatObjectData).seatId === seatId
                ) as SeatObjectData | undefined;

                if (!seat) {
                    throw new Error(__('FAILED_TO_FETCH_SEAT_DATA'));
                }

                // Determine current status from the seat data
                const currentStatus: SeatStatus = (seat.status as SeatStatus) || 'available';
                const isTaken = seat.taken || false;

                setData({
                    seat,
                    currentStatus,
                    isTaken,
                    discounts: seatPlanData.discounts,
                    customFields: seatPlanData.customFields,
                });

                setLoading(false);
            } catch (err) {


                if (axios.isCancel(err)) {
                    return;
                }
                
                if (err instanceof Error) {
                    setError(err.message);
                }

                setLoading(false);

            } 
        };

        fetchSeatData();

        return () => {
            abortController.abort();
        };
    }, [productId, seatId, dateTime]);

    const refetch = useCallback(async () => {
        if (!productId || !seatId) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                window.stachesepl_ajax.ajax_url,
                new URLSearchParams({
                    action: 'seatplanner',
                    task: 'get_seat_plan_data',
                    product_id: productId.toString(),
                    selected_date: dateTime || '',
                    nonce: window.stachesepl_ajax.nonce,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            )

            const result = response.data;

            if (!result.success) {
                throw new Error(result.data?.error || __('FAILED_TO_FETCH_SEAT_DATA'));
            }

            const seatPlanData = result.data as SeatPlanDataProps;

            // Find the specific seat
            const seat = seatPlanData.objects?.find(
                obj => obj.type === 'seat' && (obj as SeatObjectData).seatId === seatId
            ) as SeatObjectData | undefined;

            if (!seat) {
                throw new Error(__('FAILED_TO_FETCH_SEAT_DATA'));
            }

            // Determine current status from the seat data
            const currentStatus: SeatStatus = (seat.status as SeatStatus) || 'available';
            const isTaken = seat.taken || false;

            setData({
                seat,
                currentStatus,
                isTaken,
                discounts: seatPlanData.discounts,
                customFields: seatPlanData.customFields,
            });

            setLoading(false);
        } catch (err) {
            setLoading(false);
            
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    }, [productId, seatId, dateTime]);

    return { data, loading, error, refetch };
}

export const useUpdateSeatOverride = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateOverride = useCallback(async (
        productId: number,
        seatId: string,
        status: SeatStatus,
        dateTime?: string
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                window.stachesepl_ajax.ajax_url,
                new URLSearchParams({
                    action: 'seatplanner',
                    task: 'update_manager_seat_override',
                    product_id: productId.toString(),
                    seat_id: seatId,
                    status: status,
                    selected_date: dateTime || '',
                    nonce: window.stachesepl_ajax.nonce,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            )

            const result = response.data;

            if (!result.success) {
                throw new Error(result.data?.error || __('FAILED_TO_UPDATE_SEAT_OVERRIDE'));
            }

            setLoading(false);

            return true;

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message);
            }

            setLoading(false);
            
            return false;
        } 
    }, []);

    return { updateOverride, loading, error };
}

export type SeatOrderDetails = {
    order_id: number;
    item_id: number;
    order_edit_url: string;
    order_date: string;
    order_status: string;
    customer_name: string;
    customer_email: string;
    product_name: string;
    seat_id: string;
    seat_price: number;
    date_time: string;
    seat_data: {
        seatId: string;
        selectedDate: string;
        customFields?: Record<string, string>;
    };
    seat_discount?: {
        name: string;
        type: 'percentage' | 'fixed';
        value: number;
    } | null;
    has_dates: boolean;
};

export const useOrderDetailsBySeat = (
    productId: number | undefined,
    seatId: string | undefined,
    dateTime: string | undefined
) => {
    const [data, setData] = useState<SeatOrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId || !seatId) {
            setLoading(false);
            return;
        }

        const abortController = new AbortController();

        const fetchOrderDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.post(
                    window.stachesepl_ajax.ajax_url,
                    new URLSearchParams({
                        action: 'seatplanner',
                        task: 'get_order_details_by_seat_id',
                        product_id: productId.toString(),
                        seat_id: seatId,
                        selected_date: dateTime || '',
                        nonce: window.stachesepl_ajax.nonce,
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        signal: abortController.signal,
                    }
                )

                const result = response.data;

                if (!result.success) {
                    throw new Error(result.data?.error || __('FAILED_TO_FETCH_ORDER_DETAILS'));
                }

                // result.data can be null if no order found
                setData(result.data);
                setLoading(false);
            } catch (err) {

                if (axios.isCancel(err)) {
                    return;
                }

                if (err instanceof Error) {
                    setError(err.message);
                }

                setLoading(false);

            } 
        };

        fetchOrderDetails();

        return () => {
            abortController.abort();
        };
    }, [productId, seatId, dateTime]);

    const refetch = useCallback(async () => {
        if (!productId || !seatId) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                window.stachesepl_ajax.ajax_url,
                new URLSearchParams({
                    action: 'seatplanner',
                    task: 'get_order_details_by_seat_id',
                    product_id: productId.toString(),
                    seat_id: seatId,
                    selected_date: dateTime || '',
                    nonce: window.stachesepl_ajax.nonce,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            )

            const result = response.data;

            if (!result.success) {
                throw new Error(result.data?.error || __('FAILED_TO_FETCH_ORDER_DETAILS'));
            }

            // result.data can be null if no order found
            setData(result.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);

            if (err instanceof Error) {
                setError(err.message);
            }
        }
    }, [productId, seatId, dateTime]);

    return { data, loading, error, refetch };
}

export type UpdateOrderItemData = {
    seatId?: string;
    selectedDate?: string;
    customFields?: Record<string, string>;
    seatDiscount?: { name: string; type: 'percentage' | 'fixed'; value: number } | null;
};

export const useUpdateOrderItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateOrderItem = useCallback(async (
        orderId: number,
        itemId: number,
        seatData: UpdateOrderItemData,
        originalSeatData: Record<string, unknown>,
        sendNotifications = true
    ): Promise<{ success: boolean; error: string | null }> => {
        setLoading(true);
        setError(null);

        try {
            const { seatDiscount, ...seatDataForMeta } = seatData;
            const seat_data = {
                ...originalSeatData,
                ...seatDataForMeta,
            };

            const updatePayload: {
                item_id: number;
                seat_data: Record<string, unknown>;
                seat_discount?: { name: string; type: 'percentage' | 'fixed'; value: number } | '';
            } = {
                item_id: itemId,
                seat_data,
            };

            if (seatDiscount !== undefined) {
                updatePayload.seat_discount = seatDiscount && seatDiscount.value > 0 ? seatDiscount : '';
            }

            const updates = [updatePayload];

            const response = await axios.post(
                window.stachesepl_ajax.ajax_url,
                new URLSearchParams({
                    action: 'seatplanner',
                    task: 'update_order_item_meta',
                    order_id: orderId.toString(),
                    updates: JSON.stringify(updates),
                    send_notifications: sendNotifications ? 'yes' : 'no',
                    nonce: window.stachesepl_ajax.nonce,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            )

            setLoading(false);

            const result = response.data;

            if (!result.success) {
                const errorMessage = result.data?.error || __('FAILED_TO_UPDATE_ORDER_ITEM');
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }

            return { success: true, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : __('FAILED_TO_UPDATE_ORDER_ITEM');
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    }, []);

    return { updateOrderItem, loading, error, clearError: () => setError(null) };
}

export type CreateOrderSeatDiscount = {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
};

export type CreateOrderData = {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    orderStatus?: string;
    sendEmails?: boolean;
    seatDiscount?: CreateOrderSeatDiscount | null;
    seatCustomFields?: Record<string, string | number | boolean>;
};

export const useCreateOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOrder = useCallback(async (
        productId: number,
        seatId: string,
        dateTime: string | undefined,
        orderData: CreateOrderData
    ): Promise<{ success: boolean; error: string | null; orderId?: number }> => {
        setLoading(true);
        setError(null);

        try {
            const params: Record<string, string> = {
                action: 'seatplanner',
                task: 'create_order_for_seat',
                product_id: productId.toString(),
                seat_id: seatId,
                selected_date: dateTime || '',
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone || '',
                order_status: orderData.orderStatus || 'processing',
                send_emails: orderData.sendEmails ? 'yes' : 'no',
                nonce: window.stachesepl_ajax.nonce,
            };
            if (orderData.seatDiscount && orderData.seatDiscount.value > 0) {
                params.seat_discount = JSON.stringify(orderData.seatDiscount);
            }
            if (orderData.seatCustomFields && Object.keys(orderData.seatCustomFields).length > 0) {
                params.seat_custom_fields = JSON.stringify(orderData.seatCustomFields);
            }

            const response = await axios.post(
                window.stachesepl_ajax.ajax_url,
                new URLSearchParams(params),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            )

            setLoading(false);

            const result = response.data;

            if (!result.success) {
                const errorMessage = result.data?.error || __('FAILED_TO_CREATE_ORDER');
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }

            return { success: true, error: null, orderId: result.data?.order_id };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : __('FAILED_TO_CREATE_ORDER');
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    }, []);

    return { createOrder, loading, error, clearError: () => setError(null) };
}