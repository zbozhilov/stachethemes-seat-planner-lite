import { lazy, Suspense } from 'react';

const Tools = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/tools" */ './Tools'));

const LazyTools = () => {

    return (
        <Suspense fallback={''}>
            <Tools />
        </Suspense>
    );
};

export default LazyTools;