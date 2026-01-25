import { Inventory2, CalendarMonth, EventSeat, AccessTime } from '@mui/icons-material';
import { __, getFormattedDateTime } from '@src/utils';
import { useParams } from 'react-router';
import { ManagerLayout, type BreadcrumbItem } from '../layout';
import Contents from './components/Contents/Contents';
import { useAuditoriumProduct } from '../hooks';

const Availability = () => {
    const { productId, dateTime } = useParams<{ productId?: string; dateTime?: string }>();
    const productIdNum = productId ? parseInt(productId, 10) : undefined;
    
    // Get product name for breadcrumb
    const { data: productsData } = useAuditoriumProduct(productIdNum);
    const productName = productsData?.name || `#${productId}`;
    const hasDates = productsData?.has_dates ?? false;

    // Format dateTime for display if present
    const formatDateTimeForDisplay = (dt: string | undefined): string => {
        return dt ? getFormattedDateTime(dt) : '';
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { label: __('MANAGER_PRODUCTS'), path: '/manager', icon: <Inventory2 /> },
    ];

    // If product has dates, add dates breadcrumb
    if (hasDates && dateTime) {
        breadcrumbs.push({ 
            label: productName, 
            path: `/manager/product/${productId}/dates`,
            icon: <CalendarMonth /> 
        });
        breadcrumbs.push({ 
            label: formatDateTimeForDisplay(dateTime), 
            icon: <AccessTime /> 
        });
    } else {
        breadcrumbs.push({ 
            label: productName, 
            icon: <EventSeat /> 
        });
    }

    const subtitle = dateTime 
        ? `${__('MANAGER_AVAILABILITY_DESCRIPTION_FOR_DATE').replace('%s', formatDateTimeForDisplay(dateTime))}`
        : __('MANAGER_AVAILABILITY_DESCRIPTION');

    return (
        <ManagerLayout
            breadcrumbs={breadcrumbs}
            title={__('MANAGER_AVAILABILITY_TITLE')}
            subtitle={subtitle}
        >
            <Contents />
        </ManagerLayout>
    );
};

export default Availability;
