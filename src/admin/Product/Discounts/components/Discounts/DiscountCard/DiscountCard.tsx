import { Close as Delete, ExpandLess, ExpandMore } from '@mui/icons-material';
import { __, getFormattedPrice } from '@src/utils';
import { discountData } from '../types';
import './DiscountCard.scss';

interface DiscountCardProps {
    discount: discountData;
    isExpanded: boolean;
    roles: { key: string; value: string }[];
    discountGroups: string[];
    onToggleExpanded: () => void;
    onChange: (updates: Partial<discountData>) => void;
    onRemove: () => void;
}

const DiscountCard = ({
    discount,
    isExpanded,
    roles,
    discountGroups,
    onToggleExpanded,
    onChange,
    onRemove
}: DiscountCardProps) => {

    const formatValueDisplay = (): string => {
        if (discount.type === 'percentage') {
            return `${discount.value}%`;
        }
        return getFormattedPrice(discount.value);
    };

    const headerLabel = discount.name?.trim() || __('NEW_DISCOUNT');

    return (
        <div className="stachesepl-discount-card">
            <div className={`stachesepl-discount-card-header ${!isExpanded ? 'stachesepl-discount-card-header-collapsed' : ''}`}>
                <div className="stachesepl-discount-card-header-left">
                    <span className="stachesepl-discount-card-title">
                        {headerLabel}
                    </span>
                </div>
                <div className="stachesepl-discount-card-header-right">
                    <span className="stachesepl-discount-card-badge">
                        {formatValueDisplay()}
                    </span>
                    <button
                        type="button"
                        className="stachesepl-discount-card-toggle"
                        onClick={onToggleExpanded}
                        title={isExpanded ? __('COLLAPSE') : __('EXPAND')}
                    >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </button>
                    <button
                        type="button"
                        className="stachesepl-discount-card-remove"
                        onClick={onRemove}
                        title={__('REMOVE')}
                    >
                        <Delete />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="stachesepl-discount-card-body">
                    <div className="stachesepl-discount-card-fields">
                        <label className="stachesepl-discount-card-field">
                            <span>{__('DISCOUNT_NAME')}*</span>
                            <input
                                type="text"
                                value={discount.name}
                                onChange={(e) => onChange({ name: e.target.value })}
                                placeholder={__('DISCOUNT_NAME')}
                            />
                        </label>

                        <label className="stachesepl-discount-card-field">
                            <span>{__('SEAT_GROUP')}</span>
                            <select
                                value={discount.group ?? ''}
                                onChange={(e) => onChange({ group: e.target.value })}
                            >
                                <option value="">{__('ALL_SEATS')}</option>
                                {discountGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </label>

                        <label className="stachesepl-discount-card-field">
                            <span>{__('USER_ROLE')}</span>
                            <select
                                value={discount.role ?? ''}
                                onChange={(e) => onChange({ role: e.target.value })}
                            >
                                <option value="">{__('NO_ROLE')}</option>
                                {roles.map(role => (
                                    <option key={role.key} value={role.key}>{role.value}</option>
                                ))}
                            </select>
                        </label>

                        <label className="stachesepl-discount-card-field">
                            <span>{__('DISCOUNT_TYPE')}</span>
                            <select
                                value={discount.type}
                                onChange={(e) => {
                                    const type = e.target.value as discountData['type'];
                                    onChange({
                                        type,
                                        value: type === 'percentage'
                                            ? Math.max(0, Math.min(100, discount.value))
                                            : discount.value
                                    });
                                }}
                            >
                                <option value="percentage">{__('PERCENTAGE')}</option>
                                <option value="fixed">{__('FIXED')}</option>
                            </select>
                        </label>

                        <label className="stachesepl-discount-card-field">
                            <span>{__('DISCOUNT_VALUE')}</span>
                            <input
                                type="number"
                                step="1"
                                min="0"
                                max={discount.type === 'percentage' ? 100 : undefined}
                                value={discount.value}
                                onChange={(e) => {
                                    let numValue = parseFloat(e.target.value || '0');
                                    if (discount.type === 'percentage') {
                                        numValue = Math.max(0, Math.min(100, numValue));
                                    }
                                    onChange({ value: numValue });
                                }}
                                placeholder={__('DISCOUNT_VALUE')}
                            />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountCard;
