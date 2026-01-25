import { lazy, Suspense } from 'react';

const Availability = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/manager/availability" */ './Availability'));

const LazyAvailability = () => {
    return (
        <Suspense fallback={''}>
            <Availability />
        </Suspense>
    );
};

export default LazyAvailability;