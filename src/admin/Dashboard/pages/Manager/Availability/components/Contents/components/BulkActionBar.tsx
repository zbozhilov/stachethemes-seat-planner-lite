import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { __ } from '@src/utils';
import type { SeatStatus } from '../../../../types';
import './BulkActionBar.scss';
import Checkbox from '@src/admin/Dashboard/layout/Checkbox';
import Input from '@src/admin/Dashboard/layout/Input';
import Select from '@src/admin/Dashboard/layout/Select';
import {
    AddShoppingCart,
    ArrowForward,
    Block,
    CheckCircleOutline,
    Close,
    Event,
    LocalActivity,
    RestartAlt,
    Storefront,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import type { ManagerCustomFieldData, ManagerDiscountData } from '../../../../types';
import CustomFieldInputs from '../../../../EditSeat/components/SeatOrderForm/CustomFieldInputs';
import {
    buildValuesByUid,
    EDITABLE_FIELD_TYPES,
    isFieldVisible,
    isHiddenByMutualExclusivity,
} from '@src/admin/Dashboard/common/customFieldVisibility';
import { useBulkCreateOrder, type BulkCreateOrderSeatData } from '../../../../hooks';

type BulkSelectionBarProps = {
    selectedCount: number;
    selectedSeatIds: string[];
    discounts?: ManagerDiscountData[];
    customFields?: ManagerCustomFieldData[];
    onStatusChange: (status: SeatStatus | 'default') => void;
    onCancel: () => void;
    loading?: boolean;
    hasDates?: boolean;
    currentDateTime?: string;
    onMoveToDate?: (targetDateTime: string, sendNotifications: boolean) => void;
    movingToDate?: boolean;
    onSuccess?: () => void;
};

const statusOptions: { value: SeatStatus | 'default'; label: string; color: string; Icon: any }[] = [
    { value: 'available', label: 'STATUS_AVAILABLE', color: 'green', Icon: CheckCircleOutline },
    { value: 'unavailable', label: 'STATUS_UNAVAILABLE', color: 'gray', Icon: Block },
    { value: 'sold-out', label: 'STATUS_SOLD_OUT', color: 'red', Icon: LocalActivity },
    { value: 'on-site', label: 'STATUS_ON_SITE', color: 'orange', Icon: Storefront },
    { value: 'default', label: 'RESET_TO_DEFAULT', color: 'default', Icon: RestartAlt },
];

const formatDateTimeForInput = (dateTime: string | undefined): string => {
    if (!dateTime) return '';
    return dateTime.slice(0, 16);
};

const BulkSelectionBar = ({
    selectedCount,
    selectedSeatIds,
    discounts,
    customFields,
    onStatusChange,
    onCancel,
    loading = false,
    hasDates = false,
    currentDateTime,
    onMoveToDate,
    movingToDate = false,
    onSuccess,
}: BulkSelectionBarProps) => {
    const { productId } = useParams<{ productId?: string }>();
    const productIdNum = productId ? parseInt(productId, 10) : undefined;
    const { bulkCreateOrder, loading: creatingOrder } = useBulkCreateOrder();

    const [showMovePanel, setShowMovePanel] = useState(false);
    const [targetDateTime, setTargetDateTime] = useState('');
    const [sendNotifications, setSendNotifications] = useState(true);

    const [showOrderPanel, setShowOrderPanel] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [orderStatus, setOrderStatus] = useState('completed');
    const [sendOrderEmails, setSendOrderEmails] = useState(true);

    // Per-seat fields
    const [selectedDiscountNameBySeatId, setSelectedDiscountNameBySeatId] = useState<Record<string, string>>({});
    const [customFieldValuesBySeatId, setCustomFieldValuesBySeatId] = useState<
        Record<string, Record<string, string | number | boolean>>
    >({});

    const isBusy = loading || movingToDate || creatingOrder;

    const editableCustomFields = useMemo(() => {
        const fields = customFields || [];
        return fields.filter((f) => (EDITABLE_FIELD_TYPES as readonly string[]).includes(f.type));
    }, [customFields]);

    // Prune per-seat UI state when selection changes
    useEffect(() => {
        const allowed = new Set(selectedSeatIds);
        setSelectedDiscountNameBySeatId((prev) => {
            const next: Record<string, string> = {};
            for (const [seatId, value] of Object.entries(prev)) {
                if (allowed.has(seatId)) next[seatId] = value;
            }
            return next;
        });
        setCustomFieldValuesBySeatId((prev) => {
            const next: Record<string, Record<string, string | number | boolean>> = {};
            for (const [seatId, value] of Object.entries(prev)) {
                if (allowed.has(seatId)) next[seatId] = value;
            }
            return next;
        });
    }, [selectedSeatIds]);

    const handleMoveClick = () => {
        setShowMovePanel(true);
        setShowOrderPanel(false);
        if (currentDateTime) {
            setTargetDateTime(formatDateTimeForInput(currentDateTime));
        }
    };

    const handleCloseMovePanel = () => {
        setShowMovePanel(false);
        setTargetDateTime('');
        setSendNotifications(true);
    };

    const handleConfirmMove = () => {
        if (targetDateTime && onMoveToDate) {
            onMoveToDate(targetDateTime, sendNotifications);
            handleCloseMovePanel();
        }
    };

    const handleOrderClick = () => {
        setShowOrderPanel(true);
        setShowMovePanel(false);
    };

    const handleCloseOrderPanel = () => {
        setShowOrderPanel(false);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setOrderStatus('completed');
        setSendOrderEmails(true);
        setSelectedDiscountNameBySeatId({});
        setCustomFieldValuesBySeatId({});
    };

    const selectedDiscountBySeatId = useMemo(() => {
        const list = discounts || [];
        const map: Record<string, ManagerDiscountData | null> = {};
        for (const seatId of selectedSeatIds) {
            const name = selectedDiscountNameBySeatId[seatId];
            map[seatId] = name ? list.find((d) => d.name === name) || null : null;
        }
        return map;
    }, [discounts, selectedSeatIds, selectedDiscountNameBySeatId]);

    const getSeatCustomFieldValue = (seatId: string, field: ManagerCustomFieldData): string | number | boolean => {
        const seatValues = customFieldValuesBySeatId[seatId] || {};
        const v = seatValues[field.label];
        if (v !== undefined && v !== '') return v;
        if (field.type === 'checkbox') return false;
        if (field.type === 'number') return '';
        return '';
    };

    const setSeatCustomFieldValue = (seatId: string, label: string, value: string | number | boolean) => {
        setCustomFieldValuesBySeatId((prev) => {
            const seatPrev = prev[seatId] || {};
            const nextSeat = { ...seatPrev, [label]: value };

            const field = editableCustomFields.find((f) => f.label === label);
            if (!field) return { ...prev, [seatId]: nextSeat };

            const isEmpty =
                value === '' ||
                value === undefined ||
                (typeof value === 'string' && !value.trim()) ||
                (field.type === 'checkbox' && (value === false || value === ''));
            if (isEmpty) return { ...prev, [seatId]: nextSeat };

            const uidsToClear = new Set<string>();
            const thisUid = field.uid ?? field.label;
            if (field.mutuallyExclusiveWith) field.mutuallyExclusiveWith.forEach((uid) => uidsToClear.add(uid));
            editableCustomFields.forEach((f) => {
                if ((f.uid ?? f.label) !== thisUid && f.mutuallyExclusiveWith?.includes(thisUid))
                    uidsToClear.add(f.uid ?? f.label);
            });
            uidsToClear.forEach((uid) => {
                const other = editableCustomFields.find((f) => (f.uid ?? f.label) === uid);
                if (other && other.label in nextSeat) delete nextSeat[other.label];
            });

            return { ...prev, [seatId]: nextSeat };
        });
    };

    const getVisibleCustomFieldsForSeat = (seatId: string): ManagerCustomFieldData[] => {
        if (!editableCustomFields.length) return [];
        const seatValues = customFieldValuesBySeatId[seatId] || {};
        const valuesByUid = buildValuesByUid(seatValues, editableCustomFields);
        const byConditions = editableCustomFields.filter((_, index) =>
            isFieldVisible(index, editableCustomFields, valuesByUid)
        );
        return byConditions.filter((field) => !isHiddenByMutualExclusivity(field, byConditions, seatValues));
    };

    const handleConfirmBulkCreateOrder = async () => {
        if (!selectedCount || !productIdNum) return;

        if (!customerName.trim()) {
            toast.error(__('CUSTOMER_NAME_REQUIRED'));
            return;
        }

        if (!customerEmail.trim()) {
            toast.error(__('CUSTOMER_EMAIL_REQUIRED'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail.trim())) {
            toast.error(__('CUSTOMER_EMAIL_INVALID'));
            return;
        }

        // Validate required custom fields per-seat (same rules as SeatOrderForm)
        for (const seatId of selectedSeatIds) {
            const visibleFields = getVisibleCustomFieldsForSeat(seatId);
            for (const field of visibleFields) {
                if (field.required) {
                    const val = getSeatCustomFieldValue(seatId, field);
                    const isEmpty = val === '' || val === undefined || (typeof val === 'string' && !val.trim());
                    if (isEmpty) {
                        toast.error(`${seatId}: ${__('CUSTOM_FIELD_REQUIRED').replace('%s', field.label)}`);
                        return;
                    }
                }
                if (field.type === 'number') {
                    const val = getSeatCustomFieldValue(seatId, field);
                    if (val === '' || val === undefined) continue;
                    const num = Number(val);
                    if (!Number.isFinite(num)) continue;
                    if (field.min != null && num < field.min) {
                        toast.error(
                            `${seatId}: ${__('CUSTOM_FIELD_NUMBER_MIN')
                                .replace('%1$s', field.label)
                                .replace('%2$s', String(field.min))}`
                        );
                        return;
                    }
                    if (field.max != null && num > field.max) {
                        toast.error(
                            `${seatId}: ${__('CUSTOM_FIELD_NUMBER_MAX')
                                .replace('%1$s', field.label)
                                .replace('%2$s', String(field.max))}`
                        );
                        return;
                    }
                }
            }
        }

        // Prepare data
        const seatsData: BulkCreateOrderSeatData[] = selectedSeatIds.map(seatId => {
            const discountName = selectedDiscountNameBySeatId[seatId];
            const discount = discountName ? discounts?.find(d => d.name === discountName) : null;

            const seatDiscount = discount ? {
                name: discount.name,
                type: discount.type,
                value: discount.value
            } : null;

            const visibleFields = getVisibleCustomFieldsForSeat(seatId);
            const customFields: Record<string, string | number | boolean> = {};
            visibleFields.forEach(field => {
                const val = getSeatCustomFieldValue(seatId, field);
                if (val !== '' && val !== undefined) {
                    customFields[field.label] = val;
                }
            });

            return {
                seat_id: seatId,
                seat_discount: seatDiscount,
                seat_custom_fields: customFields
            };
        });

        const toastId = toast.loading(__('CREATING_ORDER'));

        const result = await bulkCreateOrder(
            productIdNum,
            seatsData,
            currentDateTime,
            {
                customerName,
                customerEmail,
                customerPhone,
                orderStatus,
                sendEmails: sendOrderEmails
            }
        );

        if (result.success) {
            toast.success(__('ORDER_CREATED_SUCCESS'), { id: toastId });
            handleCloseOrderPanel();
            onCancel(); // Exit selection mode
            if (onSuccess) onSuccess();
        } else {
            toast.error(result.error || __('ORDER_CREATION_FAILED'), { id: toastId });
        }
    };

    return (
        <div className={`stachesepl-bulk-bar${isBusy ? ' stachesepl-bulk-bar--busy' : ''}`} role="region">
            <div className="stachesepl-bulk-bar-content">
                {/* Header / Selection Info */}
                <div className="stachesepl-bulk-bar-header">
                    <button
                        type="button"
                        className="stachesepl-bulk-bar-close-btn"
                        onClick={onCancel}
                        disabled={isBusy}
                        aria-label={__('CLOSE')}
                    >
                        <Close fontSize="small" />
                    </button>
                    <div className="stachesepl-bulk-bar-info">
                        <span className="stachesepl-bulk-bar-count">{selectedCount}</span>
                        <span className="stachesepl-bulk-bar-label">{__('SELECTED')}</span>
                    </div>
                </div>

                <div className="stachesepl-bulk-bar-divider" />

                {/* Actions */}
                <div className="stachesepl-bulk-bar-actions">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`stachesepl-bulk-bar-action-btn stachesepl-bulk-bar-action-btn--${option.color}`}
                            onClick={() => onStatusChange(option.value)}
                            disabled={isBusy}
                            title={__('SET_STATUS_TO') + ' ' + __(option.label)}
                        >
                            <option.Icon className="stachesepl-bulk-bar-icon" />
                            <span className="stachesepl-bulk-bar-btn-label">{__(option.label)}</span>
                        </button>
                    ))}
                </div>

                <div className="stachesepl-bulk-bar-divider" />

                <button
                    type="button"
                    className={`stachesepl-bulk-bar-action-btn stachesepl-bulk-bar-action-btn--blue ${showOrderPanel ? 'active' : ''}`}
                    onClick={handleOrderClick}
                    disabled={isBusy}
                    title={__('CREATE_ORDER')}
                >
                    <AddShoppingCart className="stachesepl-bulk-bar-icon" />
                    <span className="stachesepl-bulk-bar-btn-label">{__('CREATE_ORDER')}</span>
                </button>

                {hasDates && onMoveToDate && (
                    <>
                        <div className="stachesepl-bulk-bar-divider" />
                        <button
                            type="button"
                            className={`stachesepl-bulk-bar-action-btn stachesepl-bulk-bar-action-btn--purple ${showMovePanel ? 'active' : ''}`}
                            onClick={handleMoveClick}
                            disabled={isBusy}
                            title={__('BULK_MOVE_TO_DATE')}
                        >
                            <Event className="stachesepl-bulk-bar-icon" />
                            <span className="stachesepl-bulk-bar-btn-label">{__('MOVE')}</span>
                        </button>
                    </>
                )}

                {/* Loading State Overlay */}
                {isBusy && (
                    <div className="stachesepl-bulk-bar-loading-overlay">
                        <div className="stachesepl-bulk-bar-spinner" />
                        <span>{movingToDate ? __('BULK_MOVING_BOOKINGS') : __('UPDATING')}</span>
                    </div>
                )}
            </div>

            {/* Move Panel Popover */}
            {showMovePanel && (
                <div className="stachesepl-bulk-bar-move-panel">
                    <div className="stachesepl-bulk-bar-move-header">
                        <h4>{__('BULK_MOVE_TO_DATE')}</h4>
                        <button
                            type="button"
                            onClick={handleCloseMovePanel}
                            className="stachesepl-bulk-bar-move-close"
                        >
                            <Close fontSize="small" />
                        </button>
                    </div>
                    <p className="stachesepl-bulk-bar-move-desc">{__('BULK_MOVE_DESCRIPTION')}</p>
                    <div className="stachesepl-bulk-bar-move-content">
                        <div className="stachesepl-bulk-bar-field">
                            <label>{__('DATE')}</label>
                            <input
                                type="datetime-local"
                                value={targetDateTime}
                                onChange={(e) => setTargetDateTime(e.target.value)}
                                disabled={isBusy}
                            />
                        </div>

                        <Checkbox
                            checked={sendNotifications}
                            onChange={(e) => setSendNotifications(e.target.checked)}
                            disabled={isBusy}
                            label={__('BULK_SEND_NOTIFICATIONS')}
                        />

                        <button
                            type="button"
                            className="stachesepl-bulk-bar-confirm-move-btn"
                            onClick={handleConfirmMove}
                            disabled={!targetDateTime || isBusy}
                        >
                            <span>{__('BULK_CONFIRM_MOVE')}</span>
                            <ArrowForward fontSize="small" />
                        </button>
                    </div>
                </div>
            )}

            {/* Bulk Create Order Panel Popover (UI only) */}
            {showOrderPanel && (
                <div className="stachesepl-bulk-bar-order-panel">
                    <div className="stachesepl-bulk-bar-order-header">
                        <h4>{__('CREATE_ORDER')}</h4>
                        <button
                            type="button"
                            onClick={handleCloseOrderPanel}
                            className="stachesepl-bulk-bar-order-close"
                        >
                            <Close fontSize="small" />
                        </button>
                    </div>

                    <div className="stachesepl-bulk-bar-order-content">
                        <div className="stachesepl-bulk-bar-order-section">
                            <div className="stachesepl-bulk-bar-order-section-title">
                                {__('GENERAL_INFO')}
                            </div>
                            <div className="stachesepl-bulk-bar-order-grid">
                                <Input
                                    label={__('CUSTOMER_NAME')}
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    disabled={isBusy}
                                    placeholder={__('ENTER_CUSTOMER_NAME')}
                                />

                                <Input
                                    type="email"
                                    label={__('CUSTOMER_EMAIL')}
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    disabled={isBusy}
                                    placeholder={__('ENTER_CUSTOMER_EMAIL')}
                                />

                                <Input
                                    type="tel"
                                    label={`${__('CUSTOMER_PHONE')} (${__('OPTIONAL')})`}
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    disabled={isBusy}
                                    placeholder={__('ENTER_CUSTOMER_PHONE')}
                                />

                                <Select
                                    label={__('ORDER_STATUS')}
                                    value={orderStatus}
                                    onChange={(e) => setOrderStatus(e.target.value)}
                                    options={[
                                        { value: 'pending', label: __('PENDING') },
                                        { value: 'processing', label: __('PROCESSING') },
                                        { value: 'on-hold', label: __('ON_HOLD') },
                                        { value: 'completed', label: __('COMPLETED') },
                                    ]}
                                    disabled={isBusy}
                                />
                            </div>

                            <Checkbox
                                checked={sendOrderEmails}
                                onChange={(e) => setSendOrderEmails(e.target.checked)}
                                disabled={isBusy}
                                label={__('SEND_ORDER_EMAIL')}
                            />
                        </div>

                        <div className="stachesepl-bulk-bar-order-section">
                            <div className="stachesepl-bulk-bar-order-section-title">
                                <span>{__('SEAT_CONFIGURATION')}</span>
                                <span>{
                                    selectedCount > 1 ? __('SEATS_PLURAL')?.replace('%d', selectedCount.toString()) : __('SEAT_SINGULAR')?.replace('%d', selectedCount.toString())                                 
                                }</span>
                            </div>
                            <div className="stachesepl-bulk-bar-seat-list">
                                {selectedSeatIds.map((seatId) => {
                                    const visibleFields = getVisibleCustomFieldsForSeat(seatId);
                                    const hasDiscounts = !!discounts?.length;
                                    const hasCustomFields = visibleFields.length > 0;
                                    const openByDefault = selectedSeatIds.length === 1;

                                    return (
                                        <details key={seatId} className="stachesepl-bulk-bar-seat" open={openByDefault}>
                                            <summary className="stachesepl-bulk-bar-seat-summary">
                                                <span className="stachesepl-bulk-bar-seat-id">{seatId}</span>
                                                <span className="stachesepl-bulk-bar-seat-meta">
                                                    {(hasDiscounts || hasCustomFields) && __('SEAT_OPTIONS')}
                                                </span>
                                            </summary>

                                            <div className="stachesepl-bulk-bar-seat-body">
                                                {hasDiscounts && (
                                                    <Select
                                                        label={__('DISCOUNT')}
                                                        value={selectedDiscountNameBySeatId[seatId] || ''}
                                                        onChange={(e) =>
                                                            setSelectedDiscountNameBySeatId((prev) => ({
                                                                ...prev,
                                                                [seatId]: e.target.value,
                                                            }))
                                                        }
                                                        options={[
                                                            { value: '', label: __('NO_DISCOUNT') },
                                                            ...(discounts || []).map((d) => ({
                                                                value: d.name,
                                                                label:
                                                                    d.type === 'percentage'
                                                                        ? `${d.name} (${d.value}%)`
                                                                        : `${d.name} (${d.value})`,
                                                            })),
                                                        ]}
                                                        disabled={isBusy}
                                                    />
                                                )}

                                                {editableCustomFields.length > 0 && (
                                                    <CustomFieldInputs
                                                        fields={visibleFields}
                                                        getValue={(field) => getSeatCustomFieldValue(seatId, field)}
                                                        onChange={(label, value) => setSeatCustomFieldValue(seatId, label, value)}
                                                        disabled={isBusy}
                                                    />
                                                )}

                                                {
                                                    !hasDiscounts && !hasCustomFields && (
                                                        <div className="stachesepl-bulk-bar-seat-empty">
                                                            {__('NO_SEAT_OPTIONS')}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </details>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="stachesepl-bulk-bar-order-footer">
                        <button
                            type="button"
                            className="stachesepl-bulk-bar-confirm-order-btn"
                            onClick={handleConfirmBulkCreateOrder}
                            disabled={isBusy || !customerName.trim() || !customerEmail.trim()}
                        >
                            <span>{__('CREATE_ORDER')}</span>
                            <ArrowForward fontSize="small" />
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkSelectionBar;

