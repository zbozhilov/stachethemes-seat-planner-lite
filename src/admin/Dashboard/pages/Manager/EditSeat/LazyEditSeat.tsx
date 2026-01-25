import { lazy, Suspense } from 'react';

const EditSeat = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/manager/editseat" */ './EditSeat'));

const LazyEditSeat = () => {
    return (
        <Suspense fallback={''}>
            <EditSeat />
        </Suspense>
    );
};

export default LazyEditSeat;