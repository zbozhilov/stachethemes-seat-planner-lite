import { useEffect, useState } from "react";
import { ReactZoomPanPinchProps, TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";
import { useSeatPlanData } from "@src/front/AddToCart/components/context/hooks";
import './Container.scss';
import { __ } from "@src/utils";

const TransformControls = () => {

    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="stsp-seat-planner-portal-container-transform-controls">
            <div className='stsp-seat-planner-portal-container-transform-controls-buttons'>
                <button type='button' aria-label="Zoom In" onClick={() => zoomIn()}>{__('ZOOM_IN')}</button>
                <button type='button' aria-label="Zoom Out" onClick={() => zoomOut()}>{__('ZOOM_OUT')}</button>
                <button type='button' aria-label="Reset Zoom" onClick={() => resetTransform()}>{__('ZOOM_RESET')}</button>
            </div>
        </div>
    )

}

const calculateInitialScale = (workflowWidth: number, workflowHeight: number) => {

    const containerWidth = window.innerWidth;
    const containerHeight = Math.max(200, window.innerHeight - 150);

    let w = Math.min(1, containerWidth / workflowWidth);
    let h = Math.min(1, containerHeight / workflowHeight);

    return Math.min(w, h);
};

const Container = ({ children }: { children: React.ReactNode }) => {

    const [setupReady, setSetupReady] = useState(false);
    const [initialScale, setInitialScale] = useState(1);
    const { seatPlanData } = useSeatPlanData();

    // Calc initial scale based on workflow width and container width
    useEffect(() => {

        if (!seatPlanData) {
            return;
        }

        const { workflowProps } = seatPlanData;
        const scale = calculateInitialScale(workflowProps.width, workflowProps.height);

        setInitialScale(scale);
        setSetupReady(true);

    }, [seatPlanData]);

    if (!setupReady) {
        return null;
    }

    const transformSettings: ReactZoomPanPinchProps = {
        centerOnInit: true,
        doubleClick: { disabled: true },
        disablePadding: false,
        minScale: initialScale,
        maxScale: 2,
        wheel: {
            disabled: false,
            step: 0.05,
            smoothStep: 0.0025,
        },
        initialScale,
    };

    return (
        <div className='stsp-seat-planner-portal-container'>
            <TransformWrapper {...transformSettings}>
                <TransformControls />
                <TransformComponent>
                    {children}
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};

export default Container;