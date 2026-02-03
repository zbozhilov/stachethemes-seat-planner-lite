import { useEffect, useLayoutEffect, useState } from 'react';
import Container from './components/Container/Container';
import Options from './components/Header/components/Options/Options';
import Header from './components/Header/Header';
import SeatPlan from './components/SeatPlan/SeatPlan';
import initToaster from '../Toaster/initToaster';

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

            {!isOptionsModalOpen && <>
                <Container>
                    <SeatPlan />
                </Container>

            </>}

            {isOptionsModalOpen && <Options />}
        </>
    )
}

export default SeatSelector