import Input from '../../../../../layout/Input/Input'
import Select from '../../../../../layout/Select/Select'
import Checkbox from '../../../../../layout/Checkbox/Checkbox'
import { __ } from '@src/utils'
import type { ManagerCustomFieldData } from '../../../../Manager/types'
import { useEditOrderItemContext } from '../context/EditOrderItemContext'
import Textarea from '@src/admin/Dashboard/layout/Textarea';

type OrderItemCustomFieldProps = {
    field: ManagerCustomFieldData
    value: string | number | boolean
    itemId: number
}

const OrderItemCustomField = ({ field, value, itemId }: OrderItemCustomFieldProps) => {
    const { onCustomFieldChange } = useEditOrderItemContext()
    const label = field.required ? `${field.label} *` : field.label

    if (field.type === 'text') {
        return (
            <div className="stachesepl-eoi-field">
                <Input
                    label={label}
                    value={String(value)}
                    onChange={(e) => onCustomFieldChange(itemId, field.label, e.target.value)}
                    placeholder={field.placeholder}
                />
            </div>
        )
    }

    if (field.type === 'textarea') {
        return (
            <div className="stachesepl-eoi-field">
                <Textarea
                    label={label}
                    value={String(value)}
                    onChange={(e) => onCustomFieldChange(itemId, field.label, e.target.value)}
                    placeholder={field.placeholder}
                />
            </div>
        )
    }

    if (field.type === 'number') {
        return (
            <div className="stachesepl-eoi-field">
                <Input
                    type="number"
                    label={label}
                    value={value === '' ? '' : String(value)}
                    onChange={(e) => {
                        const v = e.target.value
                        onCustomFieldChange(itemId, field.label, v === '' ? '' : parseFloat(v) ?? 0)
                    }}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                />
            </div>
        )
    }

    if (field.type === 'checkbox') {
        const isChecked =
            value === true ||
            value === '1' ||
            value === 'yes' ||
            (field.checkedValue && value === field.checkedValue)
        return (
            <div className="stachesepl-eoi-field">
                <Checkbox
                    label={label}
                    checked={!!isChecked}
                    onChange={(e) =>
                        onCustomFieldChange(
                            itemId,
                            field.label,
                            e.target.checked ? (field.checkedValue || 'yes') : ''
                        )
                    }
                />
            </div>
        )
    }

    if (field.type === 'select' && field.options?.length) {
        const options = field.options.map(opt => ({
            value: opt.label,
            label: opt.label,
        }))
        return (
            <div className="stachesepl-eoi-field">
                <Select
                    label={label}
                    value={String(value)}
                    onChange={(e) => onCustomFieldChange(itemId, field.label, e.target.value)}
                    options={[{ value: '', label: `— ${__('SELECT')} —` }, ...options]}
                />
            </div>
        )
    }

    return null
}

export default OrderItemCustomField
