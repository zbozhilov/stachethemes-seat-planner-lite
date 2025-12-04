import { useLayoutEffect, useState } from "react";
import { ReactZoomPanPinchProps, TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";
import { useSeatPlanData } from "@src/front/AddToCart/components/context/hooks";
import './Container.scss';
import { __ } from "@src/utils";

const TransformControls = () => {

    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="stachesepl-seat-planner-portal-container-transform-controls">
            <div className='stachesepl-seat-planner-portal-container-transform-controls-buttons'>
                <button type='button' aria-label={__('ZOOM_IN')} title={__('ZOOM_IN')} onClick={() => zoomIn()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
                <button type='button' aria-label={__('ZOOM_OUT')} title={__('ZOOM_OUT')} onClick={() => zoomOut()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
                <button type='button' aria-label={__('ZOOM_RESET')} title={__('ZOOM_RESET')} onClick={() => resetTransform()}>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" stroke="currentColor" strokeWidth="0.5" aria-hidden="true">
                        <path d="M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z" />
                    </svg>
                </button>
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
    // useLayoutEffect prevents flickering by running synchronously before paint
    useLayoutEffect(() => {

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
        <div className='stachesepl-seat-planner-portal-container'>
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