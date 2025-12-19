import { lazy, Suspense } from 'react';

const Scanner = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/scanner" */ './Scanner'));

const LazyScanner = () => {

    return (
        <Suspense fallback={''}>
            <Scanner />
        </Suspense>
    );
};

export default LazyScanner;

