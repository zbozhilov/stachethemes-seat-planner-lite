import { __ } from '@src/utils';
import Checkbox from '@src/admin/Dashboard/layout/Checkbox';
import Input from '@src/admin/Dashboard/layout/Input';
import Select from '@src/admin/Dashboard/layout/Select';
import type { ManagerCustomFieldData, ManagerCustomFieldOption } from '../../../types';
import Textarea from '@src/admin/Dashboard/layout/Textarea';

type CustomFieldInputsProps = {
    fields: ManagerCustomFieldData[];
    getValue: (field: ManagerCustomFieldData) => string | number | boolean;
    onChange: (label: string, value: string | number | boolean) => void;
    disabled?: boolean;
};

const CustomFieldInputs = ({ fields, getValue, onChange, disabled }: CustomFieldInputsProps) => {
    if (fields.length === 0) return null;

    return (
        <>
            {fields.map((field) => {
                const label = field.required ? `${field.label} *` : field.label;
                const value = getValue(field);

                if (field.type === 'text') {
                    return (
                        <div key={field.uid || field.label} className="stachesepl-manager-edit-seat-form-field">
                            <Input
                                label={label}
                                value={String(value)}
                                onChange={(e) => onChange(field.label, e.target.value)}
                                disabled={disabled}
                                placeholder={field.placeholder}
                            />
                        </div>
                    );
                }

                if (field.type === 'textarea') {
                    return (
                        <div key={field.uid || field.label} className="stachesepl-manager-edit-seat-form-field">
                            
                            <Textarea 
                                label={label}
                                value={String(value)}
                                onChange={(e) => onChange(field.label, e.target.value)}
                                disabled={disabled}
                                placeholder={field.placeholder}
                                rows={3}
                            />
                        </div>
                    );
                }

                if (field.type === 'number') {
                    return (
                        <div key={field.uid || field.label} className="stachesepl-manager-edit-seat-form-field">
                            <Input
                                type="number"
                                label={label}
                                value={value === '' ? '' : String(value)}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    onChange(field.label, v === '' ? '' : (parseFloat(v) ?? 0));
                                }}
                                disabled={disabled}
                                placeholder={field.placeholder}
                                min={field.min}
                                max={field.max}
                            />
                        </div>
                    );
                }

                if (field.type === 'checkbox') {
                    const isChecked =
                        value === true ||
                        value === '1' ||
                        value === 'yes' ||
                        (field.checkedValue && value === field.checkedValue);
                    return (
                        <div key={field.uid || field.label} className="stachesepl-manager-edit-seat-form-field">
                            <Checkbox
                                label={label}
                                checked={!!isChecked}
                                onChange={(e) =>
                                    onChange(field.label, e.target.checked ? (field.checkedValue || 'yes') : '')
                                }
                                disabled={disabled}
                            />
                        </div>
                    );
                }

                if (field.type === 'select' && field.options?.length) {
                    const options = field.options.map((opt: ManagerCustomFieldOption) => ({
                        value: opt.label,
                        label: opt.label,
                    }));
                    return (
                        <div key={field.uid || field.label} className="stachesepl-manager-edit-seat-form-field">
                            <Select
                                label={label}
                                value={String(value)}
                                onChange={(e) => onChange(field.label, e.target.value)}
                                options={[{ value: '', label: `— ${__('SELECT')} —` }, ...options]}
                                disabled={disabled}
                            />
                        </div>
                    );
                }

                return null;
            })}
        </>
    );
};

export default CustomFieldInputs;
