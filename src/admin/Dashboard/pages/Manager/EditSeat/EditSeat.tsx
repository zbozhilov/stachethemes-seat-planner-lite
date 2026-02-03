import { AccessTime, CalendarMonth, Edit, EventSeat, Info, Inventory2 } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import Loading from '../components/Loading/Loading';
import { useAuditoriumProduct, useOrderDetailsBySeat, useSeatData, useUpdateSeatOverride } from '../hooks';
import { ManagerLayout, type BreadcrumbItem } from '../layout';
import type { SeatObjectData } from '../types';
import { SeatStatus } from '../types';
import SeatOrderForm from './components/SeatOrderForm';
import SeatInfoCard from './components/SeatInfoCard/SeatInfoCard';
import StatusOverrideForm from './components/StatusOverrideForm/StatusOverrideForm';
import { EditSeatOrderProvider } from './context/EditSeatOrderContext';
import { useEditSeatOrderForm } from './hooks';
import { formatDateTimeForDisplay } from './utils';
import './EditSeat.scss';

const EditSeat = () => {
    const navigate = useNavigate();
    const { productId, seatId, dateTime } = useParams<{ productId?: string; seatId?: string; dateTime?: string }>();
    const productIdNum = productId ? parseInt(productId, 10) : undefined;

    const [selectedStatus, setSelectedStatus] = useState<SeatStatus>('available');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const { data: productsData } = useAuditoriumProduct(productIdNum);
    const productName = productsData?.name || `#${productId}`;
    const hasDates = productsData?.has_dates ?? false;

    const { data: seatData, loading, error, refetch } = useSeatData(productIdNum, seatId, dateTime);
    const { data: orderDetails, loading: orderLoading, refetch: refetchOrder } = useOrderDetailsBySeat(
        productIdNum,
        seatId,
        dateTime
    );

    const { updateOverride, loading: isSaving, error: saveError } = useUpdateSeatOverride();

    const editSeatOrderContextValue = useEditSeatOrderForm({
        orderDetails,
        seatData,
        hasDates,
        productId,
        seatId,
        dateTime,
        refetchOrder,
        refetch,
        navigate,
    });

    useEffect(() => {
        if (seatData?.currentStatus) {
            setSelectedStatus(seatData.currentStatus);
            setHasChanges(false);
        }
    }, [seatData?.currentStatus]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as SeatStatus;
        setSelectedStatus(newStatus);
        setHasChanges(newStatus !== seatData?.currentStatus);
        setSuccessMessage(null);
    };

    const handleSave = async () => {
        if (!productIdNum || !seatId) return;

        setSuccessMessage(null);
        const toastId = toast.loading(__('SAVING'));

        try {
            const success = await updateOverride(productIdNum, seatId, selectedStatus, dateTime);

            if (success) {
                toast.success(__('SEAT_OVERRIDE_SAVED'), { id: toastId });
                setSuccessMessage(__('SEAT_OVERRIDE_SAVED'));
                setHasChanges(false);
                refetch();
            } else {
                const errorMessage = saveError || __('FAILED_TO_SAVE_SEAT_OVERRIDE');
                toast.error(errorMessage, { id: toastId });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : __('FAILED_TO_SAVE_SEAT_OVERRIDE');
            toast.error(errorMessage, { id: toastId });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: __('MANAGER_PRODUCTS'), path: '/manager', icon: <Inventory2 /> },
    ];

    if (hasDates && dateTime) {
        breadcrumbs.push({
            label: productName,
            path: `/manager/product/${productId}/dates`,
            icon: <CalendarMonth />,
        });
        breadcrumbs.push({
            label: formatDateTimeForDisplay(dateTime),
            path: `/manager/product/${productId}/date/${dateTime}/availability`,
            icon: <AccessTime />,
        });
    } else {
        breadcrumbs.push({
            label: productName,
            path: `/manager/product/${productId}/availability`,
            icon: <EventSeat />,
        });
    }

    breadcrumbs.push({
        label: seatId || __('EDIT_SEAT'),
        icon: <Edit />,
    });

    if (loading) {
        return (
            <ManagerLayout
                breadcrumbs={breadcrumbs}
                title={`${__('MANAGER_EDIT_SEAT_TITLE')} - ${seatId}`}
                subtitle={__('MANAGER_EDIT_SEAT_DESCRIPTION')}
            >
                <Loading />
            </ManagerLayout>
        );
    }

    if (error) {
        return (
            <ManagerLayout
                breadcrumbs={breadcrumbs}
                title={`${__('MANAGER_EDIT_SEAT_TITLE')} - ${seatId}`}
                subtitle={__('MANAGER_EDIT_SEAT_DESCRIPTION')}
            >
                <div className="stachesepl-manager-edit-seat">
                    <div className="stachesepl-manager-edit-seat-error">
                        <span className="stachesepl-manager-edit-seat-error-icon">⚠</span>
                        <span>{error}</span>
                    </div>
                </div>
            </ManagerLayout>
        );
    }

    const seatInfo = seatData?.seat;
    const hasOrder = orderDetails !== null && orderDetails !== undefined;
    const orderCheckComplete = !orderLoading;

    return (
        <ManagerLayout
            breadcrumbs={breadcrumbs}
            title={`${__('MANAGER_EDIT_SEAT_TITLE')} - ${seatId}`}
            subtitle={__('MANAGER_EDIT_SEAT_DESCRIPTION')}
        >
            <div className="stachesepl-manager-edit-seat">
                <SeatInfoCard
                    seatId={seatId}
                    seatInfo={seatInfo as SeatObjectData | null | undefined}
                    dateTime={dateTime}
                    hasOrder={hasOrder}
                    orderCheckComplete={orderCheckComplete}
                    formatDateTimeForDisplay={formatDateTimeForDisplay}
                />

                {orderCheckComplete && hasOrder && (
                    <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--info">
                        <Info className="stachesepl-manager-edit-seat-message-icon" />
                        {__('STATUS_CANNOT_BE_CHANGED')}
                    </div>
                )}

                {orderCheckComplete && !hasOrder && (
                    <StatusOverrideForm
                        selectedStatus={selectedStatus}
                        hasChanges={hasChanges}
                        isSaving={isSaving}
                        saveError={saveError}
                        successMessage={successMessage}
                        onStatusChange={handleStatusChange}
                        onSave={handleSave}
                        onCancel={() => navigate(-1)}
                    />
                )}

                {orderCheckComplete && !hasOrder && (
                    <SeatOrderForm
                        mode="create"
                        productId={productIdNum!}
                        seatId={seatId!}
                        dateTime={dateTime}
                        discounts={seatData?.discounts}
                        customFields={seatData?.customFields}
                        onSuccess={() => {
                            refetchOrder();
                            refetch();
                        }}
                    />
                )}

                {orderCheckComplete && hasOrder && orderDetails && editSeatOrderContextValue && (
                    <EditSeatOrderProvider value={editSeatOrderContextValue}>
                        <SeatOrderForm mode="edit" />
                    </EditSeatOrderProvider>
                )}
            </div>
        </ManagerLayout>
    );
};

export default EditSeat;
