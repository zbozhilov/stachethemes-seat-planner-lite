import { useModalState, useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import usePreventSingleEmptySeats from '@src/front/AddToCart/hooks/usePreventSingleEmptySeats';
import { __ } from '@src/utils';
import AddToCartButton from './components/AddToCartButton/AddToCartButton';
import Button from './components/Button/Button';
import './Header.scss';

const Header = () => {

    const { setModalOpen } = useModalState();
    const { selectedSeats } = useSelectedSeats();
    const { seatPlanData } = useSeatPlanData();
    const validateSeatingSelection = usePreventSingleEmptySeats();

    const selectedSeatsCount = selectedSeats.length;
    const minSeatsRule = seatPlanData?.minSeatsPerPurchase || 0; // 0 => no min rule
    const maxSeatsRule = seatPlanData?.maxSeatsPerPurchase || 0; // 0 => no max rule

    const handleClose = () => {
        setModalOpen(false);
    }

    const hasMinRule = minSeatsRule > 0;
    const hasMaxRule = maxSeatsRule > 0;

    const isBelowMin = hasMinRule && selectedSeatsCount < minSeatsRule;
    const isOverMax = hasMaxRule && selectedSeatsCount > maxSeatsRule;
    const isAtMax = hasMaxRule && selectedSeatsCount === maxSeatsRule;

    const canProceed = selectedSeatsCount > 0 && !isBelowMin && !isOverMax;

    const renderButton = () => {

        if (!canProceed || !validateSeatingSelection) {
            return <Button className='secondary' onClick={handleClose}>{__('CLOSE')}</Button>
        }

        return <AddToCartButton />

    }

    const getHeaderLabel = () => {

        if (selectedSeatsCount === 0) {
            return hasMinRule && minSeatsRule > 1
                ? __('D_SEATS_REQUIRED').replace('%d', minSeatsRule.toString())
                : __('NO_SEATS_SELECTED');
        }

        if (!validateSeatingSelection) {
            return __('NO_SINGLE_EMPTY_SEAT');
        }

        if (isAtMax) {
            return maxSeatsRule === 1 ? __('SEAT_SELECTED') : __('MAX_SEATS_SELECTED');
        }

        const key = selectedSeatsCount === 1 ? 'D_SEAT_SELECTED' : 'D_SEATS_SELECTED';

        return __(key).replace('%d', selectedSeatsCount.toString());
    }

    return (
        <>
            <div className='stachesepl-seat-planner-header'>

                <div className='stachesepl-seat-planner-header-label'>
                    {
                        getHeaderLabel()
                    }
                </div>


                <div className='stachesepl-seat-planner-header-buttons'>
                    {renderButton()}
                </div>
            </div>

        </>
    )
}

export default Header