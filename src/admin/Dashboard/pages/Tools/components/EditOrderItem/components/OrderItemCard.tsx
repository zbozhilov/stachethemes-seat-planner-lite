import Input from '../../../../../layout/Input/Input'
import Select from '../../../../../layout/Select/Select'
import { __, getFormattedPrice } from '@src/utils'
import type { OrderItem } from '../types'
import { useEditOrderItemContext } from '../context/EditOrderItemContext'
import OrderItemCustomField from './OrderItemCustomField'

type OrderItemCardProps = {
    item: OrderItem
}

const OrderItemCard = ({ item }: OrderItemCardProps) => {
    const {
        getItemValue,
        getCustomFieldValueForField,
        getItemDiscountName,
        getVisibleCustomFieldsForItem,
        onItemChange,
        onDiscountChange,
        formatDateForInput,
    } = useEditOrderItemContext()

    const visibleCustomFields = getVisibleCustomFieldsForItem(item)

    return (
        <div className="stachesepl-eoi-item">
            <div className="stachesepl-eoi-item-header">
                <div className="stachesepl-eoi-item-product">
                    <span className="stachesepl-eoi-item-name">{item.product_name}</span>
                    <span className="stachesepl-eoi-item-id">
                        {__('EDIT_ORDER_ITEM_ID')}: #{item.item_id}
                    </span>
                </div>
                <a
                    href={`${window.stachesepl_admin_url.admin_url}post.php?post=${item.product_id}&action=edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stachesepl-eoi-item-product-link"
                >
                    {__('EDIT_ORDER_VIEW_PRODUCT')}
                </a>
            </div>

            {item.seat_data.qr_code_scanned && (
                <div className="stachesepl-eoi-item-scanned">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>{__('EDIT_ORDER_TICKET_SCANNED')}</span>
                </div>
            )}

            <div className="stachesepl-eoi-item-fields">
                <div className="stachesepl-eoi-field">
                    <Input
                        label={__('SEAT_ID')}
                        value={getItemValue(item, 'seatId')}
                        onChange={(e) => onItemChange(item.item_id, 'seatId', e.target.value)}
                    />
                </div>

                {item.has_dates && (
                    <div className="stachesepl-eoi-field">
                        <Input
                            type="datetime-local"
                            label={__('DATE')}
                            value={formatDateForInput(getItemValue(item, 'selectedDate'))}
                            onChange={(e) => onItemChange(item.item_id, 'selectedDate', e.target.value)}
                        />
                    </div>
                )}

                {item.discounts && item.discounts.length > 0 && (
                    <div className="stachesepl-eoi-field">
                        <Select
                            label={`${__('DISCOUNT')} (${__('OPTIONAL')})`}
                            value={getItemDiscountName(item)}
                            onChange={(e) => onDiscountChange(item.item_id, e.target.value)}
                            options={[
                                { value: '', label: __('NO_DISCOUNT') },
                                ...item.discounts.map(d => ({
                                    value: d.name,
                                    label: `${d.name} (${d.type === 'percentage' ? `${d.value}%` : d.value})`,
                                })),
                            ]}
                        />
                    </div>
                )}

                {visibleCustomFields.length > 0 && (
                    <div className="stachesepl-eoi-custom-fields">
                        <div className="stachesepl-eoi-custom-fields-grid">
                            {visibleCustomFields.map((field) => (
                                <OrderItemCustomField
                                    key={field.uid || field.label}
                                    field={field}
                                    value={getCustomFieldValueForField(item, field)}
                                    itemId={item.item_id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!isNaN(item.seat_price) && item.seat_price > 0 && (
                <div className="stachesepl-eoi-item-total">
                    <span className="stachesepl-eoi-item-total-label">
                        {__('SEAT_TOTAL')}
                    </span>
                    <span
                        className="stachesepl-eoi-item-total-value"
                        dangerouslySetInnerHTML={{
                            __html: getFormattedPrice(item.seat_price),
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default OrderItemCard
