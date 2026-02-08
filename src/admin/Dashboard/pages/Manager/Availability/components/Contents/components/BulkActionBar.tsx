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
import Checkbox from '@src/admin/Dashboard/layout/Checkbox';
import Input from '@src/admin/Dashboard/layout/Input';
import Select from '@src/admin/Dashboard/layout/Select';
import { __ } from '@src/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ManagerCustomFieldData, ManagerDiscountData, SeatStatus } from '../../../../types';
import './BulkActionBar.scss';

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
    onCancel,
    hasDates = false,
    currentDateTime,
    onMoveToDate,
    movingToDate = false,
}: BulkSelectionBarProps) => {

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
    const isBusy = false;

    const handleStatusClick = () => {
        toast.error(__('BULK_ACTIONS_NOT_SUPPORTED_IN_LITE'));
    };

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
    };

    const handleConfirmBulkCreateOrder = async () => {
        toast.error(__('BULK_ACTIONS_NOT_SUPPORTED_IN_LITE'));
        return;
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
                            onClick={handleStatusClick}
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
                                    const openByDefault = selectedSeatIds.length === 1;

                                    return (
                                        <details key={seatId} className="stachesepl-bulk-bar-seat" open={openByDefault}>
                                            <summary className="stachesepl-bulk-bar-seat-summary">
                                                <span className="stachesepl-bulk-bar-seat-id">{seatId}</span>
                                                <span className="stachesepl-bulk-bar-seat-meta">
                                                </span>
                                            </summary>

                                            <div className="stachesepl-bulk-bar-seat-body">
                                                <div className="stachesepl-bulk-bar-seat-empty">
                                                    {__('NO_SEAT_OPTIONS')}
                                                </div>
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

