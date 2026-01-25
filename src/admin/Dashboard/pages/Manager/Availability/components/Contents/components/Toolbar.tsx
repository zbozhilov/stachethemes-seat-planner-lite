import { CheckBoxOutlined, Close, RemoveDone, DoneAll } from '@mui/icons-material';
import Input from '@src/admin/Dashboard/layout/Input';
import { __ } from '@src/utils';
import type { SeatAvailabilityStatus } from '../types';
import './Toolbar.scss';

type FilterStatus = 'all' | SeatAvailabilityStatus;

type ToolbarProps = {
    filterStatus: FilterStatus;
    searchTerm: string;
    filteredSeatsCount: number;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onClearFilter: () => void;
    isSelectionMode?: boolean;
    onToggleSelectionMode?: () => void;
    selectedCount?: number;
    onSelectAll?: () => void;
    onDeselectAll?: () => void;
};

const getStatusLabel = (status: SeatAvailabilityStatus): string => {
    switch (status) {
        case 'available': return __('STATUS_AVAILABLE');
        case 'sold-out': return __('STATUS_SOLD_OUT');
        case 'on-site': return __('STATUS_ON_SITE');
        case 'unavailable': return __('STATUS_UNAVAILABLE');
    }
};

const Toolbar = ({
    filterStatus,
    searchTerm,
    filteredSeatsCount,
    onSearchChange,
    onClearSearch,
    onClearFilter,
    isSelectionMode = false,
    onToggleSelectionMode,
    selectedCount = 0,
    onSelectAll,
    onDeselectAll,
}: ToolbarProps) => {
    const isFiltered = filterStatus !== 'all';
    const hasSelection = selectedCount > 0;

    return (
        <div className="stachesepl-manager-availability-toolbar">
            <Input
                type="search"
                placeholder={__('SEARCH_SEATS')}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                showClear
                onClear={onClearSearch}
            />

            <div className="stachesepl-manager-availability-filter-info">
                {isFiltered && (
                    <span className="stachesepl-manager-availability-filter-badge">
                        {getStatusLabel(filterStatus as SeatAvailabilityStatus)}
                        <button onClick={onClearFilter}>×</button>
                    </span>
                )}
                <span className="stachesepl-manager-availability-count">
                    {filteredSeatsCount === 1
                        ? __('SEAT_SINGULAR')?.replace('%d', filteredSeatsCount.toString())
                        : __('SEATS_PLURAL')?.replace('%d', filteredSeatsCount.toString())}
                </span>
            </div>

            <div className="stachesepl-manager-availability-toolbar-actions">
                {isSelectionMode && (
                    <>
                        <span className="stachesepl-manager-availability-selected-count">
                            {__('SEATS_SELECTED')?.replace('%d', selectedCount.toString()) || `${selectedCount} selected`}
                        </span>
                        <button
                            className="stachesepl-manager-availability-toolbar-btn stachesepl-manager-availability-toolbar-btn--secondary"
                            onClick={hasSelection ? onDeselectAll : onSelectAll}
                            title={hasSelection ? __('DESELECT_ALL') : __('SELECT_ALL')}
                            disabled={hasSelection ? !onDeselectAll : !onSelectAll}
                        >
                            {hasSelection ? <RemoveDone /> : <DoneAll />}
                            <span>{hasSelection ? __('DESELECT_ALL') : __('SELECT_ALL')}</span>
                        </button>
                    </>
                )}
                <button
                    className={`stachesepl-manager-availability-toolbar-btn ${isSelectionMode ? 'stachesepl-manager-availability-toolbar-btn--active' : ''}`}
                    onClick={onToggleSelectionMode}
                    title={isSelectionMode ? __('EXIT_SELECTION_MODE') : __('ENTER_SELECTION_MODE')}
                >
                    {isSelectionMode ? (
                        <>
                            <Close />
                            <span>{__('EXIT_SELECTION_MODE')}</span>
                        </>
                    ) : (
                        <>
                            <CheckBoxOutlined />
                            <span>{__('ENTER_SELECTION_MODE')}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Toolbar;

