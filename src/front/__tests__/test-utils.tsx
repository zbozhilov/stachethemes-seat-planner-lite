import React from 'react';
import { render } from '@testing-library/react';
import AddToCartContext, { AddToCartContextProps } from '../AddToCart/components/context/AddToCartContext';
import { SeatPlanDataProps, FrontCustomFieldData, FrontWorkflowObject, FrontDiscountData } from '../AddToCart/types';

/**
 * Creates a mock seat plan data structure
 */
export const createMockSeatPlanData = (overrides?: Partial<SeatPlanDataProps>): SeatPlanDataProps => {
    return {
        workflowProps: {
            width: 1000,
            height: 800,
            backgroundColor: '#000000',
        },
        objects: [],
        discounts: [],
        customFields: [],
        ...overrides,
    };
};

/**
 * Creates a mock seat object
 */
export const createMockSeat = (
    seatId: string,
    price: number = 100,
    overrides?: Partial<FrontWorkflowObject>
): FrontWorkflowObject => {
    return {
        id: 0,
        type: 'seat',
        seatId,
        price,
        move: {
            x: 0,
            y: 0,
        },
        size: {
            width: 50,
            height: 50,
        },
        label: seatId,
        color: '#000000',
        backgroundColor: '#f4f4f4',
        fontSize: 'medium',
        fontWeight: 'normal',
        isHandicap: false,
        zIndex: 0,
        ...overrides,
    } as FrontWorkflowObject;
};

/**
 * Creates a mock discount
 */
export const createMockDiscount = (
    name: string,
    type: 'percentage' | 'fixed' = 'percentage',
    value: number = 10,
    group?: string
): FrontDiscountData => {
    return {
        name,
        type,
        value,
        group,
    };
};

/**
 * Creates a mock custom field
 */
export const createMockCustomField = (
    label: string,
    type: FrontCustomFieldData['type'],
    overrides?: Partial<FrontCustomFieldData>
): FrontCustomFieldData => {
    const base: FrontCustomFieldData = {
        uid: `uid-${label}`,
        label,
        type,
        required: false,
        ...overrides,
    } as FrontCustomFieldData;

    return base;
};

/**
 * Creates a mock checkbox field
 */
export const createMockCheckboxField = (
    label: string,
    price?: number,
    checkedValue?: string,
    required: boolean = false
): FrontCustomFieldData => {
    return createMockCustomField(label, 'checkbox', {
        price,
        checkedValue,
        required,
    });
};

/**
 * Creates a mock number field
 */
export const createMockNumberField = (
    label: string,
    price?: number,
    min?: number,
    max?: number,
    required: boolean = false
): FrontCustomFieldData => {
    return createMockCustomField(label, 'number', {
        price,
        min,
        max,
        required,
    });
};

/**
 * Creates a mock select field
 */
export const createMockSelectField = (
    label: string,
    options: Array<{ label: string; price?: number }>,
    required: boolean = false
): FrontCustomFieldData => {
    return createMockCustomField(label, 'select', {
        options,
        required,
    });
};

/**
 * Creates a mock text field
 */
export const createMockTextField = (
    label: string,
    required: boolean = false
): FrontCustomFieldData => {
    return createMockCustomField(label, 'text', {
        required,
    });
};

/**
 * Creates a mock textarea field
 */
export const createMockTextareaField = (
    label: string,
    required: boolean = false
): FrontCustomFieldData => {
    return createMockCustomField(label, 'textarea', {
        required,
    });
};

/**
 * Wrapper component for testing with AddToCartContext
 */
export const TestContextProvider: React.FC<{
    value: Partial<AddToCartContextProps>;
    children: React.ReactNode;
}> = ({ value, children }) => {
    const defaultContext: AddToCartContextProps = {
        productId: 1,
        hasDate: false,
        addToCartDefaultText: 'Add to Cart',
        selectedDate: null,
        setSelectedDate: jest.fn(),
        modalOpen: false,
        setModalOpen: jest.fn(),
        showViewCartButton: false,
        setShowViewCartButton: jest.fn(),
        selectedSeats: [],
        setSelectedSeats: jest.fn(),
        seatPlanData: null,
        setSeatPlanData: jest.fn(),
        ...value,
    };

    return (
        <AddToCartContext.Provider value={defaultContext}>
            {children}
        </AddToCartContext.Provider>
    );
};

/**
 * Custom render function with context provider
 */
export const renderWithContext = (
    ui: React.ReactElement,
    contextValue?: Partial<AddToCartContextProps>
) => {
    return render(
        <TestContextProvider value={contextValue || {}}>
            {ui}
        </TestContextProvider>
    );
};
