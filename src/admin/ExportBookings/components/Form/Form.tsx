import { __ } from '@src/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../Button/Button';
import './Form.scss';

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
    const [selectedFields, setSelectedFields] = useState(() =>
        AVAILABLE_FIELDS.map(field => field.id)
    );

    const handleFieldToggle = (fieldId: string) => {
        setSelectedFields(prev => {
            if (prev.includes(fieldId)) {
                return prev.filter(id => id !== fieldId);
            } else {
                return [...prev, fieldId];
            }
        });
    };

    const toggleAllFields = (selectAll: boolean) => {
        setSelectedFields(selectAll ? AVAILABLE_FIELDS.map(field => field.id) : []);
    };

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
                disabled={selectedFields.length === 0}
                onClick={() => {

                    if (selectedFields.length === 0) {
                        toast.error(__('PLEASE_SELECT_AT_LEAST_ONE_FIELD'));
                        return;
                    }

                    toast.error(__('EXPORT_BOOKINGS_NOT_AVAILABLE_FOR_LITE_VERSION'));
                }}
            >
                {__('EXPORT_BOOKINGS')}
            </Button>
        </div>
    )
}

export default Form