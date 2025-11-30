import { __ } from "@src/utils";
import { useEffect, useState, useRef } from "react";
import { AjaxResponseData, ResponseItem } from "./types";

export const useCheckDoubleBooking = (enabled: boolean) => {

    const [data, setData] = useState<AjaxResponseData|null>(null);
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
        // Reset states without aborting the current controller
        setData(null);
        setReady(false);
        setError(false);
        setProductIds([]);
        setCurrentProductIndex(-1);
    };
    
    // This ensures we have a valid AbortController before making requests
    const ensureAbortController = () => {
        if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
            abortControllerRef.current = new AbortController();
        }
        return abortControllerRef.current;
    };
    
    useEffect(() => {
        if (enabled) {
            // When enabling, make sure we have a fresh controller but don't reset data
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
                
                // Start with the first product
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
                
                const response = await fetch(window.stachesepl_ajax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'seatplanner',
                        task: 'check_product_booking',
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

                // Append new product results to existing data
                setData(prevData => [...(prevData || []), result.data]);

                // Move to next product or finish
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
            // First get all product IDs
            fetchProductIds();
        } else if (enabled && currentProductIndex >= 0 && currentProductIndex < productIds.length) {
            // Then check each product one by one
            checkProduct(productIds[currentProductIndex]);
        }

        return () => {
            // Cleanup function - abort any ongoing requests when component unmounts
            // or when dependencies change
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [enabled, currentProductIndex, productIds]);

    return {
        data: data,
        ready: ready,
        isLoading: isLoading,
        error: error,
        currentProductIndex: currentProductIndex,
        totalProducts: productIds.length,
        resetCheck,
        cancelCheck
    }
}