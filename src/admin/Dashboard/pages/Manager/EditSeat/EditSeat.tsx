import { AccessTime, CalendarMonth, CheckCircle, Edit, EventSeat, Info, Inventory2, OpenInNew, Person, Receipt, Warning } from '@mui/icons-material';
import { __, getFormattedDateTime, getFormattedPrice } from '@src/utils';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import Button from '../../../layout/Button/Button';
import Input from '../../../layout/Input/Input';
import Select from '../../../layout/Select/Select';
import Loading from '../components/Loading/Loading';
import { useAuditoriumProduct, useOrderDetailsBySeat, useSeatData, useUpdateOrderItem, useUpdateSeatOverride } from '../hooks';
import { ManagerLayout, type BreadcrumbItem } from '../layout';
import { SeatStatus } from '../types';
import './EditSeat.scss';

type StatusOption = {
    value: 'default' | SeatStatus;
    label: string;
};

const STATUS_OPTIONS: StatusOption[] = [
    { value: 'default', label: 'Default' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'sold-out', label: 'Sold Out' },
    { value: 'on-site', label: 'On-Site Only' },
];

const EditSeat = () => {
    const navigate = useNavigate();
    const { productId, seatId, dateTime } = useParams<{ productId?: string; seatId?: string; dateTime?: string }>();
    const productIdNum = productId ? parseInt(productId, 10) : undefined;

    // Local state for status override form
    const [selectedStatus, setSelectedStatus] = useState<SeatStatus>('available');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Local state for order editing form
    const [editedSeatId, setEditedSeatId] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);
    const [hasOrderChanges, setHasOrderChanges] = useState(false);

    // Get product name for breadcrumb
    const { data: productsData } = useAuditoriumProduct(productIdNum);
    const productName = productsData?.name || `#${productId}`;
    const hasDates = productsData?.has_dates ?? false;

    // Get seat data
    const { data: seatData, loading, error, refetch } = useSeatData(productIdNum, seatId, dateTime);

    // Get order details if seat is taken
    const { data: orderDetails, loading: orderLoading, refetch: refetchOrder } = useOrderDetailsBySeat(productIdNum, seatId, dateTime);

    // Update override hook
    const { updateOverride, loading: isSaving, error: saveError } = useUpdateSeatOverride();

    // Update order item hook
    const { updateOrderItem, loading: isOrderSaving, error: orderSaveError, clearError: clearOrderError } = useUpdateOrderItem();

    // Sync initial status from server data
    useEffect(() => {
        if (seatData?.currentStatus) {
            setSelectedStatus(seatData.currentStatus);
            setHasChanges(false);
        }
    }, [seatData?.currentStatus]);

    // Sync order data for editing
    useEffect(() => {
        if (orderDetails) {
            setEditedSeatId(orderDetails.seat_id);
            setEditedDate(orderDetails.date_time || '');
            setHasOrderChanges(false);
        }
    }, [orderDetails]);

    // Handle status change
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as SeatStatus;
        setSelectedStatus(newStatus);
        setHasChanges(newStatus !== seatData?.currentStatus);
        setSuccessMessage(null);
    };

    // Handle save status override
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
                // Refetch to get updated data
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

    // Handle order seat ID change
    const handleSeatIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSeatId = e.target.value;
        setEditedSeatId(newSeatId);
        setHasOrderChanges(newSeatId !== orderDetails?.seat_id || editedDate !== (orderDetails?.date_time || ''));
        setOrderSuccessMessage(null);
        clearOrderError();
    };

    // Handle order date change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setEditedDate(newDate);
        setHasOrderChanges(editedSeatId !== orderDetails?.seat_id || newDate !== (orderDetails?.date_time || ''));
        setOrderSuccessMessage(null);
        clearOrderError();
    };

    // Format date for input
    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';
        return dateString.substring(0, 16);
    };

    // Handle save order changes
    const handleSaveOrder = async () => {
        if (!orderDetails) return;

        setOrderSuccessMessage(null);
        clearOrderError();

        const toastId = toast.loading(__('SAVING'));

        try {
            const updateData: { seatId?: string; selectedDate?: string } = {};
            const seatIdChanged = editedSeatId !== orderDetails.seat_id;

            if (seatIdChanged) {
                updateData.seatId = editedSeatId;
            }

            if (editedDate !== (orderDetails.date_time || '')) {
                updateData.selectedDate = editedDate;
            }

            const result = await updateOrderItem(
                orderDetails.order_id,
                orderDetails.item_id,
                updateData,
                orderDetails.seat_data
            );

            if (result.success) {
                toast.success(__('ORDER_UPDATED'), { id: toastId });
                setOrderSuccessMessage(__('ORDER_UPDATED'));
                setHasOrderChanges(false);

                const dateChanged = editedDate !== (orderDetails.date_time || '');

                // If seat ID or date was changed, navigate to the new seat/date edit page
                if (seatIdChanged || dateChanged) {
                    const newSeatId = seatIdChanged ? editedSeatId : seatId;
                    const newDate = editedDate || dateTime;

                    if (hasDates && newDate) {
                        navigate(`/manager/product/${productId}/date/${newDate}/availability/edit/${newSeatId}`);
                    } else {
                        navigate(`/manager/product/${productId}/availability/edit/${newSeatId}`);
                    }
                } else {
                    // No navigation needed, just refetch to get updated data
                    refetchOrder();
                    refetch();
                }
            } else {
                const errorMessage = result.error || orderSaveError || __('FAILED_TO_UPDATE_ORDER');
                toast.error(errorMessage, { id: toastId });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : __('FAILED_TO_UPDATE_ORDER');
            toast.error(errorMessage, { id: toastId });
        }
    };

    // Format dateTime for display if present
    const formatDateTimeForDisplay = (dt: string | undefined): string => {
        return dt ? getFormattedDateTime(dt) : '';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: __('MANAGER_PRODUCTS'), path: '/manager', icon: <Inventory2 /> },
    ];

    // Build breadcrumbs based on context
    if (hasDates && dateTime) {
        breadcrumbs.push({
            label: productName,
            path: `/manager/product/${productId}/dates`,
            icon: <CalendarMonth />
        });
        breadcrumbs.push({
            label: formatDateTimeForDisplay(dateTime),
            path: `/manager/product/${productId}/date/${dateTime}/availability`,
            icon: <AccessTime />
        });
    } else {
        breadcrumbs.push({
            label: productName,
            path: `/manager/product/${productId}/availability`,
            icon: <EventSeat />
        });
    }

    breadcrumbs.push({
        label: seatId || __('EDIT_SEAT'),
        icon: <Edit />
    });

    // Render loading state
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

    // Render error state
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
                {/* Seat Info Card */}
                <div className="stachesepl-manager-edit-seat-info">
                    <div className="stachesepl-manager-edit-seat-info-header">
                        <EventSeat className="stachesepl-manager-edit-seat-info-icon" />
                        <div className="stachesepl-manager-edit-seat-info-details">
                            <h3 className="stachesepl-manager-edit-seat-info-title">
                                {seatId}
                            </h3>
                        </div>
                        {orderCheckComplete && hasOrder && (
                            <div className="stachesepl-manager-edit-seat-taken-badge">
                                <Warning className="stachesepl-manager-edit-seat-taken-icon" />
                                {__('SEAT_ORDERED')}
                            </div>
                        )}
                    </div>

                    {seatInfo && (
                        <div className="stachesepl-manager-edit-seat-info-meta">
                            {seatInfo.price !== undefined && (
                                <div className="stachesepl-manager-edit-seat-info-meta-item">
                                    <span className="stachesepl-manager-edit-seat-info-meta-label">
                                        {__('PRICE')}:
                                    </span>
                                    <span className="stachesepl-manager-edit-seat-info-meta-value">
                                        {getFormattedPrice(seatInfo.price)}
                                    </span>
                                </div>
                            )}
                            {dateTime && (
                                <div className="stachesepl-manager-edit-seat-info-meta-item">
                                    <span className="stachesepl-manager-edit-seat-info-meta-label">
                                        {__('DATE')}:
                                    </span>
                                    <span className="stachesepl-manager-edit-seat-info-meta-value">
                                        {formatDateTimeForDisplay(dateTime)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {orderCheckComplete && hasOrder && (
                    <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--info">
                        <Info className="stachesepl-manager-edit-seat-message-icon" />
                        {__('STATUS_CANNOT_BE_CHANGED')}
                    </div>
                )}

                {/* Status Override Section - Hidden when seat has order */}
                {orderCheckComplete && !hasOrder && (
                    <div className="stachesepl-manager-edit-seat-form">
                        <h4 className="stachesepl-manager-edit-seat-form-title">
                            {__('SEAT_STATUS_OVERRIDE')}
                        </h4>
                        <p className="stachesepl-manager-edit-seat-form-description">
                            {__('SEAT_STATUS_OVERRIDE_DESC')}
                        </p>

                        <div className="stachesepl-manager-edit-seat-form-field">
                            <Select
                                label={__('STATUS')}
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                options={STATUS_OPTIONS.map(opt => ({
                                    value: opt.value,
                                    label: opt.label,
                                }))}
                                disabled={isSaving}
                            />
                        </div>

                        {/* Messages */}
                        {saveError && (
                            <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--error">
                                <Warning className="stachesepl-manager-edit-seat-message-icon" />
                                {saveError}
                            </div>
                        )}

                        {successMessage && (
                            <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--success">
                                <CheckCircle className="stachesepl-manager-edit-seat-message-icon" />
                                {successMessage}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="stachesepl-manager-edit-seat-actions">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !hasChanges}
                            >
                                {isSaving ? (
                                    <>{__('SAVING')}</>
                                ) : (
                                    <>
                                        {__('SAVE_CHANGES')}
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate(-1)}
                                disabled={isSaving}
                            >
                                {__('CANCEL')}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Order Details Section - Only shown when seat has order */}
                {orderCheckComplete && hasOrder && (
                    <div className="stachesepl-manager-edit-seat-order">
                        <div className="stachesepl-manager-edit-seat-order-header">
                            <Receipt className="stachesepl-manager-edit-seat-order-icon" />
                            <div className="stachesepl-manager-edit-seat-order-header-content">
                                <h4 className="stachesepl-manager-edit-seat-form-title">
                                    {__('ORDER_DETAILS')}
                                </h4>
                                <p className="stachesepl-manager-edit-seat-form-description">
                                    {__('ORDER_DETAILS_DESC')}
                                </p>
                            </div>
                        </div>

                        {/* Order Info Grid */}
                        <div className="stachesepl-manager-edit-seat-order-info">
                            <div className="stachesepl-manager-edit-seat-order-info-item">
                                <span className="stachesepl-manager-edit-seat-order-info-label">
                                    {__('ORDER_ID')}
                                </span>
                                <span className="stachesepl-manager-edit-seat-order-info-value">
                                    <a
                                        href={orderDetails.order_edit_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="stachesepl-manager-edit-seat-order-link"
                                    >
                                        #{orderDetails.order_id}
                                        <OpenInNew className="stachesepl-manager-edit-seat-order-link-icon" />
                                    </a>
                                </span>
                            </div>
                            <div className="stachesepl-manager-edit-seat-order-info-item">
                                <span className="stachesepl-manager-edit-seat-order-info-label">
                                    {__('ORDER_STATUS')}
                                </span>
                                <span className={`stachesepl-manager-edit-seat-order-status stachesepl-manager-edit-seat-order-status--${orderDetails.order_status.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {orderDetails.order_status}
                                </span>
                            </div>
                            <div className="stachesepl-manager-edit-seat-order-info-item">
                                <span className="stachesepl-manager-edit-seat-order-info-label">
                                    {__('CUSTOMER')}
                                </span>
                                <span className="stachesepl-manager-edit-seat-order-info-value stachesepl-manager-edit-seat-order-customer">
                                    <Person className="stachesepl-manager-edit-seat-order-customer-icon" />
                                    <span>{orderDetails.customer_name}</span>
                                    <span className="stachesepl-manager-edit-seat-order-customer-email">
                                        {orderDetails.customer_email}
                                    </span>
                                </span>
                            </div>
                            <div className="stachesepl-manager-edit-seat-order-info-item">
                                <span className="stachesepl-manager-edit-seat-order-info-label">
                                    {__('ORDER_DATE')}
                                </span>
                                <span className="stachesepl-manager-edit-seat-order-info-value">
                                    {orderDetails.order_date}
                                </span>
                            </div>
                        </div>

                        {/* Edit Order Item Form */}
                        <div className="stachesepl-manager-edit-seat-order-form">
                            <div className="stachesepl-manager-edit-seat-form-field">
                                <Input
                                    label={__('NEW_SEAT_ID')}
                                    value={editedSeatId}
                                    onChange={handleSeatIdChange}
                                    disabled={isOrderSaving}
                                />
                            </div>

                            {orderDetails.has_dates && (
                                <div className="stachesepl-manager-edit-seat-form-field">
                                    <Input
                                        type="datetime-local"
                                        label={__('NEW_DATE')}
                                        value={formatDateForInput(editedDate)}
                                        onChange={handleDateChange}
                                        disabled={isOrderSaving}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Order Messages */}
                        {orderSaveError && (
                            <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--error">
                                <Warning className="stachesepl-manager-edit-seat-message-icon" />
                                {orderSaveError}
                            </div>
                        )}

                        {orderSuccessMessage && (
                            <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--success">
                                <CheckCircle className="stachesepl-manager-edit-seat-message-icon" />
                                {orderSuccessMessage}
                            </div>
                        )}

                        {/* Order Actions */}
                        <div className="stachesepl-manager-edit-seat-actions">
                            <Button
                                onClick={handleSaveOrder}
                                disabled={isOrderSaving || !hasOrderChanges}
                            >
                                {isOrderSaving ? (
                                    <>{__('SAVING')}</>
                                ) : (
                                    <>{__('UPDATE_ORDER')}</>
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setEditedSeatId(orderDetails.seat_id);
                                    setEditedDate(orderDetails.date_time || '');
                                    setHasOrderChanges(false);
                                    clearOrderError();
                                }}
                                disabled={isOrderSaving || !hasOrderChanges}
                            >
                                {__('CANCEL')}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ManagerLayout>
    );
};

export default EditSeat;
