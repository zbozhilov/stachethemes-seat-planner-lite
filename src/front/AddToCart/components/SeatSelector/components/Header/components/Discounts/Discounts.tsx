import { __, getFormattedPrice, getPriceWithSymbol } from '@src/utils';
import { useMemo } from 'react';
import { useDiscounts, useSeatPlanData, useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import './Discounts.scss';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const DiscountsContainer = () => {

    const { seatPlanData, setSeatPlanData } = useSeatPlanData();
    const { selectedSeats } = useSelectedSeats();
    const { discounts } = useDiscounts();

    const totalAfterDiscounts = useMemo(() => {

        if (!seatPlanData?.objects) {
            return '';
        }

        const seats = seatPlanData.objects.filter(object => object.type === 'seat');

        let total = selectedSeats.reduce((acc, seatId) => {

            const seat = seats.find(seat => seat.seatId === seatId);

            if (!seat) {
                return acc;
            }

            let seatPrice = seat.price || 0;

            if (seatPrice <= 0) {
                return acc;
            }

            const seatDiscountName = seat.discount || '';
            const seatDiscountType = discounts.find(discount => discount.name === seatDiscountName)?.type || 'percentage';
            const seatDiscountValue = discounts.find(discount => discount.name === seatDiscountName)?.value || 0;

            const { price } = seat;

            if (seatDiscountType === 'percentage') {
                return Math.max(0, acc + (price - (price * seatDiscountValue / 100)));
            }

            return Math.max(0, acc + (price - seatDiscountValue));

        }, 0);

        return getFormattedPrice(total);


    }, [selectedSeats, discounts, seatPlanData]);

    const handleSelectDiscountOption = (seatId: string, discountName: string) => {

        if (!seatPlanData?.objects) return;

        const newSeatPlanData = { ...seatPlanData };

        newSeatPlanData.objects = newSeatPlanData.objects.map(object => {

            if (object.type !== 'seat' || object.seatId !== seatId) {
                return object;
            };

            return {
                ...object,
                discount: discountName
            }
        });

        setSeatPlanData(newSeatPlanData);

    }

    if (!selectedSeats.length || !discounts.length || !seatPlanData?.objects) {
        return null;
    }
    
    return (
        <div className='stachesepl-discounts-container-outer'>
            <div className='stachesepl-discounts-container'>
                <h2 className='stachesepl-discounts-container-title'>{__('DISCOUNTS')}</h2>
                <p className='stachesepl-discounts-container-subtitle'>{__('SELECT_DISCOUNTS_FOR_SEATS')}</p>

                <div className='stachesepl-discounts-container-seats'>
                    {
                        selectedSeats.map((seat, index) => {

                            const theSeatData = seatPlanData.objects.find(object => object.type === 'seat' && object.seatId === seat);
                            const discountValue = theSeatData?.discount || '';

                            if (!theSeatData) {
                                return null;
                            }

                            return (
                                <div key={index} className='stachesepl-discounts-container-seat'>
                                    <div className='stachesepl-discounts-container-seat-label'>
                                        {__('SEAT')}: {seat}
                                    </div>

                                    <select
                                        value={discountValue}
                                        onChange={(e) => handleSelectDiscountOption(seat, e.target.value)}>
                                        <option value=''>{__('REGULAR_SEAT')}</option>

                                        {
                                            discounts.filter(discount => {

                                                // Discount applies for all seats
                                                if (!discount.group) {
                                                    return true;
                                                }

                                                return discount.group === theSeatData.group;

                                            }).map((discount, index) => {
                                                const { value, type, name } = discount;

                                                if (!value || !type || !name) {
                                                    return null;
                                                }

                                                let discountDisplayValue;

                                                switch (type) {
                                                    case 'percentage':
                                                        discountDisplayValue = `${value}%`;
                                                        break;
                                                    case 'fixed':
                                                        discountDisplayValue = getPriceWithSymbol(value);
                                                        break;
                                                    default:
                                                        return null; // Skip invalid discount types
                                                }

                                                return (
                                                    <option key={index} value={name}>
                                                        {name} ( -{discountDisplayValue} )
                                                    </option>
                                                );
                                            })
                                        }

                                    </select>

                                </div>
                            )

                        })
                    }
                </div>

                <div className='stachesepl-discounts-container-footer'>
                    <div className='stachesepl-discounts-container-total'>
                        <div className='stachesepl-discounts-container-total-label'>
                            {__('TOTAL')}
                        </div>
                        <div className='stachesepl-discounts-container-total-value' dangerouslySetInnerHTML={{ __html: totalAfterDiscounts }}>
                        </div>
                    </div>

                    <AddToCartButton />
                </div>


            </div>

        </div>
    )
}

export default DiscountsContainer