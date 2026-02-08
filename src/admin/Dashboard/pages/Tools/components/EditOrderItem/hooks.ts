import { useState, useCallback } from 'react'
import { __ } from '@src/utils'
import type { ManagerCustomFieldData } from '../../../Manager/types'
import type { OrderData, OrderItem, SeatData, ItemEdits } from './types'
import {
    formatDateForInput as formatDateForInputUtil,
    getItemValue as getItemValueUtil,
    getCustomFieldValue as getCustomFieldValueUtil,
    getItemDiscountName as getItemDiscountNameUtil,
    getCustomFieldValueForField as getCustomFieldValueForFieldUtil,
    getVisibleCustomFieldsForItem as getVisibleCustomFieldsForItemUtil,
    validateOrderItems,
    buildOrderItemUpdates,
} from './utils'

export function useEditOrderItem() {
    const [orderId, setOrderId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [editedItems, setEditedItems] = useState<Map<number, ItemEdits>>(new Map())
    const [sendNotifications, setSendNotifications] = useState(true)

    const fetchOrderItems = useCallback(async (options?: { preserveMessages?: boolean }) => {
        const orderIdNum = parseInt(orderId, 10)
        if (!orderId || isNaN(orderIdNum) || orderIdNum <= 0) {
            setError(__('EDIT_ORDER_INVALID_ORDER_ID'))
            return
        }

        setIsLoading(true)
        if (!options?.preserveMessages) {
            setError('')
            setSuccessMessage('')
            setOrderData(null)
        }
        setEditedItems(new Map())

        try {
            const response = await fetch(window.stachesepl_ajax.ajax_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    action: 'seatplanner',
                    task: 'get_order_auditorium_items',
                    order_id: orderIdNum.toString(),
                    nonce: window.stachesepl_ajax.nonce,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.data?.error || __('EDIT_ORDER_FETCH_ERROR'))
                return
            }

            if (!data.data.items || data.data.items.length === 0) {
                setError(__('EDIT_ORDER_NO_ITEMS'))
                return
            }

            setOrderData(data.data)
        } catch {
            setError(__('EDIT_ORDER_FETCH_ERROR'))
        } finally {
            setIsLoading(false)
        }
    }, [orderId])

    const handleOrderIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderId(e.target.value)
        setError('')
        setSuccessMessage('')
    }, [])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                fetchOrderItems()
            }
        },
        [fetchOrderItems]
    )

    const handleItemChange = useCallback((itemId: number, field: keyof SeatData, value: string) => {
        setEditedItems(prev => {
            const newMap = new Map(prev)
            const existing = newMap.get(itemId) || {}
            newMap.set(itemId, { ...existing, [field]: value })
            return newMap
        })
        setSuccessMessage(prev => (prev ? '' : prev))
    }, [])

    const handleCustomFieldChange = useCallback(
        (itemId: number, fieldName: string, value: string | number | boolean) => {
            const strValue = typeof value === 'boolean' ? (value ? 'yes' : '') : String(value)
            setEditedItems(prev => {
                const newMap = new Map(prev)
                const existing = newMap.get(itemId) || {}
                const customFields = { ...(existing.customFields || {}), [fieldName]: strValue }

                // Clear mutually exclusive fields (bidirectional)
                const item = orderData?.items.find(i => i.item_id === itemId)
                if (item?.customFields) {
                    const field = item.customFields.find(f => f.label === fieldName)
                    if (field) {
                        // Check if the new value is empty - if so, don't clear exclusive fields
                        const isEmpty =
                            strValue === '' ||
                            (field.type === 'checkbox' && (value === false || strValue === ''))
                        
                        if (!isEmpty) {
                            const thisUid = field.uid ?? field.label
                            const uidsToClear = new Set<string>()

                            // Add fields that this field is exclusive with
                            if (field.mutuallyExclusiveWith) {
                                field.mutuallyExclusiveWith.forEach(uid => uidsToClear.add(uid))
                            }

                            // Also clear fields that have this field in their mutuallyExclusiveWith (reverse direction)
                            item.customFields.forEach(f => {
                                if ((f.uid ?? f.label) !== thisUid && f.mutuallyExclusiveWith?.includes(thisUid)) {
                                    uidsToClear.add(f.uid ?? f.label)
                                }
                            })

                            uidsToClear.forEach(uid => {
                                const other = item.customFields?.find(f => (f.uid ?? f.label) === uid)
                                if (other) {
                                    customFields[other.label] = ''
                                }
                            })
                        }
                    }
                }

                newMap.set(itemId, { ...existing, customFields })
                return newMap
            })
            setSuccessMessage(prev => (prev ? '' : prev))
        },
        [orderData]
    )

    const handleDiscountChange = useCallback((itemId: number, discountName: string) => {
        setEditedItems(prev => {
            const newMap = new Map(prev)
            const existing = newMap.get(itemId) || {}
            newMap.set(itemId, { ...existing, discountName })
            return newMap
        })
        setSuccessMessage(prev => (prev ? '' : prev))
    }, [])

    const getItemValue = useCallback(
        (item: OrderItem, field: keyof SeatData) => getItemValueUtil(item, field, editedItems),
        [editedItems]
    )

    const getCustomFieldValue = useCallback(
        (item: OrderItem, fieldName: string) => getCustomFieldValueUtil(item, fieldName, editedItems),
        [editedItems]
    )

    const getItemDiscountName = useCallback(
        (item: OrderItem) => getItemDiscountNameUtil(item, editedItems),
        [editedItems]
    )

    const getCustomFieldValueForField = useCallback(
        (item: OrderItem, field: ManagerCustomFieldData) =>
            getCustomFieldValueForFieldUtil(item, field, editedItems),
        [editedItems]
    )

    const getVisibleCustomFieldsForItem = useCallback(
        (item: OrderItem) => getVisibleCustomFieldsForItemUtil(item, getCustomFieldValue),
        [getCustomFieldValue]
    )

    const hasChanges = editedItems.size > 0

    const validateItems = useCallback(
        () => validateOrderItems(orderData, getItemValue, __),
        [orderData, getItemValue]
    )

    const saveChanges = useCallback(async () => {
        if (!orderData || !hasChanges) return

        const validationError = validateItems()
        if (validationError) {
            setError(validationError)
            return
        }

        setIsSaving(true)
        setError('')
        setSuccessMessage('')

        try {
            const updates = buildOrderItemUpdates(orderData, editedItems, getCustomFieldValue)
            const response = await fetch(window.stachesepl_ajax.ajax_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    action: 'seatplanner',
                    task: 'update_order_item_meta',
                    order_id: orderData.order_id.toString(),
                    updates: JSON.stringify(updates),
                    send_notifications: sendNotifications ? 'yes' : 'no',
                    nonce: window.stachesepl_ajax.nonce,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.data?.error || __('EDIT_ORDER_SAVE_ERROR'))
                return
            }

            setSuccessMessage(__('EDIT_ORDER_SAVE_SUCCESS'))
            setEditedItems(new Map())
            await fetchOrderItems({ preserveMessages: true })
        } catch {
            setError(__('EDIT_ORDER_SAVE_ERROR'))
        } finally {
            setIsSaving(false)
        }
    }, [orderData, editedItems, hasChanges, validateItems, fetchOrderItems, sendNotifications])

    const handleSendNotificationsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSendNotifications(e.target.checked)
    }, [])

    return {
        orderId,
        handleOrderIdChange,
        handleKeyDown,
        fetchOrderItems,
        isLoading,
        isSaving,
        error,
        successMessage,
        orderData,
        getItemValue,
        getCustomFieldValue,
        getItemDiscountName,
        getCustomFieldValueForField,
        getVisibleCustomFieldsForItem,
        handleItemChange,
        handleCustomFieldChange,
        handleDiscountChange,
        handleSendNotificationsChange,
        formatDateForInput: formatDateForInputUtil,
        hasChanges,
        saveChanges,
        sendNotifications,
    }
}
