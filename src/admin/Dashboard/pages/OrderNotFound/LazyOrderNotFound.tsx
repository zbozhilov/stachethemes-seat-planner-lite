import { Suspense, lazy } from 'react';

const OrderNotFound = lazy(() => import('./OrderNotFound'));

const LazyOrderNotFound = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderNotFound />
        </Suspense>
    );
}

export default LazyOrderNotFound;
