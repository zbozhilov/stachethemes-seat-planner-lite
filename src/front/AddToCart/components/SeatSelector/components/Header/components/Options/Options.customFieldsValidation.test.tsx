import React, { useMemo, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { SeatPlanDataProps } from '@src/front/AddToCart/types';
import AddToCartContext, { AddToCartContextProps } from '@src/front/AddToCart/components/context/AddToCartContext';
import OptionsContainer from './Options';
import {
    createMockSeat,
    createMockSeatPlanData,
    createMockTextField,
    createMockCheckboxField,
    createMockNumberField,
} from '@src/front/__tests__/test-utils';

jest.mock('@src/front/AddToCart/ajax/addSeatsToCart', () => ({
    __esModule: true,
    default: jest.fn(async () => ({ success: true, data: {} })),
}));

jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const StatefulAddToCartProvider: React.FC<{
    initialSeatPlanData: SeatPlanDataProps;
    initialSelectedSeats: string[];
    children: React.ReactNode;
}> = ({ initialSeatPlanData, initialSelectedSeats, children }) => {
    const [seatPlanData, setSeatPlanData] = useState<SeatPlanDataProps | null>(initialSeatPlanData);
    const [selectedSeats, setSelectedSeats] = useState<string[]>(initialSelectedSeats);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const value: AddToCartContextProps = useMemo(() => ({
        productId: 1,
        hasDate: false,
        addToCartDefaultText: 'Add to Cart',
        selectedDate,
        setSelectedDate,
        modalOpen: true,
        setModalOpen: jest.fn(),
        showViewCartButton: false,
        setShowViewCartButton: jest.fn(),
        selectedSeats,
        setSelectedSeats,
        seatPlanData,
        setSeatPlanData,
    }), [seatPlanData, selectedSeats, selectedDate]);

    return (
        <AddToCartContext.Provider value={value}>
            {children}
        </AddToCartContext.Provider>
    );
};

const renderOptions = (args: { seatPlanData: SeatPlanDataProps; selectedSeats: string[] }) => {
    return render(
        <StatefulAddToCartProvider
            initialSeatPlanData={args.seatPlanData}
            initialSelectedSeats={args.selectedSeats}
        >
            <OptionsContainer />
        </StatefulAddToCartProvider>
    );
};

describe('Custom fields validation (front-end)', () => {
    it('blocks add to cart and shows required error for a required text field', async () => {
        const seatId = 'A1';
        const seatPlanData = createMockSeatPlanData({
            objects: [createMockSeat(seatId, 100, { customFields: {} })],
            customFields: [
                createMockTextField('Name', true /* required */),
            ],
        });

        renderOptions({ seatPlanData, selectedSeats: [seatId] });

        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        expect(await screen.findByText('This field is required')).toBeTruthy();
    });

    it('validates mutually exclusive required groups: at least one value satisfies the group', async () => {
        const seatId = 'A1';
        const fieldAUid = 'uid-a';
        const fieldBUid = 'uid-b';

        const fieldA = createMockTextField('Field A', true);
        fieldA.uid = fieldAUid;
        fieldA.mutuallyExclusiveWith = [fieldBUid];

        const fieldB = createMockTextField('Field B', true);
        fieldB.uid = fieldBUid;
        fieldB.mutuallyExclusiveWith = [fieldAUid];

        const seatPlanData = createMockSeatPlanData({
            objects: [createMockSeat(seatId, 100, { customFields: {} })],
            customFields: [fieldA, fieldB],
        });

        renderOptions({ seatPlanData, selectedSeats: [seatId] });

        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
        const errors = await screen.findAllByText('This field is required');
        expect(errors).toHaveLength(2);

        const textboxes = screen.getAllByRole('textbox');
        fireEvent.change(textboxes[0], { target: { value: 'hello' } });
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        await waitFor(() => {
            expect(screen.queryByText('This field is required')).toBeNull();
        });
    });

    it('does not block submission for required fields that are hidden by display conditions', async () => {
        const seatId = 'A1';
        const controllerUid = 'uid-controller';

        const controller = createMockCheckboxField('Show details?', undefined, undefined, false);
        controller.uid = controllerUid;

        const dependent = createMockTextField('Details', true);
        dependent.displayConditions = [{ fieldUid: controllerUid, checked: true }];

        const seatPlanData = createMockSeatPlanData({
            objects: [createMockSeat(seatId, 100, { customFields: {} })],
            customFields: [controller, dependent],
        });

        renderOptions({ seatPlanData, selectedSeats: [seatId] });

        // Dependent field should not render since controller is unchecked by default.
        expect(screen.queryAllByRole('textbox')).toHaveLength(0);

        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        await waitFor(() => {
            expect(screen.queryByText('This field is required')).toBeNull();
        });
    });

    it('validates required checkbox fields with checkedValue by comparing against checkedValue', async () => {
        const seatId = 'A1';
        const seatPlanData = createMockSeatPlanData({
            objects: [createMockSeat(seatId, 100, { customFields: {} })],
            customFields: [
                createMockCheckboxField('VIP', undefined, 'VIP', true),
            ],
        });

        renderOptions({ seatPlanData, selectedSeats: [seatId] });

        // Not checked => required error
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
        expect(await screen.findByText('This field is required')).toBeTruthy();

        // Click checkbox wrapper to toggle on (stores "VIP")
        fireEvent.click(screen.getByText('VIP'));
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        await waitFor(() => {
            expect(screen.queryByText('This field is required')).toBeNull();
        });
    });

    it('enables/disables add-to-cart for a required dependent checkbox controlled by a parent checkbox display condition', async () => {
        const seatId = 'A1';
        const controllerUid = 'uid-controller';
        const dependentUid = 'uid-dependent';

        const controllerLabel = 'Enable dependent';
        const dependentLabel = 'Dependent (required)';

        const controller = createMockCheckboxField(controllerLabel, undefined, undefined, false);
        controller.uid = controllerUid;

        const dependent = createMockCheckboxField(dependentLabel, undefined, undefined, true);
        dependent.uid = dependentUid;
        dependent.displayConditions = [{ fieldUid: controllerUid, checked: true }];

        const seatPlanData = createMockSeatPlanData({
            objects: [createMockSeat(seatId, 100, { customFields: {} })],
            customFields: [controller, dependent],
        });

        renderOptions({ seatPlanData, selectedSeats: [seatId] });

        const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

        // 1) Checkbox B is hidden (A unchecked), so add-to-cart should be enabled.
        expect(screen.queryByText(dependentLabel)).toBeNull();
        await waitFor(() => {
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });

        // 2) Check A => B becomes visible and required; since B is unchecked, add-to-cart should be disabled.
        fireEvent.click(screen.getByText(controllerLabel));
        expect(await screen.findByText(dependentLabel)).toBeTruthy();
        await waitFor(() => {
            expect(addToCartButton.className).toContain('stachesepl-add-to-cart-button-disabled');
        });

        // 3) Check B => satisfies required, add-to-cart enabled.
        fireEvent.click(screen.getByText(dependentLabel));
        await waitFor(() => {
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });

        // 4) Uncheck B => required again unmet, add-to-cart disabled.
        fireEvent.click(screen.getByText(dependentLabel));
        await waitFor(() => {
            expect(addToCartButton.className).toContain('stachesepl-add-to-cart-button-disabled');
        });

        // Re-check B, then uncheck A so B becomes hidden; hidden required fields should not block.
        fireEvent.click(screen.getByText(dependentLabel));
        await waitFor(() => {
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });

        fireEvent.click(screen.getByText(controllerLabel));
        await waitFor(() => {
            expect(screen.queryByText(dependentLabel)).toBeNull();
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });
    });

    it('enables/disables add-to-cart for a required dependent number field controlled by a parent checkbox display condition', async () => {
        const seatId = 'A1';
        const controllerUid = 'uid-controller';
        const dependentUid = 'uid-dependent';

        const controllerLabel = 'Enable dependent';
        const dependentLabel = 'Dependent (required)';

        const controller = createMockCheckboxField(controllerLabel, undefined, undefined, false);
        controller.uid = controllerUid;

        const dependent = createMockNumberField(dependentLabel, undefined, undefined, undefined, true);
        dependent.uid = dependentUid;
        dependent.displayConditions = [{ fieldUid: controllerUid, checked: true }];

        const seatPlanData = createMockSeatPlanData({
            objects: [createMockSeat(seatId, 100, { customFields: {} })],
            customFields: [controller, dependent],
        });

        renderOptions({ seatPlanData, selectedSeats: [seatId] });

        const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

        // 1) Number field is hidden (controller unchecked), so add-to-cart should be enabled.
        expect(screen.queryByText(dependentLabel)).toBeNull();
        await waitFor(() => {
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });

        // 2) Check controller => number field becomes visible and required; since value is 0/null, add-to-cart should be disabled.
        fireEvent.click(screen.getByText(controllerLabel));
        expect(await screen.findByText(dependentLabel)).toBeTruthy();
        await waitFor(() => {
            expect(addToCartButton.className).toContain('stachesepl-add-to-cart-button-disabled');
        });

        // 3) Increase to 1 => satisfies required, add-to-cart enabled.
        const increaseButton = screen.getByLabelText('Increase');
        fireEvent.click(increaseButton);
        await waitFor(() => {
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });

        // 4) Decrease to 0 => required again unmet, add-to-cart disabled.
        const decreaseButton = screen.getByLabelText('Decrease');
        fireEvent.click(decreaseButton);
        await waitFor(() => {
            expect(addToCartButton.className).toContain('stachesepl-add-to-cart-button-disabled');
        });

        // Re-increase to 1, then uncheck controller so number field becomes hidden; hidden required fields should not block.
        fireEvent.click(increaseButton);
        await waitFor(() => {
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });

        fireEvent.click(screen.getByText(controllerLabel));
        await waitFor(() => {
            expect(screen.queryByText(dependentLabel)).toBeNull();
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });
    });

    it('initializes required number fields with positive min and enables add-to-cart without user interaction', async () => {
        const seatId = 'A1';
        const seatPlanData = createMockSeatPlanData({
            objects: [createMockSeat(seatId, 100, { customFields: {} })],
            customFields: [
                createMockNumberField('Quantity', undefined, 2, undefined, true),
            ],
        });

        renderOptions({ seatPlanData, selectedSeats: [seatId] });

        const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

        await waitFor(() => {
            expect(addToCartButton.className).not.toContain('stachesepl-add-to-cart-button-disabled');
        });
    });
});

