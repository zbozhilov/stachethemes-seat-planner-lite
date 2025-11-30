import { useState } from 'react';
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import SeatPlan from './components/SeatPlan/SeatPlan';
import Discounts from './components/Header/components/Discounts/Discounts';

const SeatSelector = () => {

    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

    return (
        <>
            <Header
                isDiscountModalOpen={isDiscountModalOpen}
                setIsDiscountModalOpen={setIsDiscountModalOpen}
                onAddDiscountButtonClick={() => {
                    setIsDiscountModalOpen(true);
                }}
            />

            {!isDiscountModalOpen && <>
                <Container>
                    <SeatPlan />
                </Container>

            </>}

            {isDiscountModalOpen && <Discounts />}
        </>
    )
}

export default SeatSelector