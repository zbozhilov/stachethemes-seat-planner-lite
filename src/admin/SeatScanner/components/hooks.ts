import { useState, useEffect } from "react"
import { qrProductDataProps } from "../types";
import { __ } from "@src/utils";

export const useQrProductData = (text: string | null) => {

    const [data, setData] = useState<qrProductDataProps | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {

        if (!text) {
            return;
        }

        const abortController = new AbortController();

        const fetchData = async () => {

            setData(null);
            setReady(false);
            setError(false);

            try {
                const response = await fetch(window.seat_scanner.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'seatplanner',
                        task: 'get_qr_string_details',
                        qr_string: text,
                        _wpnonce: window.seat_scanner.nonce,
                    }),
                    signal: abortController.signal
                });

                if (!response.ok) {
                    throw new Error(__('GENERIC_ERROR_MESSAGE'));
                }

                const result = await response.json();

                if (result.data.error) {
                    setData(result.data);
                    setError(true);
                    return;
                }

                setData(result.data);

                setReady(true);

            } catch (error) {

                if (abortController.signal.aborted) {
                    return;
                }

                setError(true);
            } 
        };

        fetchData();

        return () => {
            abortController.abort();
        }

    }, [text]);

    return {
        data: data,
        ready: ready,
        error: error
    }
}