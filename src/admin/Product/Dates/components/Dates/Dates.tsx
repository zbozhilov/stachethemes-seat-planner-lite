import { Add } from '@mui/icons-material';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import EmptyState from '@src/admin/Product/CommonUI/EmptyState/EmptyState';
import ExpandCollapseAllButton from '@src/admin/Product/CommonUI/ExpandCollapseAllButton/ExpandCollapseAllButton';
import { __ } from '@src/utils';
import { useEffect, useState } from 'react';
import CutOffTime from './components/CutOffTime/CutOffTime';
import DateCard from './components/DateCard/DateCard';
import './Dates.scss';
import { dateData, DateGroup, flatToGrouped, groupedToFlat, timeData } from './types';

const STORAGE_KEY = 'stachesepl-dates-expand-all';

// Helper functions for localStorage
const loadExpandAllPreference = (): boolean => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            return JSON.parse(stored) === true;
        }
    } catch (e) {
        // Ignore errors, use default
    }
    return true; // Default to expanded
};

const saveExpandAllPreference = (expandAll: boolean) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expandAll));
    } catch (e) {
        // Ignore errors
    }
};

const Dates = (props: {
    datesData: dateData[],
}) => {

    const [dateGroups, setDateGroups] = useState<DateGroup[]>(() => 
        flatToGrouped(props.datesData)
    );
    
    // Track expanded state for each date card (by index)
    const [expandedStates, setExpandedStates] = useState<Map<number, boolean>>(() => {
        const initialGroups = flatToGrouped(props.datesData);
        const initialStates = new Map<number, boolean>();
        
        // Load preference from localStorage (default to expanded)
        const expandAll = loadExpandAllPreference();
        
        // Initialize all cards to the same state
        initialGroups.forEach((_, index) => {
            initialStates.set(index, expandAll);
        });
        
        return initialStates;
    });
    
    const [stopSellingTicketsBefore, setStopSellingTicketsBefore] = useState<number>(() => {
        const element = document.querySelector('input[name="stachesepl_stop_selling_tickets_before"]') as HTMLInputElement;
        return parseInt(element.value, 10);
    });

    const handleAddDate = () => {
        // Get today's date or the last added date + 1 day
        let newDate: string;
        
        if (dateGroups.length > 0) {
            // Get the last date and add 1 day
            const lastDate = new Date(dateGroups[dateGroups.length - 1].date);
            lastDate.setDate(lastDate.getDate() + 1);
            newDate = lastDate.toISOString().split('T')[0];
        } else {
            // Use today's date
            const today = new Date();
            newDate = today.toISOString().split('T')[0];
        }
        
        // Add with a default time
        const newGroup: DateGroup = {
            date: newDate,
            times: ['10:00']
        };
        
        const newIndex = dateGroups.length;
        setDateGroups([...dateGroups, newGroup]);
        // New cards are always expanded initially
        setExpandedStates(new Map(expandedStates).set(newIndex, true));
    };

    const handleRemoveDate = (index: number) => {
        setDateGroups(dateGroups.filter((_, i) => i !== index));
        // Remove expanded state for the deleted card and reindex
        const newExpandedStates = new Map<number, boolean>();
        expandedStates.forEach((expanded, i) => {
            if (i < index) {
                newExpandedStates.set(i, expanded);
            } else if (i > index) {
                newExpandedStates.set(i - 1, expanded);
            }
        });
        setExpandedStates(newExpandedStates);
    };

    const handleDuplicateDate = (index: number) => {
        const dateToDuplicate = dateGroups[index];
        const originalDate = new Date(dateToDuplicate.date);
        
        // Create new date as next day after the duplicated date
        const newDate = new Date(originalDate);
        newDate.setDate(newDate.getDate() + 1);
        const newDateStr = newDate.toISOString().split('T')[0];
        
        // Create duplicate with all times copied
        const duplicate: DateGroup = {
            date: newDateStr,
            times: [...dateToDuplicate.times] // Copy all times
        };
        
        // Insert right after the original date
        const updated = [...dateGroups];
        updated.splice(index + 1, 0, duplicate);
        setDateGroups(updated);
        
        // Update expanded states to account for the new card
        const newExpandedStates = new Map<number, boolean>();
        expandedStates.forEach((expanded, i) => {
            if (i <= index) {
                newExpandedStates.set(i, expanded);
            } else {
                newExpandedStates.set(i + 1, expanded);
            }
        });
        // Duplicated cards are always expanded initially
        newExpandedStates.set(index + 1, true);
        setExpandedStates(newExpandedStates);
    };

    const handleDateChange = (index: number, newDate: string) => {
        const updated = [...dateGroups];
        updated[index] = { ...updated[index], date: newDate };
        setDateGroups(updated);
    };

    const handleTimeAdd = (dateIndex: number) => {
        const updated = [...dateGroups];
        const times = updated[dateIndex].times;
        
        // Default to the last time or 10:00
        let newTime: timeData = '10:00';
        if (times.length > 0) {
            // Get last time and add 1 hour
            const lastTime = times[times.length - 1];
            const [hours, minutes] = lastTime.split(':').map(Number);
            const newHours = (hours + 1) % 24;
            newTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        
        updated[dateIndex] = {
            ...updated[dateIndex],
            times: [...times, newTime]
        };
        setDateGroups(updated);
    };

    const handleTimeChange = (dateIndex: number, timeIndex: number, newTime: timeData) => {
        const updated = [...dateGroups];
        const times = [...updated[dateIndex].times];
        times[timeIndex] = newTime;
        updated[dateIndex] = { ...updated[dateIndex], times };
        setDateGroups(updated);
    };

    const handleTimeRemove = (dateIndex: number, timeIndex: number) => {
        const updated = [...dateGroups];
        const times = updated[dateIndex].times.filter((_, i) => i !== timeIndex);
        updated[dateIndex] = { ...updated[dateIndex], times };
        setDateGroups(updated);
    };

    const handleToggleExpanded = (index: number) => {
        const newExpandedStates = new Map(expandedStates);
        newExpandedStates.set(index, !(expandedStates.get(index) ?? true));
        setExpandedStates(newExpandedStates);
    };

    const handleExpandCollapseAll = () => {
        // Check if all cards are currently expanded
        const allExpanded = dateGroups.every((_, index) => expandedStates.get(index) ?? true);
        const newState = !allExpanded;
        const newExpandedStates = new Map<number, boolean>();
        dateGroups.forEach((_, index) => {
            newExpandedStates.set(index, newState);
        });
        setExpandedStates(newExpandedStates);
        // Save preference to localStorage
        saveExpandAllPreference(newState);
    };

    // Helper function to check if a date is expired
    const isDateExpired = (dateStr: string): boolean => {
        if (!window.stachesepl_server_datetime?.now) {
            return false; // If no server datetime, don't apply styling
        }
        // Extract date part (YYYY-MM-DD) from server datetime string
        // Handles both ISO format (2025-01-15T10:30:00) and date-only format
        const serverDateTimeStr = window.stachesepl_server_datetime.now;
        const serverDateStr = serverDateTimeStr.split('T')[0]; // Get YYYY-MM-DD format
        // Date is expired if it's before today
        return dateStr < serverDateStr;
    };

    // Sync grouped data back to the hidden input as flat array
    useEffect(() => {
        const inputData = document.getElementById('stachesepl-seat-planner-dates-data') as HTMLInputElement;
        inputData.value = JSON.stringify(groupedToFlat(dateGroups));
    }, [dateGroups]);

    useEffect(() => {
        const input = document.querySelector('input[name="stachesepl_stop_selling_tickets_before"]') as HTMLInputElement;
        if (input) {
            input.value = stopSellingTicketsBefore.toString();
        }
    }, [stopSellingTicketsBefore]);

    return (
        <>
            <Container
                className='stachesepl-seat-planner-dates-stop'
                label={__('STOP_SELLING_TICKETS_BEFORE')}
                description={__('STOP_SELLING_TICKETS_BEFORE_DESC')}>

                <CutOffTime
                    value={stopSellingTicketsBefore}
                    onChange={setStopSellingTicketsBefore}
                />

            </Container>

            <Container
                className='stachesepl-seat-planner-dates'
                label={__('MANAGE_DATES_AND_TIMES')}
                description={__('MANAGE_DATES_AND_TIMES_DESC')}>

                {dateGroups.length > 0 && (
                    <div className="stachesepl-date-groups-controls">
                        <ExpandCollapseAllButton
                            allExpanded={dateGroups.every((_, index) => expandedStates.get(index) ?? true)}
                            onClick={handleExpandCollapseAll}
                        />
                    </div>
                )}

                <div className="stachesepl-date-groups">
                    {dateGroups.length === 0 ? (
                        <EmptyState>{__('NO_DATES_ADDED')}</EmptyState>
                    ) : (
                        dateGroups.map((group, index) => (
                            <DateCard
                                key={`${group.date}-${index}`}
                                dateGroup={group}
                                isExpanded={expandedStates.get(index) ?? true}
                                isExpired={isDateExpired(group.date)}
                                onToggleExpanded={() => handleToggleExpanded(index)}
                                onDateChange={(newDate) => handleDateChange(index, newDate)}
                                onTimeAdd={() => handleTimeAdd(index)}
                                onTimeChange={(timeIndex, newTime) => handleTimeChange(index, timeIndex, newTime)}
                                onTimeRemove={(timeIndex) => handleTimeRemove(index, timeIndex)}
                                onRemove={() => handleRemoveDate(index)}
                                onDuplicate={() => handleDuplicateDate(index)}
                            />
                        ))
                    )}
                </div>

                <Button onClick={handleAddDate} className="stachesepl-add-date-button">
                    <Add />
                    {__('ADD_DATE')}
                </Button>

            </Container>
        </>
    );
};

export default Dates;
