import { lazy, Suspense } from 'react';

const Dates = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/manager/dates" */ './Dates'));

const LazyDates = () => {
    return (
        <Suspense fallback={''}>
            <Dates />
        </Suspense> 
    );
};

export default LazyDates;