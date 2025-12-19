import { lazy, Suspense } from 'react';

const Overview = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/overview" */ './Overview'));

const LazyDashboard = () => {

    return (
        <Suspense fallback={''}>
            <Overview />
        </Suspense>
    );
};

export default LazyDashboard;