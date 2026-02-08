import { useEffect, useLayoutEffect, useState } from 'react';
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import SeatPlan from './components/SeatPlan/SeatPlan';
import initToaster from '../Toaster/initToaster';

const SeatSelector = (props: {
    readyToRender: boolean;
    onComponentLoaded?: () => void;
}) => {

    const { onComponentLoaded } = props;

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
                isOptionsModalOpen={false}
                setIsOptionsModalOpen={() => { }}
                onAddDiscountButtonClick={() => { }}
            />

            <Container>
                <SeatPlan />
            </Container>
        </>
    )
}

export default SeatSelector