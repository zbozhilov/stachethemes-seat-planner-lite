import { useModalState, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { __ } from '@src/utils';
import AddToCartButton from './components/AddToCartButton/AddToCartButton';
import Button from './components/Button/Button';
import './Header.scss';

const Header = () => {

    const { setModalOpen } = useModalState();
    const { selectedSeats } = useSelectedSeats();

    const selectedSeatsCount = selectedSeats.length;

    const handleClose = () => {
        setModalOpen(false);
    }

    const renderButton = () => {

        if (selectedSeatsCount <= 0) {
            return <Button className='secondary' onClick={handleClose}>{__('CLOSE')}</Button>
        }

        return <AddToCartButton />

    }

    return (
        <div className='stachesepl-seat-planner-header'>
            <div className='stachesepl-seat-planner-header-label'>
                {
                    selectedSeatsCount > 0 ?

                        (selectedSeatsCount === 1 ?
                            __('D_SEAT_SELECTED').replace('%d', selectedSeatsCount.toString()) :
                            __('D_SEATS_SELECTED').replace('%d', selectedSeatsCount.toString())) :

                        __('NO_SEATS_SELECTED')
                }
            </div>

            <div className='stachesepl-seat-planner-header-buttons'>
                {renderButton()}
            </div>
        </div>
    )
}

export default Header