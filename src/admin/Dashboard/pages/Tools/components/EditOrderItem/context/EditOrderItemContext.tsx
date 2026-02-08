import { createContext, useContext, type ReactNode } from 'react'
import type { OrderData, OrderItem, SeatData } from '../types'
import { ManagerCustomFieldData } from '@src/admin/Dashboard/pages/Manager/types'

export type EditOrderItemContextValue = {
    orderData: OrderData
    error: string
    successMessage: string
    getItemValue: (item: OrderItem, field: keyof SeatData) => string
    getCustomFieldValueForField: (item: OrderItem, field: ManagerCustomFieldData) => string | number | boolean
    getItemDiscountName: (item: OrderItem) => string
    getVisibleCustomFieldsForItem: (item: OrderItem) => ManagerCustomFieldData[]
    onItemChange: (itemId: number, field: keyof SeatData, value: string) => void
    onCustomFieldChange: (itemId: number, fieldName: string, value: string | number | boolean) => void
    onDiscountChange: (itemId: number, discountName: string) => void
    formatDateForInput: (dateString: string) => string
    hasChanges: boolean
    isSaving: boolean
    sendNotifications: boolean
    onSendNotificationsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSave: () => void
}

const EditOrderItemContext = createContext<EditOrderItemContextValue | null>(null)

export type EditOrderItemProviderProps = {
    value: EditOrderItemContextValue
    children: ReactNode
}

export const EditOrderItemProvider = ({ value, children }: EditOrderItemProviderProps) => (
    <EditOrderItemContext.Provider value={value}>
        {children}
    </EditOrderItemContext.Provider>
)

export const useEditOrderItemContext = (): EditOrderItemContextValue => {
    const ctx = useContext(EditOrderItemContext)
    if (ctx === null) {
        throw new Error('useEditOrderItemContext must be used within EditOrderItemProvider')
    }
    return ctx
}
