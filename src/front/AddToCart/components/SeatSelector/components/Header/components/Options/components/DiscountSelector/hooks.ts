import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import { useDiscounts, useSeatPlanData } from '@src/front/AddToCart/components/context/hooks';

type Discount = {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    group?: string;
};

type UseDiscountSelectorArgs = {
    seatId: string;
};

export const useDiscountSelector = ({ seatId }: UseDiscountSelectorArgs) => {
    const [isOpen, setIsOpen] = useState(false);
    const { seatPlanData, setSeatPlanData } = useSeatPlanData();
    const { discounts } = useDiscounts();
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleSelect = useCallback(
        (discountName: string) => {
            if (!seatPlanData?.objects) {
                return;
            }

            const objects = seatPlanData.objects.map((object) => {
                if (object.type !== 'seat' || object.seatId !== seatId) {
                    return object;
                }

                return {
                    ...object,
                    discount: discountName,
                };
            });

            setSeatPlanData({
                ...seatPlanData,
                objects,
            });

            setIsOpen(false);
        },
        [seatId, seatPlanData, setSeatPlanData],
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        }
    };

    const handleOptionKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>, discountName: string) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(discountName);
            }
        },
        [handleSelect],
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const theSeatData = useMemo(() => {
        if (!seatPlanData?.objects) return undefined;
        return seatPlanData.objects.find(
            (object) => object.type === 'seat' && object.seatId === seatId,
        );
    }, [seatPlanData, seatId]);

    const selectedDiscount = theSeatData?.discount || '';

    const availableDiscounts = useMemo(
        () =>
            discounts.filter((discount: Discount) => {
                // Discount applies for all seats
                if (!discount.group) {
                    return true;
                }
                return discount.group === theSeatData?.group;
            }),
        [discounts, theSeatData?.group],
    );

    const selectedDiscountData = availableDiscounts.find(
        (d: Discount) => d.name === selectedDiscount,
    );
    
    const hasDiscount = Boolean(selectedDiscount && selectedDiscountData);

    return {
        // state
        isOpen,
        hasDiscount,
        // data
        selectedDiscount,
        selectedDiscountData,
        availableDiscounts,
        // refs
        containerRef,
        // handlers
        handleToggle,
        handleSelect,
        handleKeyDown,
        handleOptionKeyDown,
    };
};


