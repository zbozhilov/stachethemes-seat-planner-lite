import { East as ArrowRight } from '@mui/icons-material';
import addSeatsToCart from "@src/front/AddToCart/ajax/addSeatsToCart";
import { useModalState, useProductId, useSeatPlanData, useSelectedSeats, useShowViewCartButton } from "@src/front/AddToCart/components/context/hooks";
import { __ } from "@src/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../Button/Button";

const AddToCartButton = () => {

    const { productId } = useProductId();
    const { selectedSeats } = useSelectedSeats();
    const { setModalOpen } = useModalState();
    const { setShowViewCartButton } = useShowViewCartButton();

    const { seatPlanData } = useSeatPlanData();

    const [loading, setLoading] = useState(false);

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

        selectedSeats.forEach((seatId) => {
            const seatData = seatPlanSeats.find((seat) => seat.seatId === seatId);
            
            if (!seatData) {
                return;
            }

            selectedSeatsData.push({
                seatId: seatData.seatId
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

                setModalOpen(false);
                setShowViewCartButton(true);

                const seatsCount = selectedSeats.length;


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
                    return;
                }


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
                return;

            }


            toast.error(result.data.error || __('GENERIC_ERROR_MESSAGE'));

        } catch (e) {

            console.log('Error', e);

            setLoading(false);


        }

    }

    const classNameArray = ['stachesepl-add-to-cart-button'];

    if (loading) {
        classNameArray.push('loading');
    }

    return (
        <Button className={classNameArray.join(' ')} onClick={handleAddToCart}>{__('ADD_TO_CART')} <ArrowRight /></Button>
    )
}

export default AddToCartButton