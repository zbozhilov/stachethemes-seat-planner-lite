import { East as ArrowRight } from '@mui/icons-material';
import addSeatsToCart from "@src/front/AddToCart/ajax/addSeatsToCart";
import CircLoader from "@src/front/AddToCart/components/CircLoader/CircLoader";
import { useModalState, useProductId, useSeatPlanData, useSelectedSeats, useShowViewCartButton } from "@src/front/AddToCart/components/context/hooks";
import { __ } from "@src/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { Portal } from 'react-portal';
import Button from "../Button/Button";
import './AddToCartButton.scss';

const AddToCartButton = () => {

    const { productId } = useProductId();
    const { selectedSeats } = useSelectedSeats();
    const { setModalOpen } = useModalState();
    const { setShowViewCartButton } = useShowViewCartButton();

    const { seatPlanData } = useSeatPlanData();

    const [loading, setLoading] = useState(false);
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

        const selectedSeatsData: { seatId: string }[] = [];

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

        selectedSeats.forEach((seatId) => {
            const seatData = seatMap.get(seatId);

            if (!seatData) {
                return;
            }

            selectedSeatsData.push({
                seatId: seatData.seatId,
            });
        });

        return selectedSeatsData;
    };

    const handleAddToCart = async () => {

        try {

            if (loading) {
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

    const classNameArray = ['stachesepl-add-to-cart-button'];

    if (loading) {
        classNameArray.push('stachesepl-loading');
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