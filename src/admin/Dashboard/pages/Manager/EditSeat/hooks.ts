import { __ } from '@src/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { NavigateFunction } from 'react-router';
import { useUpdateOrderItem, type SeatOrderDetails } from '../hooks';
import type { ManagerCustomFieldData } from '../types';
import type { SeatDataWithOverride } from '../types';
import {
    buildValuesByUid,
    EDITABLE_FIELD_TYPES,
    isFieldVisible,
} from '../../../common/customFieldVisibility';
import { formatDateForInput as formatDateForInputUtil } from '../../../common/dateUtils';
import type { EditSeatOrderContextValue } from './context/EditSeatOrderContext';
import { buildOrderUpdatePayload, computeHasOrderChanges } from './utils';

export type UseEditSeatOrderFormParams = {
    orderDetails: SeatOrderDetails | null;
    seatData: SeatDataWithOverride | null;
    hasDates: boolean;
    productId: string | undefined;
    seatId: string | undefined;
    dateTime: string | undefined;
    refetchOrder: () => void;
    refetch: () => void;
    navigate: NavigateFunction;
};

export function useEditSeatOrderForm({
    orderDetails,
    seatData,
    hasDates,
    productId,
    seatId,
    dateTime,
    refetchOrder,
    refetch,
    navigate,
}: UseEditSeatOrderFormParams): EditSeatOrderContextValue | null {
    const [editedSeatId, setEditedSeatId] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [editedDiscountName, setEditedDiscountName] = useState('');
    const [editedCustomFields, setEditedCustomFields] = useState<
        Record<string, string | number | boolean>
    >({});
    const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);
    const [hasOrderChanges, setHasOrderChanges] = useState(false);

    const { updateOrderItem, loading: isOrderSaving, error: orderSaveError, clearError: clearOrderError } =
        useUpdateOrderItem();

    // Sync order data for editing
    useEffect(() => {
        if (orderDetails) {
            setEditedSeatId(orderDetails.seat_id);
            setEditedDate(orderDetails.date_time || '');
            setEditedDiscountName(orderDetails.seat_discount?.name ?? '');
            const cf = orderDetails.seat_data?.customFields ?? {};
            setEditedCustomFields(
                Object.fromEntries(
                    Object.entries(cf).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)])
                )
            );
            setHasOrderChanges(false);
        }
    }, [orderDetails]);

    // Recompute hasOrderChanges when edited values change
    useEffect(() => {
        if (!orderDetails) return;
        const changed = computeHasOrderChanges(
            orderDetails,
            editedSeatId,
            editedDate,
            editedDiscountName,
            editedCustomFields
        );
        setHasOrderChanges(changed);
    }, [editedSeatId, editedDate, editedDiscountName, editedCustomFields, orderDetails]);

    const editableCustomFields = useMemo(
        () =>
            (seatData?.customFields ?? []).filter((f) =>
                (EDITABLE_FIELD_TYPES as readonly string[]).includes(f.type)
            ),
        [seatData?.customFields]
    );

    const valuesByUid = useMemo(
        () => buildValuesByUid(editedCustomFields, editableCustomFields),
        [editedCustomFields, editableCustomFields]
    );

    const visibleCustomFields = useMemo(() => {
        // Only filter by conditions, not by mutual exclusivity
        // Mutually exclusive fields stay visible but have their values cleared
        return editableCustomFields.filter((_, index) =>
            isFieldVisible(index, editableCustomFields, valuesByUid)
        );
    }, [editableCustomFields, valuesByUid]);

    const handleSeatIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedSeatId(e.target.value);
        setOrderSuccessMessage(null);
        clearOrderError();
    }, [clearOrderError]);

    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDate(e.target.value);
        setOrderSuccessMessage(null);
        clearOrderError();
    }, [clearOrderError]);

    const handleDiscountChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditedDiscountName(e.target.value);
        setOrderSuccessMessage(null);
        clearOrderError();
    }, [clearOrderError]);

    const handleCustomFieldChange = useCallback(
        (label: string, value: string | number | boolean) => {
            setEditedCustomFields((prev) => {
                const next = { ...prev, [label]: value };
                const field = editableCustomFields.find((f) => f.label === label);
                if (!field) return next;

                // Check if the new value is empty - if so, don't clear exclusive fields
                const isEmpty =
                    value === '' ||
                    value === undefined ||
                    (typeof value === 'string' && !value.trim()) ||
                    (field.type === 'checkbox' && (value === false || value === ''));
                if (isEmpty) return next;

                // Gather all mutually exclusive fields (bidirectional)
                const uidsToClear = new Set<string>();
                const thisUid = field.uid ?? field.label;

                // Add fields that this field is exclusive with
                if (field.mutuallyExclusiveWith) {
                    field.mutuallyExclusiveWith.forEach((uid) => uidsToClear.add(uid));
                }

                // Also add fields that have this field in their exclusivity list (reverse direction)
                editableCustomFields.forEach((f) => {
                    if ((f.uid ?? f.label) !== thisUid && f.mutuallyExclusiveWith?.includes(thisUid)) {
                        uidsToClear.add(f.uid ?? f.label);
                    }
                });

                // Clear the exclusive fields
                uidsToClear.forEach((uid) => {
                    const other = editableCustomFields.find((f) => (f.uid ?? f.label) === uid);
                    if (other && other.label in next) delete next[other.label];
                });

                return next;
            });
            setOrderSuccessMessage(null);
            clearOrderError();
        },
        [editableCustomFields, clearOrderError]
    );

    const getCustomFieldValue = useCallback(
        (field: ManagerCustomFieldData): string | number | boolean => {
            const v = editedCustomFields[field.label];
            if (v !== undefined && v !== '') return v;
            if (field.type === 'checkbox') return false;
            if (field.type === 'number') return '';
            return '';
        },
        [editedCustomFields]
    );

    const formatDateForInput = useCallback((dateString: string) => formatDateForInputUtil(dateString), []);

    const handleSaveOrder = useCallback(async () => {
        if (!orderDetails) return;

        setOrderSuccessMessage(null);
        clearOrderError();

        const toastId = toast.loading(__('SAVING'));

        try {
            const updateData = buildOrderUpdatePayload(
                orderDetails,
                editedSeatId,
                editedDate,
                editedDiscountName,
                editedCustomFields,
                visibleCustomFields,
                editableCustomFields,
                seatData?.discounts
            );

            const result = await updateOrderItem(
                orderDetails.order_id,
                orderDetails.item_id,
                {
                    ...(updateData.seatId !== undefined && { seatId: updateData.seatId }),
                    ...(updateData.selectedDate !== undefined && { selectedDate: updateData.selectedDate }),
                    ...(updateData.customFields !== undefined && { customFields: updateData.customFields }),
                    ...(updateData.seatDiscount !== undefined && { seatDiscount: updateData.seatDiscount }),
                },
                orderDetails.seat_data
            );

            if (result.success) {
                toast.success(__('ORDER_UPDATED'), { id: toastId });
                setOrderSuccessMessage(__('ORDER_UPDATED'));
                setHasOrderChanges(false);

                const seatIdChanged = editedSeatId !== orderDetails.seat_id;
                const dateChanged = editedDate !== (orderDetails.date_time || '');

                if (seatIdChanged || dateChanged) {
                    const newSeatId = seatIdChanged ? editedSeatId : seatId;
                    const newDate = editedDate || dateTime;

                    if (hasDates && newDate) {
                        navigate(`/manager/product/${productId}/date/${newDate}/availability/edit/${newSeatId}`);
                    } else {
                        navigate(`/manager/product/${productId}/availability/edit/${newSeatId}`);
                    }
                } else {
                    refetchOrder();
                    refetch();
                }
            } else {
                const errorMessage = result.error || orderSaveError || __('FAILED_TO_UPDATE_ORDER');
                toast.error(errorMessage, { id: toastId });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : __('FAILED_TO_UPDATE_ORDER');
            toast.error(errorMessage, { id: toastId });
        }
    }, [
        orderDetails,
        editedSeatId,
        editedDate,
        editedDiscountName,
        editedCustomFields,
        visibleCustomFields,
        editableCustomFields,
        seatData?.discounts,
        hasDates,
        productId,
        seatId,
        dateTime,
        orderSaveError,
        updateOrderItem,
        clearOrderError,
        refetchOrder,
        refetch,
        navigate,
    ]);

    const handleResetOrder = useCallback(() => {
        if (!orderDetails) return;
        setEditedSeatId(orderDetails.seat_id);
        setEditedDate(orderDetails.date_time || '');
        setEditedDiscountName(orderDetails.seat_discount?.name ?? '');
        const cf = orderDetails.seat_data?.customFields ?? {};
        setEditedCustomFields(
            Object.fromEntries(Object.entries(cf).map(([k, v]) => [k, String(v)]))
        );
        setHasOrderChanges(false);
        clearOrderError();
    }, [orderDetails, clearOrderError]);

    return useMemo(() => {
        if (!orderDetails) return null;
        return {
            orderDetails,
            seatDataDiscounts: seatData?.discounts,
            editedSeatId,
            editedDate,
            editedDiscountName,
            editedCustomFields,
            visibleCustomFields,
            isOrderSaving,
            hasOrderChanges,
            orderSaveError,
            orderSuccessMessage,
            formatDateForInput,
            getCustomFieldValue,
            onSeatIdChange: handleSeatIdChange,
            onDateChange: handleDateChange,
            onDiscountChange: handleDiscountChange,
            onCustomFieldChange: handleCustomFieldChange,
            onSaveOrder: handleSaveOrder,
            onResetOrder: handleResetOrder,
        };
    }, [
        orderDetails,
        seatData?.discounts,
        editedSeatId,
        editedDate,
        editedDiscountName,
        editedCustomFields,
        visibleCustomFields,
        isOrderSaving,
        hasOrderChanges,
        orderSaveError,
        orderSuccessMessage,
        formatDateForInput,
        getCustomFieldValue,
        handleSeatIdChange,
        handleDateChange,
        handleDiscountChange,
        handleCustomFieldChange,
        handleSaveOrder,
        handleResetOrder,
    ]);
}
