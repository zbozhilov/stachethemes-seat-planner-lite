import { AccessTime, ChevronLeft, ChevronRight, EventAvailable, FilterList } from '@mui/icons-material';
import { __, formatDateWithPhpFormat } from '@src/utils';
import EmptyState from './EmptyState';
import type { MonthGroup } from './types';
import './CalendarView.scss';

type CalendarViewProps = {
    hasFilteredMonths: boolean;
    currentMonth: MonthGroup | null;
    canGoPrevious: boolean;
    canGoNext: boolean;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onViewAvailability: (dateTime: string) => void;
};

const CalendarView = ({
    hasFilteredMonths,
    currentMonth,
    canGoPrevious,
    canGoNext,
    onPreviousMonth,
    onNextMonth,
    onViewAvailability,
}: CalendarViewProps) => {
    if (!hasFilteredMonths) {
        return (
            <EmptyState
                icon={<FilterList className="stachesepl-manager-dates-empty-icon" />}
                title={__('NO_DATES_MATCH_FILTER')}
                description={__('TRY_ADJUSTING_SEARCH_OR_FILTERS')}
            />
        );
    }

    if (!currentMonth) {
        return null;
    }

    return (
        <div className="stachesepl-manager-dates-calendar-view">
            {/* Month Navigation */}
            <div className="stachesepl-manager-dates-month-nav">
                <button
                    type="button"
                    className="stachesepl-manager-dates-month-nav-btn"
                    onClick={onPreviousMonth}
                    disabled={!canGoPrevious}
                    title={__('PREVIOUS_MONTH')}
                >
                    <ChevronLeft />
                </button>

                <div className="stachesepl-manager-dates-month-nav-current">
                    <h2 className="stachesepl-manager-dates-month-nav-title">
                        {formatDateWithPhpFormat(new Date(currentMonth.monthYearKey), 'F Y')}
                    </h2>
                    <span className="stachesepl-manager-dates-month-nav-count">
                        ({currentMonth.totalDates} {currentMonth.totalDates === 1 ? 'date' : 'dates'} • {currentMonth.totalTimeSlots}{' '}
                        {currentMonth.totalTimeSlots === 1 ? 'slot' : 'slots'})
                    </span>
                </div>

                <button
                    type="button"
                    className="stachesepl-manager-dates-month-nav-btn"
                    onClick={onNextMonth}
                    disabled={!canGoNext}
                    title={__('NEXT_MONTH')}
                >
                    <ChevronRight />
                </button>
            </div>

            {/* Dates Table */}
            <div className="stachesepl-manager-dates-table-container">
                <div className="stachesepl-manager-dates-table">
                    <div className="stachesepl-manager-dates-table-header">
                        <div className="stachesepl-manager-dates-table-cell stachesepl-manager-dates-table-cell--date">
                            <EventAvailable />
                            <span>{__('DATE')}</span>
                        </div>
                        <div className="stachesepl-manager-dates-table-cell stachesepl-manager-dates-table-cell--times">
                            <AccessTime />
                            <span>{__('AVAILABLE_TIME_SLOTS')}</span>
                        </div>
                    </div>

                    <div className="stachesepl-manager-dates-table-body">
                        {currentMonth.dateGroups.map((dateGroup) => (
                            <div key={dateGroup.date} className="stachesepl-manager-dates-table-row">
                                <div className="stachesepl-manager-dates-table-cell stachesepl-manager-dates-table-cell--date">
                                    <div className="stachesepl-manager-dates-table-date-badge">
                                        <span className="stachesepl-manager-dates-table-date-day">{dateGroup.day}</span>
                                        <span className="stachesepl-manager-dates-table-date-month">{dateGroup.month}</span>
                                    </div>
                                    <div className="stachesepl-manager-dates-table-date-info">
                                        <span className="stachesepl-manager-dates-table-date-name">{dateGroup.dayName}</span>
                                        <span className="stachesepl-manager-dates-table-date-full">{dateGroup.dateDisplay}</span>
                                    </div>
                                </div>
                                <div className="stachesepl-manager-dates-table-cell stachesepl-manager-dates-table-cell--times">
                                    <div className="stachesepl-manager-dates-table-times">
                                        {dateGroup.times.map(({ time, dateTime }) => (
                                            <button
                                                key={dateTime}
                                                type="button"
                                                className="stachesepl-manager-dates-table-time-btn"
                                                onClick={() => onViewAvailability(dateTime)}
                                                title={`${__('VIEW_AVAILABILITY_FOR__S').replace('%s', time)}`}
                                            >
                                                <AccessTime />
                                                <span>{time}</span>
                                                <ChevronRight className="stachesepl-manager-dates-table-time-arrow" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;

