import type { ManagerCustomFieldData } from '../../../Manager/types'
import {
    buildValuesByUid,
    EDITABLE_FIELD_TYPES,
    isFieldVisible,
} from '../../../../common/customFieldVisibility'
import { formatDateForInput } from '../../../../common/dateUtils'
import type { OrderData, OrderItem, SeatData, ItemEdits } from './types'

export { formatDateForInput }
export type OrderItemUpdate = {
    item_id: number
    seat_data: SeatData
    seat_discount?: { name: string; type: 'percentage' | 'fixed'; value: number } | []
}

export function getItemValue(
    item: OrderItem,
    field: keyof SeatData,
    editedItems: Map<number, ItemEdits>
): string {
    const edited = editedItems.get(item.item_id)
    if (edited && field in edited) {
        return edited[field] as string
    }
    return (item.seat_data[field] as string) || ''
}

export function getCustomFieldValue(
    item: OrderItem,
    fieldName: string,
    editedItems: Map<number, ItemEdits>
): string {
    const edited = editedItems.get(item.item_id)
    if (edited?.customFields && fieldName in edited.customFields) {
        return edited.customFields[fieldName]
    }
    return item.seat_data.customFields?.[fieldName] || ''
}

export function getItemDiscountName(
    item: OrderItem,
    editedItems: Map<number, ItemEdits>
): string {
    const edited = editedItems.get(item.item_id)
    if (edited && 'discountName' in edited && edited.discountName !== undefined) {
        return edited.discountName
    }
    return item.seat_discount?.name ?? ''
}

export function getCustomFieldValueForField(
    item: OrderItem,
    field: ManagerCustomFieldData,
    editedItems: Map<number, ItemEdits>
): string | number | boolean {
    const v = getCustomFieldValue(item, field.label, editedItems)
    if (field.type === 'checkbox') {
        return (
            v === 'yes' ||
            v === '1' ||
            v === 'true' ||
            (!!field.checkedValue && v === field.checkedValue)
        )
    }
    if (field.type === 'number') return v === '' ? '' : (parseFloat(v) ?? 0)
    return v
}

export function getVisibleCustomFieldsForItem(
    item: OrderItem,
    getCustomFieldValueFn: (item: OrderItem, fieldName: string) => string
): ManagerCustomFieldData[] {
    const schemaFields = item.customFields || []
    const editableFields = schemaFields.filter(f =>
        (EDITABLE_FIELD_TYPES as readonly string[]).includes(f.type)
    )
    if (editableFields.length === 0) return []

    // Build values in the format expected by visibility evaluation.
    // For checkboxes, keep the actual string value (e.g., 'yes', 'vip', or checkedValue)
    // rather than converting to boolean, so that evaluateCondition can correctly
    // compare against checkedValue when present.
    const customFieldValues: Record<string, string | number | boolean> = {}
    editableFields.forEach(f => {
        const v = getCustomFieldValueFn(item, f.label)
        if (f.type === 'checkbox') {
            // Keep the actual value for visibility evaluation.
            // The value will be 'yes', field.checkedValue, or empty string.
            const isChecked =
                v === 'yes' ||
                v === '1' ||
                v === 'true' ||
                (!!f.checkedValue && v === f.checkedValue)
            // Store the appropriate checked value or true for visibility checks
            customFieldValues[f.label] = isChecked
                ? (f.checkedValue || 'yes')
                : false
        } else if (f.type === 'number') {
            customFieldValues[f.label] = v === '' ? '' : (parseFloat(v) ?? 0)
        } else {
            customFieldValues[f.label] = v
        }
    })
    const valuesByUid = buildValuesByUid(customFieldValues, editableFields)
    // Only filter by conditions, not by mutual exclusivity
    // Mutually exclusive fields stay visible but have their values cleared
    return editableFields.filter((_, i) => isFieldVisible(i, editableFields, valuesByUid))
}

/**
 * Validate all items (seat ID and date when has_dates). Returns error message or null.
 */
export function validateOrderItems(
    orderData: OrderData | null,
    getItemValueFn: (item: OrderItem, field: keyof SeatData) => string,
    getError: (key: string) => string
): string | null {
    if (!orderData) return getError('EDIT_ORDER_FETCH_ERROR')
    for (const item of orderData.items) {
        const seatId = getItemValueFn(item, 'seatId').trim()
        if (!seatId) return getError('EDIT_ORDER_EMPTY_SEAT_ID')
        if (item.has_dates) {
            const selectedDate = getItemValueFn(item, 'selectedDate').trim()
            if (!selectedDate) return getError('EDIT_ORDER_EMPTY_DATE')
        }
    }
    return null
}

/** Build API payload from orderData and editedItems. */
export function buildOrderItemUpdates(
    orderData: OrderData,
    editedItems: Map<number, ItemEdits>,
    getCustomFieldValueFn: (item: OrderItem, fieldName: string) => string
): OrderItemUpdate[] {
    const updates: OrderItemUpdate[] = []
    editedItems.forEach((changes, itemId) => {
        const originalItem = orderData.items.find(item => item.item_id === itemId)
        if (!originalItem) return

        const { discountName: _discountName, ...seatChanges } = changes

        // Build base custom fields from original + changes
        const mergedCustomFields: Record<string, string> = {
            ...(originalItem.seat_data.customFields || {}),
            ...(seatChanges.customFields || {}),
        }

        // Get visible fields to determine which editable fields should be cleared
        const visibleFields = getVisibleCustomFieldsForItem(originalItem, getCustomFieldValueFn)
        const visibleLabels = new Set(visibleFields.map(f => f.label))

        // Get all editable fields
        const schemaFields = originalItem.customFields || []
        const editableFields = schemaFields.filter(f =>
            (EDITABLE_FIELD_TYPES as readonly string[]).includes(f.type)
        )

        // Clear editable fields that are not visible (hidden by conditions or mutual exclusivity)
        editableFields.forEach(field => {
            if (!visibleLabels.has(field.label)) {
                mergedCustomFields[field.label] = ''
            }
        })

        const updatedSeatData: SeatData = {
            ...originalItem.seat_data,
            ...seatChanges,
            customFields: mergedCustomFields,
        }

        const discountName = 'discountName' in changes ? changes.discountName : undefined
        let seatDiscount: { name: string; type: 'percentage' | 'fixed'; value: number } | [] | undefined
        if (discountName !== undefined) {
            const selectedDiscount = originalItem.discounts?.find(d => d.name === discountName)
            seatDiscount =
                selectedDiscount && selectedDiscount.value > 0
                    ? { name: selectedDiscount.name, type: selectedDiscount.type, value: selectedDiscount.value }
                    : []
        }

        const update: OrderItemUpdate = {
            item_id: itemId,
            seat_data: updatedSeatData,
        }
        if (seatDiscount !== undefined) {
            update.seat_discount = seatDiscount
        }
        updates.push(update)
    })
    return updates
}
