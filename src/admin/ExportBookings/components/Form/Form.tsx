import { __ } from '@src/utils';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../Button/Button';
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
];

const Form = () => {
    const abortControllerRef = useRef<AbortController | null>(null);
    const [fetchData, setFetchData] = useState<boolean>(false);
    const [data, setData] = useState<null | AjaxResponseData>(null);
    const [loading, setIsLoading] = useState(false);
    const [downloadReady, setDownloadReady] = useState(false);
    const toastId = useRef<string | null>(null);
    const [selectedFields, setSelectedFields] = useState(() =>
        AVAILABLE_FIELDS.map(field => field.id)
    );

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
                    toast.success(__('EXPORT_BOOKINGS_SUCCESS_NO_DATA'), {
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
    }, [fetchData]);

    useEffect(() => {
        if (data && data.length && selectedFields.length > 0 && downloadReady) {
            // Function to convert data to CSV
            const convertToCSV = (bookings: AjaxResponseData) => {

                const headers = selectedFields.map(fieldId => {
                    const field = AVAILABLE_FIELDS.find(f => f.id === fieldId);
                    return field ? __(field.label) : '';
                });

                const rows = bookings.map(booking =>
                    selectedFields.map(fieldId => {
                        const value = booking[fieldId as keyof typeof booking];
                        const stringValue = value !== undefined && value !== null ? String(value) : '';
                        return `"${stringValue.replace(/"/g, '""')}"`;  // Handle quotes in CSV
                    })
                );

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
                link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
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
    }, [data, selectedFields, downloadReady]);

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
                            className="stachesepl-export-bookings-select-all-button"
                            onClick={() => toggleAllFields(true)}
                            disabled={selectedFields.length === AVAILABLE_FIELDS.length}
                        >
                            {__('SELECT_ALL')}
                        </button>
                        <button
                            className="stachesepl-export-bookings-deselect-all-button"
                            onClick={() => toggleAllFields(false)}
                            disabled={selectedFields.length === 0}
                        >
                            {__('DESELECT_ALL')}
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