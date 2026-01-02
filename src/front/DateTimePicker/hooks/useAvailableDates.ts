import { useEffect, useState } from "react";
import fetchAvailableDates from "../ajax/fetchAvailableDates";

type CacheEntry = {
    dates: string[];
    timestamp: number;
}

const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds
const cache = new Map<number, CacheEntry>();

const useAvailableDates = (props: {
    productId: number;
    disabled: boolean;
    dummyDates?: string[];
}) => {

    const [dataState, setDataState] = useState<'loading' | 'ready' | 'error'>('loading');
    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {

        const controller = new AbortController();

        const fetchData = async () => {

            try {

                if (props.dummyDates) {
                    setDates(props.dummyDates);
                    setDataState('ready');
                    return;
                }

                // Check cache first
                const cachedEntry = cache.get(props.productId);
                const now = Date.now();
                
                if (cachedEntry && (now - cachedEntry.timestamp) < CACHE_DURATION) {
                    // Use cached data
                    setDates(cachedEntry.dates);
                    setDataState('ready');
                    return;
                }

                setDataState('loading');

                const availableDates = await fetchAvailableDates({
                    productId: props.productId,
                    signal: controller.signal,
                });

                // Update cache
                cache.set(props.productId, {
                    dates: availableDates,
                    timestamp: now,
                });

                setDates(availableDates);
                setDataState('ready');

            } catch (e) {
                setDates([]);
                setDataState('error');
            }
        }

        if (true === props.disabled) {
            return;
        }

        fetchData();

        return () => {
            controller.abort();
        }

    }, [props.disabled, props.productId, props.dummyDates]);

    return {
        dataState,
        availableDates: dates,
    }
}

export default useAvailableDates;