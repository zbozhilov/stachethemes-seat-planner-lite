import { useModalState, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import { __ } from '@src/utils';
import AddToCartButton from './components/AddToCartButton/AddToCartButton';
import Button from './components/Button/Button';
import './Header.scss';

const Header = () => {

    const { setModalOpen } = useModalState();
    const { selectedSeats, setSelectedSeats } = useSelectedSeats();

    const selectedSeatsCount = selectedSeats.length;

    const handleClose = () => {
        setSelectedSeats([]); // reset selected seats
        setModalOpen(false);
    }

    const renderButton = () => {

        return (
            <>
                <Button className="secondary" onClick={handleClose}>
                    {__('CANCEL')}
                </Button>
                {selectedSeatsCount > 0 && <AddToCartButton />}
            </>
        );
    };


    const getHeaderLabel = () => {

        if (selectedSeatsCount === 0) {
            return __('NO_SEATS_SELECTED');
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