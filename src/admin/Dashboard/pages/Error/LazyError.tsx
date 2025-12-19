import { lazy, Suspense } from 'react';

const Error = lazy(() => import(/* webpackChunkName: "admin/dashboard/chunk/error" */ './Error'));

const LazyError = (props: {
    headerLabel: string;
    titleLabel: string;
    errorMessage: string;
    customButton?: React.ReactNode;
}) => {
    return (
        <Suspense fallback={''}>
            <Error {...props} />
        </Suspense>
    );
};

export default LazyError;