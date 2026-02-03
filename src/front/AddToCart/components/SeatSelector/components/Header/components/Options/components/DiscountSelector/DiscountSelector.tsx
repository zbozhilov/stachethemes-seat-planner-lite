import { LocalOffer } from '@mui/icons-material';
import { __, getPriceWithSymbol } from '@src/utils';
import './DiscountSelector.scss';
import { useDiscountSelector } from './hooks';
import SelectField, { SelectFieldOption } from '../ui/SelectField/SelectField';
import FieldLabel from '../ui/FieldLabel/FieldLabel';
import Section from '../ui/Section/Section';

type Discount = {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    group?: string;
};

type DiscountSelectorProps = {
    seatId: string;
};

const DiscountSelector = ({ seatId }: DiscountSelectorProps) => {

    const {
        hasDiscount,
        selectedDiscount,
        availableDiscounts,
        handleSelect,
    } = useDiscountSelector({ seatId });

    const getDiscountLabel = (discount: Discount) => {
        if (discount.type === 'percentage') {
            return `${discount.value}%`;
        }
        return getPriceWithSymbol(discount.value);
    };

    if (!availableDiscounts.length && !hasDiscount) {
        return null;
    }

    const options: SelectFieldOption[] = availableDiscounts
        .filter((discount) => discount.value && discount.type && discount.name)
        .map((discount) => ({
            value: discount.name,
            label: discount.name,
            badge: `-${getDiscountLabel(discount)}`,
        }));

    const handleChange = (value: string | null) => {
        handleSelect(value || '');
    };

    return (
        <Section>
            <FieldLabel label={__('Select a discount')} required={false} />
            <SelectField
                className="stachesepl-discount-selector-field"
                value={selectedDiscount || null}
                onChange={handleChange}
                options={options}
                placeholder={__('REGULAR_SEAT')}
                allowClear
                clearLabel={__('REGULAR_SEAT')}
                clearDescription={__('NO_DISCOUNT_APPLIED')}
                triggerIcon={<LocalOffer className="stachesepl-select-field-icon" />}
            />
        </Section>
    )
};

export default DiscountSelector;