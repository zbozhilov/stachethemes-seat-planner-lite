import { getFormattedDateTime } from '@src/utils';
import type { SeatOrderDetails, UpdateOrderItemData } from '../hooks';
import type { ManagerCustomFieldData, ManagerDiscountData } from '../types';

/**
 * Format dateTime for display (e.g. in breadcrumbs).
 */
export function formatDateTimeForDisplay(dt: string | undefined): string {
    return dt ? getFormattedDateTime(dt) : '';
}

/**
 * Compute whether the order edit form has changes compared to order details.
 */
export function computeHasOrderChanges(
    orderDetails: SeatOrderDetails | null,
    editedSeatId: string,
    editedDate: string,
    editedDiscountName: string,
    editedCustomFields: Record<string, string | number | boolean>
): boolean {
    if (!orderDetails) return false;
    const seatChanged = editedSeatId !== orderDetails.seat_id;
    const dateChanged = editedDate !== (orderDetails.date_time || '');
    const discountChanged = editedDiscountName !== (orderDetails.seat_discount?.name ?? '');
    const origCf = orderDetails.seat_data?.customFields ?? {};
    const allKeys = new Set([...Object.keys(origCf), ...Object.keys(editedCustomFields)]);
    const customFieldsChanged = [...allKeys].some(
        (k) => String(editedCustomFields[k] ?? '') !== String(origCf[k] ?? '')
    );
    return seatChanged || dateChanged || discountChanged || customFieldsChanged;
}

function getCustomFieldValueForPayload(
    field: ManagerCustomFieldData,
    editedCustomFields: Record<string, string | number | boolean>
): string | number | boolean {
    const v = editedCustomFields[field.label];
    if (v !== undefined && v !== '') return v;
    if (field.type === 'checkbox') return false;
    if (field.type === 'number') return '';
    return '';
}

/**
 * Build the order update payload from current form state.
 * Only includes keys for fields that actually changed.
 */
export function buildOrderUpdatePayload(
    orderDetails: SeatOrderDetails,
    editedSeatId: string,
    editedDate: string,
    editedDiscountName: string,
    editedCustomFields: Record<string, string | number | boolean>,
    visibleCustomFields: ManagerCustomFieldData[],
    editableCustomFields: ManagerCustomFieldData[],
    discounts: ManagerDiscountData[] | undefined
): Partial<UpdateOrderItemData> {
    const updateData: Partial<UpdateOrderItemData> = {};
    const seatIdChanged = editedSeatId !== orderDetails.seat_id;

    if (seatIdChanged) {
        updateData.seatId = editedSeatId;
    }

    if (editedDate !== (orderDetails.date_time || '')) {
        updateData.selectedDate = editedDate;
    }

    if (editedDiscountName !== (orderDetails.seat_discount?.name ?? '')) {
        const discount =
            editedDiscountName && discounts?.find((d) => d.name === editedDiscountName);
        updateData.seatDiscount =
            discount && discount.value > 0 ? discount : null;
    }

    const origCf = orderDetails.seat_data?.customFields ?? {};
    const allCfKeys = new Set([...Object.keys(origCf), ...Object.keys(editedCustomFields)]);
    const customFieldsChanged = [...allCfKeys].some(
        (k) => String(editedCustomFields[k] ?? '') !== String(origCf[k] ?? '')
    );

    if (customFieldsChanged) {
        const cf: Record<string, string> = { ...origCf };
        const visibleLabels = new Set(visibleCustomFields.map((f) => f.label));
        const editableLabels = new Set(editableCustomFields.map((f) => f.label));

        visibleCustomFields.forEach((field) => {
            const val = getCustomFieldValueForPayload(field, editedCustomFields);
            if (field.type === 'checkbox') {
                const isChecked =
                    val === true ||
                    val === '1' ||
                    val === 'yes' ||
                    (field.checkedValue && val === field.checkedValue);
                cf[field.label] = isChecked ? (field.checkedValue || 'yes') : '';
            } else if (val !== '' && val !== undefined) {
                cf[field.label] = typeof val === 'number' ? String(val) : String(val);
            } else {
                cf[field.label] = '';
            }
        });

        // Clear editable fields that are no longer visible due to conditions or mutual exclusivity
        editableCustomFields.forEach((field) => {
            if (!visibleLabels.has(field.label)) {
                cf[field.label] = '';
            }
        });

        updateData.customFields = cf;
    }

    return updateData;
}
