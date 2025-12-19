import { lazy, Suspense } from 'react';

const Settings = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/settings" */ './Settings'));

const LazySettings = () => {

    return (
        <Suspense fallback={''}>
            <Settings />
        </Suspense>
    );
};

export default LazySettings;

