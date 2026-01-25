import { CalendarMonth, Inventory2 } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useParams } from 'react-router';
import Loading from '../components/Loading/Loading';
import { useAuditoriumProduct } from '../hooks';
import { ManagerLayout, type BreadcrumbItem } from '../layout';
import Contents from './components/Contents/Contents';
import './Dates.scss';

const Dates = () => {
    const { productId } = useParams<{ productId?: string }>();
    const productIdNum = productId ? parseInt(productId, 10) : undefined;

    // Get product name for breadcrumb
    const { data: productsData, loading, error } = useAuditoriumProduct(productIdNum, {
        includeDates: true,
    });

    const productName = productsData?.name || `#${productId}`;

    const breadcrumbs: BreadcrumbItem[] = [
        { label: __('MANAGER_PRODUCTS'), path: '/manager', icon: <Inventory2 /> },
        { label: productName, icon: <CalendarMonth /> },
    ];

    return (
        <ManagerLayout
            breadcrumbs={breadcrumbs}
            title={__('MANAGER_DATES_TITLE')}
            subtitle={__('MANAGER_DATES_DESCRIPTION')}
        >

            {loading && <div className="stachesepl-manager-dates">
                <Loading />
            </div>}

            {error && <div className="stachesepl-manager-dates">
                <div className="stachesepl-manager-dates-error">
                    <span className="stachesepl-manager-dates-error-icon">⚠</span>
                    <span>{error}</span>
                </div>
            </div>}

            {!loading && !error && productsData &&
                <Contents productData={productsData} />}
        </ManagerLayout>
    );
};

export default Dates;
