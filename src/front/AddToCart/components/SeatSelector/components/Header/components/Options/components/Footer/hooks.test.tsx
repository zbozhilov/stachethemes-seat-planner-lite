import React from 'react';
import { renderHook } from '@testing-library/react';
import { useTotalAfterOptions } from './hooks';
import {
    createMockSeat,
    createMockSeatPlanData,
    createMockDiscount,
    createMockCheckboxField,
    createMockNumberField,
    createMockSelectField,
    TestContextProvider,
} from '@src/front/__tests__/test-utils';
import { AddToCartContextProps } from '@src/front/AddToCart/components/context/AddToCartContext';

// Helper to render the hook with context
const renderHookWithContext = (contextValue: Partial<AddToCartContextProps>) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TestContextProvider value={contextValue}>{children}</TestContextProvider>
    );
    return renderHook(() => useTotalAfterOptions(), { wrapper });
};

describe('useTotalAfterOptions', () => {
    describe('Edge cases', () => {
        it('returns empty string when seatPlanData is null', () => {
            const { result } = renderHookWithContext({
                seatPlanData: null,
                selectedSeats: [],
            });
            expect(result.current).toBe('');
        });

        it('returns empty string when seatPlanData.objects is undefined', () => {
            const { result } = renderHookWithContext({
                seatPlanData: createMockSeatPlanData({ objects: undefined as any }),
                selectedSeats: [],
            });
            expect(result.current).toBe('');
        });

        it('returns formatted zero when no seats are selected', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [createMockSeat('A1', 100)],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: [],
            });
            expect(result.current).toBe('$0.00');
        });

        it('ignores seats with zero or negative prices', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 0),
                    createMockSeat('A2', -10),
                    createMockSeat('A3', 100),
                ],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1', 'A2', 'A3'],
            });
            expect(result.current).toBe('$100.00');
        });

        it('ignores non-seat objects', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100),
                    { type: 'text', id: 1 } as any,
                ],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });
    });

    describe('Basic seat price calculations', () => {
        it('calculates total for a single seat without discount', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [createMockSeat('A1', 100)],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });

        it('calculates total for multiple seats without discounts', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100),
                    createMockSeat('A2', 150),
                    createMockSeat('A3', 75),
                ],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1', 'A2', 'A3'],
            });
            expect(result.current).toBe('$325.00');
        });

        it('only includes selected seats in the total', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100),
                    createMockSeat('A2', 150),
                    createMockSeat('A3', 75),
                ],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1', 'A3'],
            });
            expect(result.current).toBe('$175.00');
        });
    });

    describe('Discount calculations', () => {
        it('applies percentage discount correctly', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [createMockSeat('A1', 100, { discount: 'student' })],
                discounts: [createMockDiscount('student', 'percentage', 10)],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 - (100 * 10 / 100) = 100 - 10 = 90
            expect(result.current).toBe('$90.00');
        });

        it('applies fixed discount correctly', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [createMockSeat('A1', 100, { discount: 'senior' })],
                discounts: [createMockDiscount('senior', 'fixed', 20)],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 - 20 = 80
            expect(result.current).toBe('$80.00');
        });

        it('handles multiple seats with different discounts', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, { discount: 'student' }),
                    createMockSeat('A2', 150, { discount: 'senior' }),
                    createMockSeat('A3', 75), // no discount
                ],
                discounts: [
                    createMockDiscount('student', 'percentage', 10),
                    createMockDiscount('senior', 'fixed', 20),
                ],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1', 'A2', 'A3'],
            });
            // A1: 100 - 10 = 90, A2: 150 - 20 = 130, A3: 75 = 295
            expect(result.current).toBe('$295.00');
        });

        it('defaults to percentage discount when discount type is not specified', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [createMockSeat('A1', 100, { discount: 'unknown' })],
                discounts: [{ name: 'unknown', value: 10 } as any], // missing type
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // Defaults to percentage: 100 - (100 * 10 / 100) = 90
            expect(result.current).toBe('$90.00');
        });

        it('prevents negative totals (discount larger than price)', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [createMockSeat('A1', 50, { discount: 'huge' })],
                discounts: [createMockDiscount('huge', 'fixed', 100)],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // Should be clamped to 0: Math.max(0, 50 - 100) = 0
            expect(result.current).toBe('$0.00');
        });

        it('ignores invalid discount names', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [createMockSeat('A1', 100, { discount: 'invalid' })],
                discounts: [createMockDiscount('valid', 'percentage', 10)],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // No discount applied since 'invalid' doesn't match 'valid'
            expect(result.current).toBe('$100.00');
        });
    });

    describe('Custom field options - Checkbox', () => {
        it('adds checkbox price when checked - base price 100, checkbox price 100, total should be 200', () => {
            const checkboxField = createMockCheckboxField('VIP Access', 100);
            const checkboxUid = checkboxField.uid; // Values are stored by UID, not label!
            
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [checkboxUid]: 'yes' }, // Use UID as key, not label
                    }),
                ],
                customFields: [checkboxField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 (seat) + 100 (checkbox) = 200
            expect(result.current).toBe('$200.00');
        });

        it('adds checkbox price when checked', () => {
            const checkboxField = createMockCheckboxField('VIP Access', 25);
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [checkboxField.uid]: 'yes' },
                    }),
                ],
                customFields: [checkboxField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 (seat) + 25 (checkbox) = 125
            expect(result.current).toBe('$125.00');
        });

        it('does not add checkbox price when unchecked', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: {},
                    }),
                ],
                customFields: [createMockCheckboxField('VIP Access', 25)],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });

        it('handles checkbox with custom checkedValue', () => {
            const checkboxField = createMockCheckboxField('VIP Access', 25, 'VIP');
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [checkboxField.uid]: 'VIP' },
                    }),
                ],
                customFields: [checkboxField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$125.00');
        });

        it('ignores checkbox when price is undefined', () => {
            const checkboxField = createMockCheckboxField('VIP Access'); // no price
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [checkboxField.uid]: 'yes' },
                    }),
                ],
                customFields: [checkboxField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });
    });

    describe('Custom field options - Number', () => {
        it('adds number field price multiplied by quantity', () => {
            const numberField = createMockNumberField('Quantity', 10);
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [numberField.uid]: '3' },
                    }),
                ],
                customFields: [numberField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 (seat) + (10 * 3) = 130
            expect(result.current).toBe('$130.00');
        });

        it('uses minimum value when field has positive min and value is unset', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: {},
                    }),
                ],
                customFields: [createMockNumberField('Quantity', 10, 2)], // min = 2
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 (seat) + (10 * 2) = 120 (uses min value)
            expect(result.current).toBe('$120.00');
        });

        it('clamps to maximum value when provided', () => {
            const numberField = createMockNumberField('Quantity', 10, 1, 5); // max = 5
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [numberField.uid]: '10' },
                    }),
                ],
                customFields: [numberField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 (seat) + (10 * 5) = 150 (clamped to max)
            expect(result.current).toBe('$150.00');
        });

        it('ignores number field when quantity is zero or negative', () => {
            const numberField = createMockNumberField('Quantity', 10);
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [numberField.uid]: '0' },
                    }),
                ],
                customFields: [numberField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });

        it('ignores number field when price is undefined', () => {
            const numberField = createMockNumberField('Quantity'); // no price
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [numberField.uid]: '3' },
                    }),
                ],
                customFields: [numberField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });
    });

    describe('Custom field options - Select', () => {
        it('adds select option price when option is selected', () => {
            const selectField = createMockSelectField('Upgrade', [
                { label: 'Standard', price: 0 },
                { label: 'Premium', price: 30 },
            ]);
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [selectField.uid]: 'Premium' },
                    }),
                ],
                customFields: [selectField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 (seat) + 30 (premium option) = 130
            expect(result.current).toBe('$130.00');
        });

        it('does not add select price when no option is selected', () => {
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: {},
                    }),
                ],
                customFields: [
                    createMockSelectField('Upgrade', [
                        { label: 'Standard', price: 0 },
                        { label: 'Premium', price: 30 },
                    ]),
                ],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });

        it('ignores select field when option price is undefined', () => {
            const selectField = createMockSelectField('Upgrade', [
                { label: 'Standard' }, // no price
                { label: 'Premium', price: 30 },
            ]);
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [selectField.uid]: 'Standard' },
                    }),
                ],
                customFields: [selectField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$100.00');
        });
    });

    describe('Display conditions', () => {
        it('excludes hidden fields from price calculation', () => {
            const controllerUid = 'uid-controller';
            const dependentUid = 'uid-dependent';

            const controller = createMockCheckboxField('Show upgrade', undefined, undefined, false);
            controller.uid = controllerUid;

            const dependent = createMockNumberField('Quantity', 10);
            dependent.uid = dependentUid;
            dependent.displayConditions = [{ fieldUid: controllerUid, checked: true }];

            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [dependent.uid]: '3' }, // controller is unchecked, so this should be ignored
                    }),
                ],
                customFields: [controller, dependent],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // Only seat price, dependent field is hidden
            expect(result.current).toBe('$100.00');
        });

        it('includes visible fields in price calculation', () => {
            const controllerUid = 'uid-controller';
            const dependentUid = 'uid-dependent';

            const controller = createMockCheckboxField('Show upgrade', undefined, undefined, false);
            controller.uid = controllerUid;

            const dependent = createMockNumberField('Quantity', 10);
            dependent.uid = dependentUid;
            dependent.displayConditions = [{ fieldUid: controllerUid, checked: true }];

            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: {
                            [controller.uid]: 'yes', // controller checked
                            [dependent.uid]: '3',
                        },
                    }),
                ],
                customFields: [controller, dependent],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // 100 (seat) + (10 * 3) = 130 (dependent field is visible)
            expect(result.current).toBe('$130.00');
        });
    });

    describe('Complex scenarios', () => {
        it('calculates total with multiple seats, discounts, and custom fields', () => {
            const checkboxField = createMockCheckboxField('VIP Access', 25);
            const numberField = createMockNumberField('Quantity', 10);
            const selectField = createMockSelectField('Upgrade', [
                { label: 'Standard', price: 0 },
                { label: 'Premium', price: 30 },
            ]);
            
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        discount: 'student',
                        customFields: {
                            [checkboxField.uid]: 'yes',
                            [numberField.uid]: '2',
                            [selectField.uid]: 'Premium',
                        },
                    }),
                    createMockSeat('A2', 150, {
                        discount: 'senior',
                        customFields: {
                            [checkboxField.uid]: 'yes',
                            [numberField.uid]: '1',
                        },
                    }),
                ],
                discounts: [
                    createMockDiscount('student', 'percentage', 10),
                    createMockDiscount('senior', 'fixed', 20),
                ],
                customFields: [checkboxField, numberField, selectField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1', 'A2'],
            });
            // A1: (100 - 10) + 25 + (10*2) + 30 = 90 + 25 + 20 + 30 = 165
            // A2: (150 - 20) + 25 + (10*1) = 130 + 25 + 10 = 165
            // Total: 165 + 165 = 330
            expect(result.current).toBe('$330.00');
        });

        it('handles seats with different custom field values', () => {
            const checkboxField = createMockCheckboxField('VIP Access', 25);
            const numberField = createMockNumberField('Quantity', 10);
            
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [checkboxField.uid]: 'yes', [numberField.uid]: '2' },
                    }),
                    createMockSeat('A2', 100, {
                        customFields: { [numberField.uid]: '1' }, // no VIP
                    }),
                ],
                customFields: [checkboxField, numberField],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1', 'A2'],
            });
            // A1: 100 + 25 + (10*2) = 145
            // A2: 100 + (10*1) = 110
            // Total: 145 + 110 = 255
            expect(result.current).toBe('$255.00');
        });

        it('handles field labels with whitespace correctly', () => {
            const checkboxField = createMockCheckboxField('  VIP Access  ', 25);
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [checkboxField.uid]: 'yes' }, // Use UID as key
                    }),
                ],
                customFields: [checkboxField], // field definition can have spaces
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            // Should match trimmed label
            expect(result.current).toBe('$125.00');
        });

        it('handles missing field labels by using index', () => {
            const field = createMockCheckboxField('', 25); // empty label
            const seatPlanData = createMockSeatPlanData({
                objects: [
                    createMockSeat('A1', 100, {
                        customFields: { [field.uid]: 'yes' }, // uses UID
                    }),
                ],
                customFields: [field],
            });
            const { result } = renderHookWithContext({
                seatPlanData,
                selectedSeats: ['A1'],
            });
            expect(result.current).toBe('$125.00');
        });
    });
});
