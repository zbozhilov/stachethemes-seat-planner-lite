import { useEffect, useLayoutEffect, useState } from 'react';
import initToaster from '../Toaster/initToaster';
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import SeatPlan from './components/SeatPlan/SeatPlan';

const SeatSelector = (props: {
    readyToRender: boolean;
    onComponentLoaded?: () => void;
}) => {

    const { onComponentLoaded } = props;
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

    useLayoutEffect(() => {
        if (props.readyToRender && onComponentLoaded) {
            onComponentLoaded();
        }
    }, [props.readyToRender, onComponentLoaded]);

    useEffect(() => {
        // One toaster root for all instances
        initToaster();
    }, []);

    if (!props.readyToRender) {
        return null;
    }

    return (
        <>
            <Header
                isOptionsModalOpen={isOptionsModalOpen}
                setIsOptionsModalOpen={setIsOptionsModalOpen}
                onAddDiscountButtonClick={() => {
                    setIsOptionsModalOpen(true);
                }}
            />

            <Container>
                <SeatPlan />
            </Container>
        </>
    )
}

export default SeatSelector