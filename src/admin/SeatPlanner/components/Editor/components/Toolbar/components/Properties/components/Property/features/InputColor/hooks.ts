import { useEffect, useState } from 'react';

export const useOutsideHandler = <T extends HTMLElement>(
    refs: React.RefObject<T | null> | React.RefObject<T | null>[],
    callback: (event: MouseEvent | TouchEvent) => void
): void => {

    useEffect(() => {
        const refArray = Array.isArray(refs) ? refs : [refs];

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                refArray.every(ref => ref.current && !ref.current.contains(event.target as Node))
            ) {
                callback(event);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [refs, callback]);

};