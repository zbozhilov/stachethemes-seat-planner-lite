import { lazy, Suspense } from 'react';
const SeatSelector = lazy(() =>
    import(
        /* webpackChunkName: "front/add_to_cart/chunks/lazy.seat-selector" */
        './SeatSelector'
    )
);

/**
 * onComponentLoaded is called when the component is lazy loaded and ready to render
 * readyToRender is a boolean that indicates if the component should render
 */
const LazySeatSelector = (props: {
    readyToRender: boolean;
    onComponentLoaded?: () => void;
}) => {

    return (
        <Suspense fallback={''}>
            <SeatSelector readyToRender={props.readyToRender} onComponentLoaded={props.onComponentLoaded} />
        </Suspense>
    )
}

export default LazySeatSelector;