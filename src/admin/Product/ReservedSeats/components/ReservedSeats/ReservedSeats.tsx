import { Close as Delete } from '@mui/icons-material';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import EmptyState from '@src/admin/Product/CommonUI/EmptyState/EmptyState';
import { __, getFormattedDateTime } from '@src/utils';
import { useEffect, useState } from 'react';
import './ReservedSeats.scss';

const ReservedSeats = (props: {
    reservedSeatsData: Record<string, string[]>,
}) => {

    const [reservedSeats, setReservedSeats] = useState<Record<string, string[]>>(props.reservedSeatsData);

    useEffect(() => {
        // Calculate seats that were removed by comparing original and current data
        const originalSeats: Array<{ timeSlot: string; seatId: string }> = [];
        const currentSeats: Array<{ timeSlot: string; seatId: string }> = [];

        Object.entries(props.reservedSeatsData).forEach(([timeSlot, seats]) => {
            seats.forEach(seatId => {
                originalSeats.push({ timeSlot, seatId });
            });
        });

        Object.entries(reservedSeats).forEach(([timeSlot, seats]) => {
            seats.forEach(seatId => {
                currentSeats.push({ timeSlot, seatId });
            });
        });

        const seatsToRemove = originalSeats.filter(original => {
            return !currentSeats.some(current =>
                current.timeSlot === original.timeSlot && current.seatId === original.seatId
            );
        });

        const inputElement = document.getElementById('stachesepl-seat-planner-reserved-seats-data-remove') as HTMLInputElement;
        if (inputElement) {
            // Format: timeSlot::seatId||timeSlot::seatId
            inputElement.value = seatsToRemove.map(s => `${s.timeSlot}::${s.seatId}`).join('||');
        }
    }, [props.reservedSeatsData, reservedSeats]);

    const handleRemoveSeat = (timeSlot: string, seatId: string) => {
        setReservedSeats(prev => {
            const newData = { ...prev };
            if (newData[timeSlot]) {
                newData[timeSlot] = newData[timeSlot].filter(id => id !== seatId);
                // Remove time slot if no seats remain
                if (newData[timeSlot].length === 0) {
                    delete newData[timeSlot];
                }
            }
            return newData;
        });
    };

    const handleClearAll = () => {
        setReservedSeats({});
    };

    const totalSeatsCount = Object.values(reservedSeats).reduce((sum, seats) => sum + seats.length, 0);
    const groupsCount = Object.keys(reservedSeats).length;

    return (
        <Container label={__('RESERVED_SEATS_IN_CARTS')} description={__('RESERVED_SEATS_IN_CARTS_DESC')} className='stachesepl-seat-planner-reserved-seats'>

            {totalSeatsCount === 0 && <EmptyState>{__('RESERVED_SEATS_IN_CARTS_EMPTY')}</EmptyState>}
            
            <div className={`stachesepl-seat-planner-reserved-seats-groups ${groupsCount <= 1 ? 'stachesepl-seat-planner-reserved-seats-groups-single' : ''}`}>
                {Object.entries(reservedSeats).map(([timeSlot, seats]) => (
                    <div key={timeSlot} className='stachesepl-seat-planner-reserved-seats-group'>
                        {timeSlot !== '' && <div className='stachesepl-seat-planner-reserved-seats-time-slot-label'>{getFormattedDateTime(timeSlot)}</div>}
                        <ul>
                            {seats.map((seatId) => (
                                <li key={`${timeSlot}-${seatId}`}>

                                    <label>
                                        <span>{__('SEAT_ID')}</span>
                                        <input
                                            type="text"
                                            value={seatId}
                                            readOnly={true}
                                            placeholder={__('SEAT_ID')}
                                        />
                                    </label>

                                    <Delete onClick={() => {
                                        handleRemoveSeat(timeSlot, seatId);
                                    }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {
                totalSeatsCount > 0 && <Button onClick={handleClearAll}>{__('CLEAR_RESERVATIONS')}</Button>
            }

        </Container>
    )
}

export default ReservedSeats