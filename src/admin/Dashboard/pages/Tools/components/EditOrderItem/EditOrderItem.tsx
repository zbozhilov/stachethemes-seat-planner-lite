import { useState, useCallback } from 'react'
import Container from '../../../../layout/Container/Container'
import Button from '../../../../layout/Button/Button'
import Input from '../../../../layout/Input/Input'
import Notes from '../../../../layout/Notes/Notes'
import InfoBox from '../../../../layout/InfoBox/InfoBox'
import { __ } from '@src/utils'
import './EditOrderItem.scss'

type SeatData = {
    seatId: string
    selectedDate: string
    customFields?: Record<string, string>
    qr_code?: string
    qr_code_secret?: string
    qr_code_scanned?: boolean
    qr_code_scanned_author?: number
    qr_code_scanned_timestamp?: number
}

type OrderItem = {
    item_id: number
    product_id: number
    product_name: string
    seat_data: SeatData
    seat_discount?: {
        name: string
        value: number
        type: 'percentage' | 'fixed'
    }
    has_dates: boolean
}

type OrderData = {
    order_id: number
    order_status: string
    items: OrderItem[]
}

const EditOrderItem = () => {
    const [orderId, setOrderId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [editedItems, setEditedItems] = useState<Map<number, Partial<SeatData>>>(new Map())

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
        } catch (err) {
            setError(__('EDIT_ORDER_FETCH_ERROR'))
        } finally {
            setIsLoading(false)
        }
    }, [orderId])

    const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderId(e.target.value)
        if (error) setError('')
        if (successMessage) setSuccessMessage('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            fetchOrderItems()
        }
    }

    const handleItemChange = (itemId: number, field: keyof SeatData, value: string) => {
        setEditedItems(prev => {
            const newMap = new Map(prev)
            const existing = newMap.get(itemId) || {}
            newMap.set(itemId, { ...existing, [field]: value })
            return newMap
        })
        if (successMessage) setSuccessMessage('')
    }

    const handleCustomFieldChange = (itemId: number, fieldName: string, value: string) => {
        setEditedItems(prev => {
            const newMap = new Map(prev)
            const existing = newMap.get(itemId) || {}
            const customFields = { ...(existing.customFields || {}), [fieldName]: value }
            newMap.set(itemId, { ...existing, customFields })
            return newMap
        })
        if (successMessage) setSuccessMessage('')
    }

    const getItemValue = (item: OrderItem, field: keyof SeatData): string => {
        const edited = editedItems.get(item.item_id)
        if (edited && field in edited) {
            return edited[field] as string
        }
        return (item.seat_data[field] as string) || ''
    }

    const getCustomFieldValue = (item: OrderItem, fieldName: string): string => {
        const edited = editedItems.get(item.item_id)
        if (edited?.customFields && fieldName in edited.customFields) {
            return edited.customFields[fieldName]
        }
        return item.seat_data.customFields?.[fieldName] || ''
    }

    const hasChanges = (): boolean => {
        return editedItems.size > 0
    }

    const validateItems = (): string | null => {
        if (!orderData) return __('EDIT_ORDER_FETCH_ERROR')

        for (const item of orderData.items) {
            const seatId = getItemValue(item, 'seatId').trim()
            if (!seatId) {
                return __('EDIT_ORDER_EMPTY_SEAT_ID')
            }
        }
        return null
    }

    const saveChanges = async () => {
        if (!orderData || !hasChanges()) return

        // Validate items
        const validationError = validateItems()
        if (validationError) {
            setError(validationError)
            return
        }

        setIsSaving(true)
        setError('')
        setSuccessMessage('')

        try {
            // Prepare updates - merge edited fields with original seat_data
            const updates: { item_id: number; seat_data: SeatData }[] = []

            editedItems.forEach((changes, itemId) => {
                const originalItem = orderData.items.find(item => item.item_id === itemId)
                if (!originalItem) return

                const updatedSeatData: SeatData = {
                    ...originalItem.seat_data,
                    ...changes,
                    customFields: {
                        ...(originalItem.seat_data.customFields || {}),
                        ...(changes.customFields || {})
                    }
                }

                updates.push({
                    item_id: itemId,
                    seat_data: updatedSeatData
                })
            })

            const response = await fetch(window.stachesepl_ajax.ajax_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    action: 'seatplanner',
                    task: 'update_order_item_meta',
                    order_id: orderData.order_id.toString(),
                    updates: JSON.stringify(updates),
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

            // Refresh order data without clearing the success message
            await fetchOrderItems({ preserveMessages: true })
        } catch (err) {
            setError(__('EDIT_ORDER_SAVE_ERROR'))
        } finally {
            setIsSaving(false)
        }
    }

    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return ''
        // Convert from 'YYYY-MM-DDTHH:MM' format to datetime-local input format
        return dateString.substring(0, 16)
    }

    const renderOrderItem = (item: OrderItem) => {
        const customFields = item.seat_data.customFields || {}
        const customFieldNames = Object.keys(customFields)

        return (
            <div key={item.item_id} className="stachesepl-eoi-item">
                <div className="stachesepl-eoi-item-header">
                    <div className="stachesepl-eoi-item-product">
                        <span className="stachesepl-eoi-item-name">{item.product_name}</span>
                        <span className="stachesepl-eoi-item-id">
                            {__('EDIT_ORDER_ITEM_ID')}: #{item.item_id}
                        </span>
                    </div>
                    <a
                        href={`${window.stachesepl_admin_url.admin_url}post.php?post=${item.product_id}&action=edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="stachesepl-eoi-item-product-link"
                    >
                        {__('EDIT_ORDER_VIEW_PRODUCT')}
                    </a>
                </div>

                <div className="stachesepl-eoi-item-fields">
                    <div className="stachesepl-eoi-field">
                        <Input
                            label={__('SEAT_ID')}
                            value={getItemValue(item, 'seatId')}
                            onChange={(e) => handleItemChange(item.item_id, 'seatId', e.target.value)}
                        />
                    </div>

                </div>

                {item.seat_data.qr_code_scanned && (
                    <div className="stachesepl-eoi-item-scanned">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>{__('EDIT_ORDER_TICKET_SCANNED')}</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <Container>
            <div className="stachesepl-eoi">
                <InfoBox
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    }
                    title={__('EDIT_ORDER_TITLE')}
                    description={__('EDIT_ORDER_DESCRIPTION')}
                />

                <div className="stachesepl-eoi-search">
                    <div className="stachesepl-eoi-search-input">
                        <Input
                            type="number"
                            label={__('ORDER_ID')}
                            placeholder={__('EDIT_ORDER_ORDER_ID_PLACEHOLDER')}
                            value={orderId}
                            onChange={handleOrderIdChange}
                            onKeyDown={handleKeyDown}
                            error={!orderData ? error : ''}
                            min={1}
                        />
                    </div>
                    <Button onClick={fetchOrderItems} disabled={isLoading}>
                        {isLoading ? __('EDIT_ORDER_LOADING') : __('EDIT_ORDER_SEARCH')}
                    </Button>
                </div>

                {orderData && (
                    <div className="stachesepl-eoi-order">
                        <div className="stachesepl-eoi-order-header">
                            <div className="stachesepl-eoi-order-info">
                                <h3>
                                    {__('EDIT_ORDER_ORDER_NUMBER').replace('%s', orderData.order_id.toString())}
                                </h3>
                                <span className={`stachesepl-eoi-status stachesepl-eoi-status--${orderData.order_status}`}>
                                    {orderData.order_status}
                                </span>
                            </div>
                            <a
                                href={`${window.stachesepl_admin_url.admin_url}post.php?post=${orderData.order_id}&action=edit`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="stachesepl-eoi-order-link"
                            >
                                {__('VIEW_ORDER')}
                            </a>
                        </div>

                        <div className="stachesepl-eoi-items">
                            {orderData.items.map(renderOrderItem)}
                        </div>

                        {error && (
                            <div className="stachesepl-eoi-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="stachesepl-eoi-success">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <div className="stachesepl-eoi-actions">
                            <Button
                                onClick={saveChanges}
                                disabled={!hasChanges() || isSaving}
                            >
                                {isSaving ? __('SAVING') : __('EDIT_ORDER_SAVE_CHANGES')}
                            </Button>
                        </div>
                    </div>
                )}

                <Notes title={__('EDIT_ORDER_NOTES_TITLE')}>
                    <li>{__('EDIT_ORDER_NOTE_1')}</li>
                    <li>{__('EDIT_ORDER_NOTE_2')}</li>
                    <li>{__('EDIT_ORDER_NOTE_3')}</li>
                    <li>{__('EDIT_ORDER_NOTE_4')}</li>
                </Notes>
            </div>
        </Container>
    )
}

export default EditOrderItem
