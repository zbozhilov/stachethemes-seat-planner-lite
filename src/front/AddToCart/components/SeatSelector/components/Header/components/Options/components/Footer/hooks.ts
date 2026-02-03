import { useMemo } from 'react';
import { getFormattedPrice } from '@src/utils';
import { useCustomFields, useDiscounts, useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { isFieldVisible } from '../CustomFields/utils';

export const useTotalAfterOptions = (): string => {
    const { seatPlanData } = useSeatPlanData();
    const { selectedSeats } = useSelectedSeats();
    const { discounts } = useDiscounts();
    const { customFields } = useCustomFields();

    return useMemo(() => {
        if (!seatPlanData?.objects) {
            return '';
        }

        const seats = seatPlanData.objects.filter((object) => object.type === 'seat');

        // Create Maps for O(1) lookups instead of O(n) find operations
        const seatMap = new Map<string, typeof seats[0]>();
        seats.forEach((seat) => {
            if (seat.seatId) {
                seatMap.set(seat.seatId, seat);
            }
        });

        const discountMap = new Map<string, typeof discounts[0]>();
        discounts.forEach((discount) => {
            if (discount.name) {
                discountMap.set(discount.name, discount);
            }
        });

        const baseTotalAfterDiscounts = selectedSeats.reduce((acc, seatId) => {
            const seat = seatMap.get(seatId);
            if (!seat) return acc;

            const seatPrice = seat.price || 0;
            if (seatPrice <= 0) return acc;

            const seatDiscountName = seat.discount || '';
            const discount = discountMap.get(seatDiscountName);
            const seatDiscountType = discount?.type || 'percentage';
            const seatDiscountValue = discount?.value || 0;

            const { price } = seat;

            if (seatDiscountType === 'percentage') {
                return Math.max(0, acc + (price - (price * seatDiscountValue / 100)));
            }

            return Math.max(0, acc + (price - seatDiscountValue));
        }, 0);

        // Create option maps for each select field to avoid O(n) finds
        const selectFieldOptionMaps = new Map<number, Map<string, { label: string; price?: number }>>();
        customFields.forEach((field, index) => {
            if (field.type === 'select' && field.options) {
                const optionMap = new Map<string, { label: string; price?: number }>();
                field.options.forEach((opt) => {
                    if (opt.label) {
                        optionMap.set(opt.label, opt);
                    }
                });
                selectFieldOptionMaps.set(index, optionMap);
            }
        });

        const optionsTotal = selectedSeats.reduce((acc, seatId) => {
            const seat = seatMap.get(seatId);
            if (!seat) return acc;

            const seatCustomFields = seat.customFields || {};

            const seatOptionsTotal = customFields.reduce((fieldAcc, field, index) => {
                // Skip price calculation if field is not visible due to display conditions
                if (!isFieldVisible(index, customFields, seatCustomFields)) {
                    return fieldAcc;
                }

                // Values are stored by UID, not by label
                const fieldUid = field.uid;
                const rawValue = seatCustomFields[fieldUid];

                switch (field.type) {
                    case 'checkbox': {
                        const unitPrice = field.price;
                        if (unitPrice === undefined || unitPrice === null) return fieldAcc;

                        const checkedValue = field.checkedValue?.trim() || '';
                        const isChecked = checkedValue
                            ? rawValue === checkedValue
                            : rawValue === 'yes' || rawValue === true;

                        return isChecked ? fieldAcc + unitPrice : fieldAcc;
                    }

                    case 'number': {
                        const unitPrice = field.price;
                        if (unitPrice === undefined || unitPrice === null) return fieldAcc;

                        const parsed =
                            rawValue === undefined || rawValue === null ? null : Number(String(rawValue).trim());
                        let quantity = parsed !== null && Number.isFinite(parsed) ? parsed : null;

                        // If the field enforces a positive min, treat "unset" as min to match the UI (which displays min).
                        if (quantity === null) {
                            const min = field.min;
                            if (min !== undefined && min !== null && Number.isFinite(min) && min > 0) {
                                quantity = min;
                            }
                        }

                        // Clamp to max when present.
                        if (quantity !== null) {
                            const max = field.max;
                            if (max !== undefined && max !== null && Number.isFinite(max)) {
                                quantity = Math.min(quantity, max);
                            }
                        }

                        if (quantity === null || quantity <= 0) return fieldAcc;

                        return fieldAcc + (unitPrice * quantity);
                    }

                    case 'select': {
                        const selectedLabel = rawValue === undefined || rawValue === null ? '' : String(rawValue);
                        if (!selectedLabel) return fieldAcc;

                        const optionMap = selectFieldOptionMaps.get(index);
                        const option = optionMap?.get(selectedLabel);
                        const optionPrice = option?.price;
                        if (optionPrice === undefined || optionPrice === null) return fieldAcc;

                        return fieldAcc + optionPrice;
                    }

                    default:
                        return fieldAcc;
                }
            }, 0);

            return acc + seatOptionsTotal;
        }, 0);

        return getFormattedPrice(baseTotalAfterDiscounts + optionsTotal);
    }, [customFields, selectedSeats, discounts, seatPlanData]);
};

