import { AddShoppingCart, CheckCircle, Receipt, Warning } from '@mui/icons-material';
import Button from '@src/admin/Dashboard/layout/Button';
import Checkbox from '@src/admin/Dashboard/layout/Checkbox';
import Input from '@src/admin/Dashboard/layout/Input';
import Select from '@src/admin/Dashboard/layout/Select';
import { __ } from '@src/utils';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
    buildValuesByUid,
    EDITABLE_FIELD_TYPES,
    isFieldVisible,
    isHiddenByMutualExclusivity,
} from '../../../../../common/customFieldVisibility';
import { useCreateOrder } from '../../../hooks';
import type { ManagerCustomFieldData, ManagerDiscountData } from '../../../types';
import { useEditSeatOrderContext } from '../../context/EditSeatOrderContext';
import '../OrderDetails/OrderDetails.scss';
import OrderInfoGrid from '../OrderDetails/OrderInfoGrid';
import CustomFieldInputs from './CustomFieldInputs';

type CreateModeProps = {
    mode: 'create';
    productId: number;
    seatId: string;
    dateTime?: string;
    discounts?: ManagerDiscountData[];
    customFields?: ManagerCustomFieldData[];
    onSuccess?: () => void;
};

type EditModeProps = {
    mode: 'edit';
};

type SeatOrderFormProps = CreateModeProps | EditModeProps;

const SeatOrderForm = (props: SeatOrderFormProps) => {
    if (props.mode === 'create') {
        return <SeatOrderFormCreate {...props} />;
    }
    return <SeatOrderFormEdit />;
};

const SeatOrderFormCreate = ({
    productId,
    seatId,
    dateTime,
    discounts,
    customFields,
    onSuccess,
}: Omit<CreateModeProps, 'mode'>) => {
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [orderStatus, setOrderStatus] = useState('completed');
    const [sendEmails, setSendEmails] = useState(true);
    const [selectedDiscountName, setSelectedDiscountName] = useState<string>('');
    const [customFieldValues, setCustomFieldValues] = useState<Record<string, string | number | boolean>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const editableCustomFields = useMemo(
        () => (customFields || []).filter((f) => (EDITABLE_FIELD_TYPES as readonly string[]).includes(f.type)),
        [customFields]
    );

    const valuesByUid = useMemo(
        () => buildValuesByUid(customFieldValues, editableCustomFields),
        [customFieldValues, editableCustomFields]
    );

    const visibleCustomFields = useMemo(() => {
        const byConditions = editableCustomFields.filter((_, index) =>
            isFieldVisible(index, editableCustomFields, valuesByUid)
        );
        return byConditions.filter(
            (field) => !isHiddenByMutualExclusivity(field, byConditions, customFieldValues)
        );
    }, [editableCustomFields, valuesByUid, customFieldValues]);

    const { createOrder, loading: isCreatingOrder, error: createOrderError, clearError: clearCreateOrderError } =
        useCreateOrder();

    const clearForm = useCallback(() => {
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setOrderStatus('completed');
        setSendEmails(true);
        setSelectedDiscountName('');
        setCustomFieldValues({});
        setSuccessMessage(null);
        clearCreateOrderError();
    }, [clearCreateOrderError]);

    const selectedDiscount =
        selectedDiscountName && discounts?.length ? discounts.find((d) => d.name === selectedDiscountName) : null;

    const setCustomFieldValue = useCallback(
        (label: string, value: string | number | boolean) => {
            setCustomFieldValues((prev) => {
                const next = { ...prev, [label]: value };
                const field = editableCustomFields.find((f) => f.label === label);
                if (!field) return next;
                const isEmpty =
                    value === '' ||
                    value === undefined ||
                    (typeof value === 'string' && !value.trim()) ||
                    (field.type === 'checkbox' && (value === false || value === ''));
                if (isEmpty) return next;
                const uidsToClear = new Set<string>();
                const thisUid = field.uid ?? field.label;
                if (field.mutuallyExclusiveWith) field.mutuallyExclusiveWith.forEach((uid) => uidsToClear.add(uid));
                editableCustomFields.forEach((f) => {
                    if ((f.uid ?? f.label) !== thisUid && f.mutuallyExclusiveWith?.includes(thisUid))
                        uidsToClear.add(f.uid ?? f.label);
                });
                uidsToClear.forEach((uid) => {
                    const other = editableCustomFields.find((f) => (f.uid ?? f.label) === uid);
                    if (other && other.label in next) delete next[other.label];
                });
                return next;
            });
            setSuccessMessage(null);
            clearCreateOrderError();
        },
        [editableCustomFields, clearCreateOrderError]
    );

    const getCustomFieldValue = useCallback(
        (field: ManagerCustomFieldData): string | number | boolean => {
            const v = customFieldValues[field.label];
            if (v !== undefined && v !== '') return v;
            if (field.type === 'checkbox') return false;
            if (field.type === 'number') return '';
            return '';
        },
        [customFieldValues]
    );

    const handleFieldChange = useCallback(() => {
        setSuccessMessage(null);
        clearCreateOrderError();
    }, [clearCreateOrderError]);

    const handleCreateOrder = async () => {
        if (!productId || !seatId) return;

        if (!customerName.trim()) {
            toast.error(__('CUSTOMER_NAME_REQUIRED'));
            return;
        }

        if (!customerEmail.trim()) {
            toast.error(__('CUSTOMER_EMAIL_REQUIRED'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            toast.error(__('CUSTOMER_EMAIL_INVALID'));
            return;
        }

        for (const field of visibleCustomFields) {
            if (field.required) {
                const val = getCustomFieldValue(field);
                const isEmpty =
                    val === '' || val === undefined || (typeof val === 'string' && !val.trim());
                if (isEmpty) {
                    toast.error(__('CUSTOM_FIELD_REQUIRED').replace('%s', field.label));
                    return;
                }
            }
            if (field.type === 'number') {
                const val = getCustomFieldValue(field);
                if (val === '' || val === undefined) continue;
                const num = Number(val);
                if (!Number.isFinite(num)) continue;
                if (field.min != null && num < field.min) {
                    toast.error(
                        __('CUSTOM_FIELD_NUMBER_MIN').replace('%1$s', field.label).replace('%2$s', String(field.min))
                    );
                    return;
                }
                if (field.max != null && num > field.max) {
                    toast.error(
                        __('CUSTOM_FIELD_NUMBER_MAX').replace('%1$s', field.label).replace('%2$s', String(field.max))
                    );
                    return;
                }
            }
        }

        setSuccessMessage(null);
        clearCreateOrderError();

        const toastId = toast.loading(__('CREATING_ORDER'));

        const seatCustomFields: Record<string, string | number | boolean> = {};
        for (const field of visibleCustomFields) {
            const val = getCustomFieldValue(field);
            if (field.type === 'checkbox') {
                const isChecked =
                    val === true || val === '1' || val === 'yes' || (field.checkedValue && val === field.checkedValue);
                seatCustomFields[field.label] = isChecked ? (field.checkedValue || 'yes') : '';
            } else if (val !== '' && val !== undefined) {
                seatCustomFields[field.label] = typeof val === 'number' ? val : String(val);
            }
        }

        try {
            const result = await createOrder(
                productId,
                seatId,
                dateTime,
                {
                    customerName: customerName.trim(),
                    customerEmail: customerEmail.trim(),
                    customerPhone: customerPhone.trim(),
                    orderStatus,
                    sendEmails,
                    seatDiscount: selectedDiscount && selectedDiscount.value > 0 ? selectedDiscount : null,
                    seatCustomFields: Object.keys(seatCustomFields).length > 0 ? seatCustomFields : undefined,
                }
            );

            if (result.success) {
                toast.success(__('ORDER_CREATED_SUCCESSFULLY'), { id: toastId });
                setSuccessMessage(__('ORDER_CREATED_SUCCESSFULLY'));
                clearForm();
                onSuccess?.();
            } else {
                const errorMessage = result.error || createOrderError || __('FAILED_TO_CREATE_ORDER');
                toast.error(errorMessage, { id: toastId });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : __('FAILED_TO_CREATE_ORDER');
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div className="stachesepl-manager-edit-seat-order">
            <div className="stachesepl-manager-edit-seat-order-header">
                <AddShoppingCart className="stachesepl-manager-edit-seat-order-icon" />
                <div className="stachesepl-manager-edit-seat-order-header-content">
                    <h4 className="stachesepl-manager-edit-seat-form-title">{__('CREATE_ORDER')}</h4>
                    <p className="stachesepl-manager-edit-seat-form-description">
                        {__('CREATE_ORDER_FOR_SEAT_DESC')}
                    </p>
                </div>
            </div>

            <div className="stachesepl-manager-edit-seat-order-form">
                <div className="stachesepl-manager-edit-seat-form-field">
                    <Input
                        label={__('CUSTOMER_NAME')}
                        value={customerName}
                        onChange={(e) => {
                            setCustomerName(e.target.value);
                            handleFieldChange();
                        }}
                        disabled={isCreatingOrder}
                        placeholder={__('ENTER_CUSTOMER_NAME')}
                    />
                </div>

                <div className="stachesepl-manager-edit-seat-form-field">
                    <Input
                        type="email"
                        label={__('CUSTOMER_EMAIL')}
                        value={customerEmail}
                        onChange={(e) => {
                            setCustomerEmail(e.target.value);
                            handleFieldChange();
                        }}
                        disabled={isCreatingOrder}
                        placeholder={__('ENTER_CUSTOMER_EMAIL')}
                    />
                </div>

                <div className="stachesepl-manager-edit-seat-form-field">
                    <Input
                        type="tel"
                        label={`${__('CUSTOMER_PHONE')} (${__('OPTIONAL')})`}
                        value={customerPhone}
                        onChange={(e) => {
                            setCustomerPhone(e.target.value);
                            handleFieldChange();
                        }}
                        disabled={isCreatingOrder}
                        placeholder={__('ENTER_CUSTOMER_PHONE')}
                    />
                </div>

                <div className="stachesepl-manager-edit-seat-form-field">
                    <Select
                        label={__('ORDER_STATUS')}
                        value={orderStatus}
                        onChange={(e) => {
                            setOrderStatus(e.target.value);
                            handleFieldChange();
                        }}
                        options={[
                            { value: 'pending', label: __('PENDING') },
                            { value: 'processing', label: __('PROCESSING') },
                            { value: 'on-hold', label: __('ON_HOLD') },
                            { value: 'completed', label: __('COMPLETED') },
                        ]}
                        disabled={isCreatingOrder}
                    />
                </div>

                {discounts && discounts.length > 0 && (
                    <div className="stachesepl-manager-edit-seat-form-field">
                        <Select
                            label={`${__('DISCOUNT')} (${__('OPTIONAL')})`}
                            value={selectedDiscountName}
                            onChange={(e) => {
                                setSelectedDiscountName(e.target.value);
                                handleFieldChange();
                            }}
                            options={[
                                { value: '', label: __('NO_DISCOUNT') },
                                ...discounts.map((d) => ({
                                    value: d.name,
                                    label: `${d.name} (${d.type === 'percentage' ? `${d.value}%` : d.value})`,
                                })),
                            ]}
                            disabled={isCreatingOrder}
                        />
                    </div>
                )}

                <CustomFieldInputs
                    fields={visibleCustomFields}
                    getValue={getCustomFieldValue}
                    onChange={setCustomFieldValue}
                    disabled={isCreatingOrder}
                />

                <div className="stachesepl-manager-edit-seat-form-field">
                    <Checkbox
                        label={__('SEND_ORDER_EMAILS')}
                        checked={sendEmails}
                        onChange={(e) => {
                            setSendEmails(e.target.checked);
                            handleFieldChange();
                        }}
                        disabled={isCreatingOrder}
                    />
                </div>
            </div>

            {createOrderError && (
                <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--error">
                    <Warning className="stachesepl-manager-edit-seat-message-icon" />
                    {createOrderError}
                </div>
            )}

            {successMessage && (
                <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--success">
                    <CheckCircle className="stachesepl-manager-edit-seat-message-icon" />
                    {successMessage}
                </div>
            )}

            <div className="stachesepl-manager-edit-seat-actions">
                <Button
                    onClick={handleCreateOrder}
                    disabled={isCreatingOrder || !customerName.trim() || !customerEmail.trim()}
                >
                    {isCreatingOrder ? <>{__('CREATING_ORDER')}</> : <>{__('CREATE_ORDER')}</>}
                </Button>
                <Button variant="secondary" onClick={clearForm} disabled={isCreatingOrder}>
                    {__('CLEAR_FORM')}
                </Button>
            </div>
        </div>
    );
};

const SeatOrderFormEdit = () => {
    const {
        orderDetails,
        seatDataDiscounts,
        editedSeatId,
        editedDate,
        editedDiscountName,
        visibleCustomFields,
        isOrderSaving,
        hasOrderChanges,
        orderSaveError,
        orderSuccessMessage,
        formatDateForInput,
        getCustomFieldValue,
        onSeatIdChange,
        onDateChange,
        onDiscountChange,
        onCustomFieldChange,
        onSaveOrder,
        onResetOrder,
    } = useEditSeatOrderContext();

    return (
        <div className="stachesepl-manager-edit-seat-order">
            <div className="stachesepl-manager-edit-seat-order-header">
                <Receipt className="stachesepl-manager-edit-seat-order-icon" />
                <div className="stachesepl-manager-edit-seat-order-header-content">
                    <h4 className="stachesepl-manager-edit-seat-form-title">{__('ORDER_DETAILS')}</h4>
                    <p className="stachesepl-manager-edit-seat-form-description">{__('ORDER_DETAILS_DESC')}</p>
                </div>
            </div>

            <OrderInfoGrid />

            <div className="stachesepl-manager-edit-seat-order-form">
                <div className="stachesepl-manager-edit-seat-form-field">
                    <Input
                        label={__('NEW_SEAT_ID')}
                        value={editedSeatId}
                        onChange={onSeatIdChange}
                        disabled={isOrderSaving}
                    />
                </div>

                {orderDetails.has_dates && (
                    <div className="stachesepl-manager-edit-seat-form-field">
                        <Input
                            type="datetime-local"
                            label={__('NEW_DATE')}
                            value={formatDateForInput(editedDate)}
                            onChange={onDateChange}
                            disabled={isOrderSaving}
                        />
                    </div>
                )}

                {seatDataDiscounts && seatDataDiscounts.length > 0 && (
                    <div className="stachesepl-manager-edit-seat-form-field">
                        <Select
                            label={`${__('DISCOUNT')} (${__('OPTIONAL')})`}
                            value={editedDiscountName}
                            onChange={onDiscountChange}
                            options={[
                                { value: '', label: __('NO_DISCOUNT') },
                                ...seatDataDiscounts.map((d) => ({
                                    value: d.name,
                                    label: `${d.name} (${d.type === 'percentage' ? `${d.value}%` : d.value})`,
                                })),
                            ]}
                            disabled={isOrderSaving}
                        />
                    </div>
                )}

                <CustomFieldInputs
                    fields={visibleCustomFields}
                    getValue={getCustomFieldValue}
                    onChange={onCustomFieldChange}
                    disabled={isOrderSaving}
                />
            </div>

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

            <div className="stachesepl-manager-edit-seat-actions">
                <Button onClick={onSaveOrder} disabled={isOrderSaving || !hasOrderChanges}>
                    {isOrderSaving ? <>{__('SAVING')}</> : <>{__('UPDATE_ORDER')}</>}
                </Button>
                <Button variant="secondary" onClick={onResetOrder} disabled={isOrderSaving || !hasOrderChanges}>
                    {__('CANCEL')}
                </Button>
            </div>
        </div>
    );
};

export default SeatOrderForm;
