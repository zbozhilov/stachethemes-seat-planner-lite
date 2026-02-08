import { createContext, useContext, type ReactNode } from 'react';
import type { SeatOrderDetails } from '../../hooks';
import type { ManagerCustomFieldData, ManagerDiscountData } from '../../types';

export type EditSeatOrderContextValue = {
    orderDetails: SeatOrderDetails;
    seatDataDiscounts: ManagerDiscountData[] | undefined;
    editedSeatId: string;
    editedDate: string;
    editedDiscountName: string;
    editedCustomFields: Record<string, string | number | boolean>;
    sendNotifications: boolean;
    visibleCustomFields: ManagerCustomFieldData[];
    isOrderSaving: boolean;
    hasOrderChanges: boolean;
    orderSaveError: string | null;
    orderSuccessMessage: string | null;
    formatDateForInput: (dateString: string) => string;
    getCustomFieldValue: (field: ManagerCustomFieldData) => string | number | boolean;
    onSeatIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDiscountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onCustomFieldChange: (label: string, value: string | number | boolean) => void;
    onSendNotificationsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveOrder: () => void;
    onResetOrder: () => void;
};

const EditSeatOrderContext = createContext<EditSeatOrderContextValue | null>(null);

export type EditSeatOrderProviderProps = {
    value: EditSeatOrderContextValue;
    children: ReactNode;
};

export const EditSeatOrderProvider = ({ value, children }: EditSeatOrderProviderProps) => {
    return (
        <EditSeatOrderContext.Provider value={value}>
            {children}
        </EditSeatOrderContext.Provider>
    );
};

export const useEditSeatOrderContext = (): EditSeatOrderContextValue => {
    const ctx = useContext(EditSeatOrderContext);
    if (ctx === null) {
        throw new Error('useEditSeatOrderContext must be used within EditSeatOrderProvider');
    }
    return ctx;
};
