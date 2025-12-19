import { useEffect, useState } from 'react'
import type { OverviewStats } from '../pages/Overview/components/types'

let OVERVIEW_CACHE: OverviewStats | null = null;

export const useOverviewStats = () => {
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        const loadFromCache = () => {

            // if OVERVIEW_CACHE is not null, return it
            if (OVERVIEW_CACHE) {
                setStats(OVERVIEW_CACHE);
                setLoading(false);
                return true;
            }
            return false;   
        }

        const fetchStats = async () => {
            try {

                setLoading(true);

                const response = await fetch(window.stachesepl_ajax.ajax_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        action: 'seatplanner',
                        task: 'get_overview_stats',
                        _wpnonce: window.stachesepl_ajax.nonce,
                    }),
                    signal: abortController.signal,
                })

                if (response.ok) {
                    const result = await response.json()
                    if (result.success && result.data) {
                        setStats(result.data)
                        OVERVIEW_CACHE = result.data as OverviewStats;
                        setLoading(false);
                    }
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error(error);
                }

            }
        }

        if (!loadFromCache()) {
            fetchStats();
        }

        return () => abortController.abort();
    }, []);

    return { stats, loading };
}