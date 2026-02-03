import { Add, Close as Delete, ContentCopy, ExpandLess, ExpandMore } from '@mui/icons-material';
import { __ } from '@src/utils';
import { DateGroup, timeData } from '../../types';
import './DateCard.scss';

interface DateCardProps {
    dateGroup: DateGroup;
    isExpanded: boolean;
    isExpired?: boolean;
    onToggleExpanded: () => void;
    onDateChange: (newDate: string) => void;
    onTimeAdd: () => void;
    onTimeChange: (timeIndex: number, newTime: timeData) => void;
    onTimeRemove: (timeIndex: number) => void;
    onRemove: () => void;
    onDuplicate: () => void;
}

const DateCard = ({
    dateGroup,
    isExpanded,
    isExpired = false,
    onToggleExpanded,
    onDateChange,
    onTimeAdd,
    onTimeChange,
    onTimeRemove,
    onRemove,
    onDuplicate
}: DateCardProps) => {

    const formatDateDisplay = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={`stachesepl-date-card ${isExpired ? 'stachesepl-date-card-expired' : ''}`}>
            <div className={`stachesepl-date-card-header ${!isExpanded ? 'stachesepl-date-card-header-collapsed' : ''}`}>
                <div className="stachesepl-date-card-header-left">
                    <div className="stachesepl-date-card-date-input">
                        <input
                            type="date"
                            value={dateGroup.date}
                            onChange={(e) => onDateChange(e.target.value)}
                        />
                        <span className="stachesepl-date-card-date-display">
                            {formatDateDisplay(dateGroup.date)}
                        </span>
                    </div>
                </div>
                <div className="stachesepl-date-card-header-right">
                    <span className="stachesepl-date-card-count">
                        {dateGroup.times.length === 1 ?
                            __('D__TIME').replace('%d', dateGroup.times.length.toString()) :
                            __('D__TIMES').replace('%d', dateGroup.times.length.toString()
                            )}
                    </span>
                    <button
                        type="button"
                        className="stachesepl-date-card-duplicate"
                        onClick={onDuplicate}
                        title={__('DUPLICATE_DATE')}
                    >
                        <ContentCopy />
                    </button>
                    <button
                        type="button"
                        className="stachesepl-date-card-toggle"
                        onClick={onToggleExpanded}
                        title={isExpanded ? __('COLLAPSE') : __('EXPAND')}
                    >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </button>
                    <button
                        type="button"
                        className="stachesepl-date-card-remove"
                        onClick={onRemove}
                        title={__('REMOVE_DATE')}
                    >
                        <Delete />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="stachesepl-date-card-body">
                    <div className="stachesepl-date-card-times">
                        {dateGroup.times.length === 0 ? (
                            <div className="stachesepl-date-card-no-times">
                                {__('NO_TIMES_ADDED')}
                            </div>
                        ) : (
                            dateGroup.times.map((time, index) => (
                                <div key={index} className="stachesepl-date-card-time-row">
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => onTimeChange(index, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="stachesepl-date-card-time-remove"
                                        onClick={() => onTimeRemove(index)}
                                        title={__('REMOVE_TIME')}
                                    >
                                        <Delete />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        type="button"
                        className="stachesepl-date-card-add-time"
                        onClick={onTimeAdd}
                    >
                        <Add />
                        {__('ADD_TIME')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DateCard;

