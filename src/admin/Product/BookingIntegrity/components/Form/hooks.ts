import { __ } from "@src/utils";
import { useEffect, useState, useRef } from "react";
import { CheckType, DoubleBookingResult, GhostBookingResult } from "./types";

type CheckResult = DoubleBookingResult | GhostBookingResult;

export const useBookingIntegrityCheck = (enabled: boolean, checkType: CheckType) => {
    const [data, setData] = useState<CheckResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);
    const [productIds, setProductIds] = useState<number[]>([]);
    const [currentProductIndex, setCurrentProductIndex] = useState<number>(-1);
    const abortControllerRef = useRef<AbortController | null>(null);

    const cancelCheck = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsLoading(false);
        }
    };

    const resetCheck = () => {
        setData(null);
        setReady(false);
        setError(false);
        setProductIds([]);
        setCurrentProductIndex(-1);
    };

    const ensureAbortController = () => {
        if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
            abortControllerRef.current = new AbortController();
        }
        return abortControllerRef.current;
    };

    useEffect(() => {
        if (enabled) {
            ensureAbortController();
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        const fetchProductIds = async () => {
            try {
                setIsLoading(true);

                const controller = ensureAbortController();

                const response = await fetch(window.stachesepl_ajax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'seatplanner',
                        task: 'get_product_ids',
                        nonce: window.stachesepl_ajax.nonce,
                    }),
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(__('GENERIC_ERROR_MESSAGE'));
                }

                const result = await response.json();

                if (result.data.error) {
                    setError(true);
                    return;
                }

                setProductIds(result.data.product_ids);
                setData([]);

                if (result.data.product_ids.length > 0) {
                    setCurrentProductIndex(0);
                } else {
                    setIsLoading(false);
                    setReady(true);
                }
            } catch (error) {
                if (abortControllerRef.current?.signal.aborted) {
                    return;
                }
                setError(true);
                setIsLoading(false);
            }
        };

        const checkProduct = async (productId: number) => {
            try {
                const controller = ensureAbortController();

                const task = checkType === 'double_booking' 
                    ? 'check_product_booking' 
                    : 'check_product_ghost_booking';

                const response = await fetch(window.stachesepl_ajax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'seatplanner',
                        task: task,
                        product_id: productId.toString(),
                        nonce: window.stachesepl_ajax.nonce,
                    }),
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(__('GENERIC_ERROR_MESSAGE'));
                }

                const result = await response.json();

                if (result.data.error) {
                    throw new Error(result.data.error);
                }

                setData(prevData => [...(prevData || []), result.data]);

                if (currentProductIndex < productIds.length - 1) {
                    setCurrentProductIndex(prev => prev + 1);
                } else {
                    setIsLoading(false);
                    setReady(true);
                }
            } catch (error) {
                if (abortControllerRef.current?.signal.aborted) {
                    return;
                }
                setError(true);
                setIsLoading(false);
            }
        };

        if (enabled && currentProductIndex === -1) {
            fetchProductIds();
        } else if (enabled && currentProductIndex >= 0 && currentProductIndex < productIds.length) {
            checkProduct(productIds[currentProductIndex]);
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [enabled, currentProductIndex, productIds, checkType]);

    return {
        data,
        ready,
        isLoading,
        error,
        currentProductIndex,
        totalProducts: productIds.length,
        resetCheck,
        cancelCheck
    }
}

export const useFixGhostBooking = () => {
    const fixGhostBooking = async (
        productId: number,
        seatId: string,
        selectedDate: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(window.stachesepl_ajax.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'seatplanner',
                    task: 'fix_ghost_booking',
                    product_id: productId.toString(),
                    seat_id: seatId,
                    selected_date: selectedDate,
                    nonce: window.stachesepl_ajax.nonce,
                }),
            });

            if (!response.ok) {
                return false;
            }

            const result = await response.json();

            return result.success === true;
        } catch {
            return false;
        }
    };

    return { fixGhostBooking };
}

