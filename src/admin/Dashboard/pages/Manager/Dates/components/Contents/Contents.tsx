import { CalendarToday } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuditoriumProduct } from '../../../types';
import EmptyState from './components/EmptyState';
import CalendarView from './components/CalendarView';
import type { DateGroup, MonthGroup } from './components/types';
import { formatDateTime } from './components/utils';
import './Contents.scss';

const Contents = ({ productData }: { productData: AuditoriumProduct & { dates?: string[] } }) => {
    const navigate = useNavigate();
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

    const handleViewAvailability = (dateTime: string) => {
        navigate(`/manager/product/${productData.id}/date/${dateTime}/availability`);
    };

    // Group dates by month/year and then by individual date
    const monthGroups = useMemo(() => {
        if (!Array.isArray(productData.dates) || productData.dates.length === 0) {
            return {};
        }

        const sortedDates = [...productData.dates].sort((a, b) => a.localeCompare(b));

        // First group by date
        const dateGroupsMap = sortedDates.reduce((groups, dateTime) => {
            const { date, time, dayName, month, day, monthYearKey } = formatDateTime(dateTime);
            const dateKey = dateTime.split('T')[0];

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    date: dateKey,
                    dateDisplay: date,
                    dayName,
                    month,
                    day,
                    times: [],
                };
            }

            groups[dateKey].times.push({ time, dateTime });
            return groups;
        }, {} as Record<string, DateGroup>);

        const dateGroups = Object.values(dateGroupsMap).sort((a, b) =>
            a.date.localeCompare(b.date)
        );

        // Then group by month/year
        const monthsMap = dateGroups.reduce((groups, dateGroup) => {
            const { monthYearKey, month: monthName, year, monthNum } = formatDateTime(
                dateGroup.times[0]?.dateTime || dateGroup.date + 'T00:00:00'
            );

            if (!groups[monthYearKey]) {
                groups[monthYearKey] = {
                    monthYearKey,
                    monthName,
                    year,
                    monthNum,
                    dateGroups: [],
                    totalDates: 0,
                    totalTimeSlots: 0,
                };
            }

            groups[monthYearKey].dateGroups.push(dateGroup);
            groups[monthYearKey].totalDates += 1;
            groups[monthYearKey].totalTimeSlots += dateGroup.times.length;

            return groups;
        }, {} as Record<string, MonthGroup>);

        return monthsMap;
    }, [productData.dates]);

    // Get filtered and sorted month keys
    const paginatedMonthKeys = useMemo(() => {
        const keys = Object.keys(monthGroups).sort((a, b) => {
            const groupA = monthGroups[a];
            const groupB = monthGroups[b];
            if (groupA.year !== groupB.year) return groupA.year - groupB.year;
            return groupA.monthNum - groupB.monthNum;
        });
        return keys;
    }, [monthGroups]);

    // Get current month data for calendar view
    const currentMonth = useMemo(() => {
        if (paginatedMonthKeys.length === 0) return null;
        const monthKey = paginatedMonthKeys[currentMonthIndex] || paginatedMonthKeys[0];
        return monthGroups[monthKey];
    }, [paginatedMonthKeys, currentMonthIndex, monthGroups]);

    // Month navigation handlers
    const goToPreviousMonth = () => {
        setCurrentMonthIndex(prev => Math.max(0, prev - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonthIndex(prev => Math.min(paginatedMonthKeys.length - 1, prev + 1));
    };

    const canGoPrevious = currentMonthIndex > 0;
    const canGoNext = currentMonthIndex < paginatedMonthKeys.length - 1;

    if (!Array.isArray(productData.dates) || productData.dates.length === 0) {
        return (
            <div className="stachesepl-manager-dates">
                <EmptyState
                    icon={<CalendarToday className="stachesepl-manager-dates-empty-icon" />}
                    title={__('NO_DATES_FOUND')}
                    description={__('NO_DATES_CONFIGURED_FOR_PRODUCT')}
                />
            </div>
        );
    }

    return (
        <div className="stachesepl-manager-dates">
            <CalendarView
                hasFilteredMonths={paginatedMonthKeys.length > 0}
                currentMonth={currentMonth}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                onPreviousMonth={goToPreviousMonth}
                onNextMonth={goToNextMonth}
                onViewAvailability={handleViewAvailability}
            />
        </div>
    );
};

export default Contents;
