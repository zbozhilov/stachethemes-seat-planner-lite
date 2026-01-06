import { East as ArrowRight } from '@mui/icons-material';
import addSeatsToCart from "@src/front/AddToCart/ajax/addSeatsToCart";
import CircLoader from "@src/front/AddToCart/components/CircLoader/CircLoader";
import { useCustomFields, useDiscounts, useModalState, useProductId, useSeatPlanData, useSelectedDate, useSelectedSeats, useShowViewCartButton } from "@src/front/AddToCart/components/context/hooks";
import { CustomFieldsEntryData } from "@src/front/AddToCart/types";
import { __ } from "@src/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Portal } from 'react-portal';
import Button from "../Button/Button";
import './AddToCartButton.scss';

const AddToCartButton = (props: {
    onValidate?: () => boolean;
}) => {

    const { productId } = useProductId();
    const { selectedSeats } = useSelectedSeats();
    const { selectedDate } = useSelectedDate();
    const { setModalOpen } = useModalState();
    const { setShowViewCartButton } = useShowViewCartButton();

    const { seatPlanData } = useSeatPlanData();
    const { discounts, hasDiscounts } = useDiscounts();
    const { hasCustomFields } = useCustomFields();

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(hasCustomFields);
    const [showRedirectOverlay, setShowRedirectOverlay] = useState(false);

    const updateCartFragments = (fragments: { [key: string]: string }) => {

        Object.keys(fragments).forEach((selector) => {
            const element = document.querySelector(selector);

            if (element) {
                element.outerHTML = fragments[selector];
            }
        });

        document.body.dispatchEvent(new Event('wc_fragments_refreshed'));
    };

    const getSelectedSeatsData = () => {

        const selectedSeatsData: { seatId: string, discountId: string, customFields?: CustomFieldsEntryData }[] = [];

        const seatPlanSeats = seatPlanData?.objects.filter((object) => object.type === 'seat');

        if (!seatPlanSeats) {
            return selectedSeatsData;
        }

        // Create Maps for O(1) lookups instead of O(n) find operations
        const seatMap = new Map<string, typeof seatPlanSeats[0]>();
        seatPlanSeats.forEach((seat) => {
            if (seat.seatId) {
                seatMap.set(seat.seatId, seat);
            }
        });

        const discountMap = new Map<string, typeof discounts[0]>();
        if (hasDiscounts) {
            discounts.forEach((discount) => {
                if (discount.name) {
                    discountMap.set(discount.name, discount);
                }
            });
        }

        selectedSeats.forEach((seatId) => {
            const seatData = seatMap.get(seatId);

            if (!seatData) {
                return;
            }

            let seatDiscount = '';

            if (hasDiscounts && seatData.discount) {
                seatDiscount = discountMap.has(seatData.discount) ? seatData.discount : '';
            }

            selectedSeatsData.push({
                seatId: seatData.seatId,
                discountId: seatDiscount,
                customFields: seatData.customFields
            });
        });

        return selectedSeatsData;
    };

    const handleAddToCart = async () => {

        try {

            if (loading) {
                return;
            }

            // Validate required fields if validation function is provided
            if (props.onValidate && !props.onValidate()) {
                // Validation failed - errors are already set in Options component
                // Scroll to first error if possible
                const firstErrorField = document.querySelector('.stachesepl-input-field-error, .stachesepl-select-field-error, .stachesepl-textarea-field-error, .stachesepl-checkbox-field-error');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            const selectedSeatsData = getSelectedSeatsData();

            if (!selectedSeatsData.length) {
                toast.error(__('NO_SEATS_SELECTED'));
                return;
            }

            setLoading(true);

            const result = await addSeatsToCart({
                productId: productId,
                selectedSeatsData: selectedSeatsData,
                selectedDate: selectedDate,
                signal: new AbortController().signal
            });

            setLoading(false);

            if (result.success) {

                if ('cart_fragments' in result.data && result.data.cart_fragments) {
                    updateCartFragments(result.data.cart_fragments);
                }

                const seatsCount = selectedSeats.length;
                const shouldRedirect =
                    window.seat_planner_add_to_cart &&
                    window.seat_planner_add_to_cart.cart_redirect_after_add === 'yes' &&
                    typeof window.seat_planner_add_to_cart.cart_redirect_url === 'string';


                // If redirecting, show overlay immediately and don't close modal yet
                if (shouldRedirect) {

                    const showRedirectMessage = window.seat_planner_add_to_cart.cart_redirect_message === 'yes' ? true : false;
                    const timeoutDelay = showRedirectMessage ? 1500 : 100;

                    if (showRedirectMessage) {
                        setShowRedirectOverlay(true);
                    }

                    setTimeout(() => {
                        window.location.href = window.seat_planner_add_to_cart.cart_redirect_url;
                    }, timeoutDelay);

                    return;
                }

                // Only close modal and show toast if NOT redirecting
                setModalOpen(false);
                setShowViewCartButton(true);

                if (seatsCount === 1) {

                    toast.success(
                        <span
                            className="stachesepl-toast-added-to-cart"
                            dangerouslySetInnerHTML={{
                                __html:
                                    [
                                        __('D_SEAT_ADDED_TO_CART').replace('%d', seatsCount.toString()),
                                        __('A__VIEW_CART')
                                    ].join(' ')
                            }} />);

                } else {

                    toast.success(
                        <span
                            className="stachesepl-toast-added-to-cart"
                            dangerouslySetInnerHTML={{
                                __html:
                                    [
                                        __('D_SEATS_ADDED_TO_CART').replace('%d', seatsCount.toString()),
                                        __('A__VIEW_CART')
                                    ].join(' ')
                            }} />);

                }

                return;

            }


            toast.error(result.data.error || __('GENERIC_ERROR_MESSAGE'));

        } catch (e) {

            setLoading(false);

        }

    }

    // This is enable/disable listener
    // If the custom fields are required but not filled, the button should be disabled
    useEffect(() => {
        if (!hasCustomFields) {
            setDisabled(false);
            return;
        }

        // If no seats are selected, disable the button
        if (selectedSeats.length === 0) {
            setDisabled(true);
            return;
        }

        const customFields = seatPlanData?.customFields || [];
        const seatPlanSeats = seatPlanData?.objects.filter((object) => object.type === 'seat') || [];

        // Create a Map for O(1) seat lookups instead of O(n) find operations
        const seatMap = new Map<string, typeof seatPlanSeats[0]>();
        seatPlanSeats.forEach((seat) => {
            if (seat.seatId) {
                seatMap.set(seat.seatId, seat);
            }
        });

        // Check if all required custom fields are filled for all selected seats
        const allRequiredFieldsFilled = selectedSeats.every((seatId) => {
            const seatData = seatMap.get(seatId);

            if (!seatData) {
                return false;
            }

            const seatCustomFields = seatData.customFields || {};

            // Check each required custom field
            return customFields.every((field) => {
                if (!field.required) {
                    return true; // Not required, so it's valid
                }

                const fieldLabel = (field.label || '').trim();
                const fieldValue = seatCustomFields[fieldLabel];

                // For checkbox, check if it's truthy
                if (field.type === 'checkbox') {
                    return Boolean(fieldValue);
                }

                // For other fields (text, textarea, select), check if it's not empty
                return fieldValue !== undefined && String(fieldValue).trim() !== '';
            });
        });

        setDisabled(!allRequiredFieldsFilled);
    }, [hasCustomFields, seatPlanData, selectedSeats]);

    const classNameArray = ['stachesepl-add-to-cart-button'];

    if (loading) {
        classNameArray.push('stachesepl-loading');
    }

    if (disabled) {
        classNameArray.push('stachesepl-add-to-cart-button-disabled');
    }

    const redirectMessage = window.seat_planner_add_to_cart.cart_redirect_message_text || __('REDIRECTING_TO_PAYMENT');

    return (
        <>

            <Button className={classNameArray.join(' ')} onClick={handleAddToCart}>
                {__('ADD_TO_CART')}
                <ArrowRight />
                {loading && <CircLoader text={__('LOADING')} colorMode="light" type='small' />}
            </Button>

            {showRedirectOverlay && (
                <Portal>
                    <div className="stachesepl-redirect-overlay">
                        <div className="stachesepl-redirect-content">
                            <div className="stachesepl-redirect-text">
                                <div className='stachesepl-redirect-text-header'>{redirectMessage}</div>
                                <div className='stachesepl-redirect-text-description'>{__('PLEASE_WAIT')}</div>
                            </div>
                            <div className="stachesepl-redirect-progress">
                                <div className="stachesepl-redirect-progress-bar" />
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    )
}

export default AddToCartButton