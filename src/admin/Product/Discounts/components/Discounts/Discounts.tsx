import { __ } from '@src/utils';
import { useEffect, useState } from 'react';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import EmptyState from '@src/admin/Product/CommonUI/EmptyState/EmptyState';
import ExpandCollapseAllButton from '@src/admin/Product/CommonUI/ExpandCollapseAllButton/ExpandCollapseAllButton';
import Note from '@src/admin/Product/CommonUI/Note/Note';
import DiscountCard from './DiscountCard/DiscountCard';
import './Discounts.scss';
import { useDiscountGroups } from './hooks';
import { discountData } from './types';

const Discounts = (props: {
    discountsData: discountData[],
}) => {

    const [discounts, setDiscounts] = useState<discountData[]>(props.discountsData);
    const [expandedIndices, setExpandedIndices] = useState<Set<number>>(() => new Set());
    const discountGroups = useDiscountGroups();

    const handleAddDiscount = () => {
        const newDiscount: discountData = {
            role: '',
            group: '',
            name: '',
            type: 'percentage',
            value: 0
        };
        const newIndex = discounts.length;
        setDiscounts([...discounts, newDiscount]);
        setExpandedIndices(prev => new Set([...prev, newIndex]));
    };

    const handleRemoveDiscount = (index: number) => {
        const newDiscounts = discounts.filter((_, i) => i !== index);
        setDiscounts(newDiscounts);
        setExpandedIndices(prev => new Set(
            [...prev].filter(i => i !== index).map(i => i > index ? i - 1 : i)
        ));
    };

    const handleToggleExpanded = (index: number) => {
        setExpandedIndices(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const allExpanded = discounts.length > 0 && discounts.every((_, i) => expandedIndices.has(i));

    const handleExpandCollapseAll = () => {
        if (allExpanded) {
            setExpandedIndices(new Set());
        } else {
            setExpandedIndices(new Set(discounts.map((_, i) => i)));
        }
    };

    const handleDiscountChange = (index: number, updates: Partial<discountData>) => {
        const newDiscounts = [...discounts];
        newDiscounts[index] = { ...newDiscounts[index], ...updates };
        setDiscounts(newDiscounts);
    };

    const getRoles = (): { key: string; value: string }[] => {
        return Object.entries(window.stachesepl_user_roles).map(([key, value]) => ({
            key,
            value
        }));
    };

    const roles = getRoles();

    useEffect(() => {
        const inputData = document.getElementById('stachesepl-seat-planner-discounts-data') as HTMLInputElement;
        if (inputData) {
            inputData.value = JSON.stringify(
                discounts.map(discount => ({
                    group: discountGroups.includes(discount.group ?? '') ? discount.group : '',
                    role: discount.role ?? '',
                    name: discount.name,
                    type: discount.type,
                    value: discount.value
                }))
            );
        }
    }, [discountGroups, discounts]);

    return (
        <Container label={__('MANAGE_DISCOUNTS')} description={__('DISCOUNTS_SUBTITLE')} className='stachesepl-seat-planner-discounts'>

            {discounts.length > 0 && (
                <div className="stachesepl-discounts-controls">
                    <ExpandCollapseAllButton
                        allExpanded={allExpanded}
                        onClick={handleExpandCollapseAll}
                    />
                </div>
            )}

            <div className="stachesepl-seat-planner-discounts-list">
                {discounts.map((discount, index) => (
                    <DiscountCard
                        key={index}
                        discount={discount}
                        isExpanded={expandedIndices.has(index)}
                        roles={roles}
                        discountGroups={discountGroups}
                        onToggleExpanded={() => handleToggleExpanded(index)}
                        onChange={(updates) => handleDiscountChange(index, updates)}
                        onRemove={() => handleRemoveDiscount(index)}
                    />
                ))}
            </div>

            {discounts.length === 0 && (
                <EmptyState>{__('NO_DISCOUNTS_ADDED')}</EmptyState>
            )}

            {!!discounts.length && (
                <Note>* {__('UNIQUE_DISCOUNT_NAME')}</Note>
            )}

            <Button onClick={handleAddDiscount}>
                {__('ADD_DISCOUNT')}
            </Button>

        </Container>
    );
};

export default Discounts