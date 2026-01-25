import { lazy, Suspense } from 'react';

const Listing = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/manager/listing" */ './Listing'));

const LazyListing = () => {
    return (
        <Suspense fallback={''}>
            <Listing />
        </Suspense>
    );
};

export default LazyListing;