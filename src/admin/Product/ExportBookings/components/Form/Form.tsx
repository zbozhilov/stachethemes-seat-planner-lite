import { __, getFormattedDateTime } from '@src/utils';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import './Form.scss';
import { AjaxResponseData } from './types';

const AVAILABLE_FIELDS = [
    { id: 'order_id', label: 'ORDER_ID' },
    { id: 'order_date', label: 'DATE_CREATED' },
    { id: 'order_status', label: 'ORDER_STATUS' },
    { id: 'customer_name', label: 'CUSTOMER_NAME' },
    { id: 'customer_email', label: 'CUSTOMER_EMAIL' },
    { id: 'product_name', label: 'PRODUCT_NAME' },
    { id: 'product_note', label: 'PRODUCT_NOTE' },
    { id: 'seat_id', label: 'SEAT_ID' },     
    { id: 'date_time', label: 'DATE_TIME' },
    { id: 'seat_price', label: 'SEAT_PRICE' },
    { id: 'custom_fields', label: 'EXPORT_CUSTOM_FIELDS' },
];

const Form = (props: {
    datesData?: string[];
}) => {
    const abortControllerRef = useRef<AbortController | null>(null);
    const [fetchData, setFetchData] = useState<boolean>(false);
    const [data, setData] = useState<null | AjaxResponseData>(null);
    const [loading, setIsLoading] = useState(false);
    const [downloadReady, setDownloadReady] = useState(false);
    const toastId = useRef<string | null>(null);
    const [selectedFields, setSelectedFields] = useState(() =>
        AVAILABLE_FIELDS.filter(field => field.id !== 'custom_fields').map(field => field.id)
    );
    const [selectedDate, setSelectedDate] = useState<string>('');

    const handleFieldToggle = (fieldId: string) => {
        setDownloadReady(false); // Reset download flag when fields change
        setSelectedFields(prev => {
            if (prev.includes(fieldId)) {
                return prev.filter(id => id !== fieldId);
            } else {
                return [...prev, fieldId];
            }
        });
    };

    const toggleAllFields = (selectAll: boolean) => {
        setDownloadReady(false); // Reset download flag when fields change
        setSelectedFields(selectAll ? AVAILABLE_FIELDS.map(field => field.id) : []);
    };

    useEffect(() => {
        const ensureAbortController = () => {
            if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
                abortControllerRef.current = new AbortController();
            }
            return abortControllerRef.current;
        };

        const fetchBookingData = async () => {
            try {
                const controller = ensureAbortController();
                setIsLoading(true);

                toastId.current = toast.loading(__('EXPORT_BOOKINGS_LOADING'), { duration: 30 * 1000 });

                const productId = document.querySelector<HTMLInputElement>('#stachesepl-export-bookings-product-id')?.value;

                if (!productId) {
                    return;
                }

                const response = await fetch(window.stachesepl_ajax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'seatplanner',
                        task: 'get_bookings_data',
                        product_id: productId.toString(),
                        ...(selectedDate ? { selected_date: selectedDate } : {}),
                        nonce: window.stachesepl_ajax.nonce,
                    }),
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(__('EXPORT_BOOKINGS_ERROR'));
                }

                const result = await response.json();

                if (result.data.error) {
                    throw new Error(result.data.error);
                }

                setData(result.data);
                setDownloadReady(true);

                if (result.data.length === 0) {
                    toast.success(selectedDate ? __('EXPORT_BOOKINGS_SUCCESS_NO_DATA_FOR_DATE', 0) : __('EXPORT_BOOKINGS_SUCCESS_NO_DATA'), {
                        id: toastId.current,
                        duration: 3 * 1000,
                    });

                    return;
                }

                toast.success(__('EXPORT_BOOKINGS_SUCCESS'), {
                    id: toastId.current,
                    duration: 3 * 1000,
                });

            } catch (error) {

                if (abortControllerRef.current?.signal.aborted) {
                    return;
                }

                setIsLoading(false);

                if (toastId.current) {

                    const errorMessage = error instanceof Error ? error.message : __('EXPORT_BOOKINGS_ERROR');

                    toast.error(errorMessage, {
                        id: toastId.current,
                        duration: 3 * 1000,
                    });
                }

            } finally {
                setFetchData(false);
                setIsLoading(false);
            }
        }

        if (fetchData) {
            fetchBookingData();
        }
    }, [fetchData, selectedDate]);

    useEffect(() => {
        if (data && data.length && selectedFields.length > 0 && downloadReady) {
            // Function to convert data to CSV
            const convertToCSV = (bookings: AjaxResponseData) => {

                const customFieldKeys =
                    selectedFields.includes('custom_fields')
                        ? Array.from(
                            new Set(
                                bookings.flatMap((b) =>
                                    b.custom_fields && typeof b.custom_fields === 'object'
                                        ? Object.keys(b.custom_fields)
                                        : []
                                )
                            )
                        ).sort((a, b) => a.localeCompare(b))
                        : [];

                type Column =
                    | { type: 'field'; id: string }
                    | { type: 'custom_field'; key: string };

                const columns: Column[] = [];
                for (const fieldId of selectedFields) {
                    if (fieldId !== 'custom_fields') {
                        columns.push({ type: 'field', id: fieldId });
                        continue;
                    }

                    // Expand to one column per discovered custom field (only if any exist).
                    for (const key of customFieldKeys) {
                        columns.push({ type: 'custom_field', key });
                    }
                }

                const headers = columns.map((col) => {
                    if (col.type === 'field') {
                        const field = AVAILABLE_FIELDS.find(f => f.id === col.id);
                        return field ? __(field.label) : '';
                    }
                    return `CF: ${col.key}`;
                });

                const rows = bookings.map(booking => (
                    columns.map((col) => {
                        let value: unknown;
                        if (col.type === 'field') {
                            value = booking[col.id as keyof typeof booking];
                        } else {
                            value = booking.custom_fields?.[col.key];
                        }
                        const stringValue = value !== undefined && value !== null ? String(value) : '';
                        return `"${stringValue.replace(/"/g, '""')}"`;  // Handle quotes in CSV
                    })
                ));

                return [
                    headers.join(','),
                    ...rows.map(row => row.join(','))
                ].join('\n');
            };

            const downloadCSV = (csvContent: string) => {
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);

                link.setAttribute('href', url);
                const baseDate = new Date().toISOString().split('T')[0];
                const dateSuffix = selectedDate ? `_${selectedDate.replace(/[:]/g, '-')}` : '';
                link.setAttribute('download', `bookings_export_${baseDate}${dateSuffix}.csv`);
                link.style.visibility = 'hidden';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            };

            const csvContent = convertToCSV(data);
            downloadCSV(csvContent);
            setDownloadReady(false); // Reset the download flag after downloading
        }
    }, [data, selectedFields, downloadReady, selectedDate]);

    return (
        <div className="stachesepl-export-bookings">

            <div className="stachesepl-export-bookings-field-selection">
                <div className="stachesepl-export-bookings-field-selection-header">
                    <div>

                        <h4 className='stachesepl-export-bookings-field-selection-header-title'>{__('SELECT_FIELDS_TO_EXPORT')}</h4>
                        <p className='stachesepl-export-bookings-field-selection-header-subtitle'>
                            {__('SELECT_FIELDS_TO_EXPORT_DESCRIPTION')}
                        </p>
                    </div>

                    <div className="stachesepl-export-bookings-select-all-controls">
                        <button
                            type="button"
                            className="stachesepl-export-bookings-select-all-toggle"
                            onClick={() => toggleAllFields(selectedFields.length !== AVAILABLE_FIELDS.length)}
                        >
                            {selectedFields.length === AVAILABLE_FIELDS.length
                                ? __('DESELECT_ALL')
                                : __('SELECT_ALL')}
                        </button>
                    </div>
                </div>

                <div className="stachesepl-export-bookings-field-checkboxes">
                    {AVAILABLE_FIELDS.map((field) => (
                        <div key={field.id} className="stachesepl-export-bookings-field-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedFields.includes(field.id)}
                                    onChange={() => handleFieldToggle(field.id)}
                                />
                                {__(field.label)}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {Array.isArray(props.datesData) && props.datesData.length > 0 && (
                <div className="stachesepl-export-bookings-date-filter">
                    <span>{__('FILTER_BY_DATE')}</span>
                    <select
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setDownloadReady(false);
                        }}
                    >
                        <option value="">{__('ALL_DATES')}</option>
                        {[...props.datesData].sort((a, b) => a.localeCompare(b)).map((d) => (
                            <option key={d} value={d}>
                                {getFormattedDateTime(d)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <Button
                disabled={loading || selectedFields.length === 0}
                onClick={() => {

                    if (selectedFields.length === 0) {
                        toast.error(__('PLEASE_SELECT_AT_LEAST_ONE_FIELD'));
                        return;
                    }

                    setFetchData(true);
                    setIsLoading(true);
                    setDownloadReady(false); // Reset download flag before fetching new data
                }}
            >
                {__('EXPORT_BOOKINGS')}
            </Button>
        </div>
    )
}

export default Form