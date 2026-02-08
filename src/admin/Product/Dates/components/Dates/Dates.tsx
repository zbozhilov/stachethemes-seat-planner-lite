import { Add } from '@mui/icons-material';
import Button from '@src/admin/Product/CommonUI/Button/Button';
import Container from '@src/admin/Product/CommonUI/Container/Container';
import EmptyState from '@src/admin/Product/CommonUI/EmptyState/EmptyState';
import ExpandCollapseAllButton from '@src/admin/Product/CommonUI/ExpandCollapseAllButton/ExpandCollapseAllButton';
import { __ } from '@src/utils';
import { useState } from 'react';
import CutOffTime from './components/CutOffTime/CutOffTime';
import './Dates.scss';
import { dateData, DateGroup, flatToGrouped, groupedToFlat, timeData } from './types';
import toast from 'react-hot-toast';

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

        const value = parseInt(element.value, 10);

        if (isNaN(value)) {
            return 0;
        }

        return value;
    });

    const handleAddDate = () => {
        toast.error(__('DATES_NOT_SUPPORTED_IN_LITE'));
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
                    <EmptyState>{__('NO_DATES_ADDED')}</EmptyState>
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
