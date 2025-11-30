import { useEffect, useState } from 'react';

export const useImageReady = (url?: string) => {

    const [ready, setReady] = useState(false);

    useEffect(() => {

        if (!url) {
            setReady(false);
            return;
        }

        let isCancelled = false;
        const img = new Image();

        const handleLoad = () => {
            if (!isCancelled) {
                setReady(true);
            }
        };

        const handleError = () => {
            if (!isCancelled) {
                setReady(false);
            }
        };

        setReady(false);
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);
        img.src = url;

        // In some cases, the image might already be cached
        if (img.complete && img.naturalWidth > 0) {
            handleLoad();
        }

        return () => {
            isCancelled = true;
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
        };

    }, [url]);

    return ready;
};


