import { East as ArrowRight } from '@mui/icons-material';
import { useDiscounts, useModalState, useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { __ } from '@src/utils';
import AddToCartButton from './components/AddToCartButton/AddToCartButton';
import Button from './components/Button/Button';
import './Header.scss';

const Header = (props: {
    isDiscountModalOpen: boolean,
    setIsDiscountModalOpen: (value: boolean) => void,
    onAddDiscountButtonClick: () => void
}) => {

    const { setModalOpen } = useModalState();
    const { selectedSeats } = useSelectedSeats();
    const { hasDiscounts } = useDiscounts();
    const { seatPlanData } = useSeatPlanData();

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

        if (!canProceed) {
            return <Button className='secondary' onClick={handleClose}>{__('CLOSE')}</Button>
        }

        if (!hasDiscounts) {
            return <AddToCartButton />
        }

        if (!props.isDiscountModalOpen) {
            return <Button onClick={props.onAddDiscountButtonClick}>
                {__('NEXT')}
                <ArrowRight />
            </Button>
        }

        if (props.isDiscountModalOpen) {
            return <Button className='secondary' onClick={() => {
                props.setIsDiscountModalOpen(false);
            }}>
                {__('BACK')}
            </Button>
        }

        return null;

    }

    const getHeaderLabel = () => {

        if (selectedSeatsCount === 0) {
            return hasMinRule && minSeatsRule > 1
                ? __('D_SEATS_REQUIRED').replace('%d', minSeatsRule.toString())
                : __('NO_SEATS_SELECTED');
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