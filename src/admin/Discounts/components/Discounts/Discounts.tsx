import { Close as Delete } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import './Discounts.scss';
import { useDiscountGroups } from './hooks';
import { discountData } from './types';

const Discounts = (props: {
    discountsData: discountData[],
}) => {

    const [discounts, setDiscounts] = useState<discountData[]>(props.discountsData);
    const discountGroups = useDiscountGroups();

    const handleAddDiscount = () => {

        const newDiscount: discountData = {
            group: '',
            name: '',
            type: 'percentage',
            value: 0
        }

        setDiscounts([...discounts, newDiscount]);

    }

    const handleRemoveDiscount = (index: number) => {
        const newDiscounts = discounts.filter((_, i) => i !== index);
        setDiscounts(newDiscounts);
    }

    useEffect(() => {
        const inputData = document.getElementById('stachesepl-seat-planner-discounts-data') as HTMLInputElement;

        inputData.value = JSON.stringify
            (discounts.map(discount => ({
                group: discountGroups.includes(discount.group ?? '') ? discount.group : '',
                name: discount.name,
                type: discount.type,
                value: discount.value
            })));

    }, [discountGroups, discounts]);

    return (
        <div className='stachesepl-seat-planner-discounts'>

            <h4 className='stachesepl-seat-planner-discounts-head'>{__('MANAGE_DISCOUNTS')}</h4>

            <ul>
                {discounts.map((discount, index) => (
                    <li key={index}>

                        <label>
                            <span>{__('DISCOUNT_NAME')}*</span>
                            <input
                                type="text"
                                value={discount.name}
                                onChange={(e) => {
                                    const newDiscounts = [...discounts];
                                    newDiscounts[index].name = e.target.value;
                                    setDiscounts(newDiscounts);
                                }}
                                placeholder={__('DISCOUNT_NAME')}
                            />
                        </label>

                        <label>
                            <span>{__('SEAT_GROUP')}</span>

                            <select
                                value={discount.group}
                                onChange={(e) => {
                                    const newDiscounts = [...discounts];
                                    newDiscounts[index].group = e.target.value;
                                    setDiscounts(newDiscounts);
                                }}>
                                <option value="">{__('ALL_SEATS')}</option>
                                {discountGroups.map(group => <option key={group} value={group}>{group}</option>)}
                            </select>

                        </label>

                        <label>
                            <span>{__('DISCOUNT_TYPE')}</span>
                            <select
                                value={discount.type}
                                onChange={(e) => {
                                    const newDiscounts = [...discounts];
                                    newDiscounts[index].type = e.target.value as discountData['type'];


                                    if (newDiscounts[index].type === 'percentage') {
                                        newDiscounts[index].value = Math.max(0, Math.min(100, newDiscounts[index].value));
                                    }

                                    setDiscounts(newDiscounts);
                                }}
                            >
                                <option value="percentage">{__('PERCENTAGE')}</option>
                                <option value="fixed">{__('FIXED')}</option>
                            </select>
                        </label>

                        <label>
                            <span>{__('DISCOUNT_VALUE')}</span>
                            <input
                                type="number"
                                step="1"
                                min="0"
                                value={discount.value}
                                onChange={(e) => {
                                    let numValue = parseFloat(e.target.value || '0');
                                    const newDiscounts = [...discounts];
                                    const discountType = newDiscounts[index].type;

                                    if (discountType === 'percentage') {
                                        numValue = Math.max(0, Math.min(100, numValue));
                                    }

                                    newDiscounts[index].value = numValue;
                                    setDiscounts(newDiscounts);
                                }}
                                placeholder={__('DISCOUNT_VALUE')}
                            />
                        </label>
                        <Delete onClick={() => handleRemoveDiscount(index)} />
                    </li>
                ))}
            </ul>

            {!!discounts.length && <p className='stachesepl-seat-planner-discounts-note'>
                * {__('UNIQUE_DISCOUNT_NAME')}
            </p>}

            <Button onClick={handleAddDiscount}>
                {__('ADD_DISCOUNT')}
            </Button>

        </div >
    )
}

export default Discounts