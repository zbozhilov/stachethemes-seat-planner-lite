import Note from '@src/admin/Product/CommonUI/Note/Note';
import { __ } from '@src/utils';
import './CutOffTime.scss';

interface CutOffTimeProps {
    value: number; // Total value in minutes
    onChange: (value: number) => void;
}

const CutOffTime = ({ value, onChange }: CutOffTimeProps) => {
    // Convert total minutes to days, hours, minutes
    const totalMinutes = Math.max(0, value);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const handleDaysChange = (newDays: number) => {
        const clampedDays = Math.max(0, Math.min(365, newDays));
        const newTotal = (clampedDays * 24 * 60) + (hours * 60) + minutes;
        onChange(newTotal);
    };

    const handleHoursChange = (newHours: number) => {
        const newTotal = (days * 24 * 60) + (Math.max(0, Math.min(23, newHours)) * 60) + minutes;
        onChange(newTotal);
    };

    const handleMinutesChange = (newMinutes: number) => {
        const newTotal = (days * 24 * 60) + (hours * 60) + Math.max(0, Math.min(59, newMinutes));
        onChange(newTotal);
    };

    // Format the summary text with correct singular/plural units
    const getSummaryText = () => {
        const dayUnit = days === 1 ? __('DAY') : __('DAYS');
        const hourUnit = hours === 1 ? __('HOUR') : __('HOURS');
        const minuteUnit = minutes === 1 ? __('MINUTE') : __('MINUTES');
        return __('CUTOFF_TIME_SUMMARY')
            .replace('%1$s', days.toString())
            .replace('%2$s', dayUnit)
            .replace('%3$s', hours.toString())
            .replace('%4$s', hourUnit)
            .replace('%5$s', minutes.toString())
            .replace('%6$s', minuteUnit);
    };

    const getShowSummary = (): boolean => {
        return totalMinutes > 0;
    }

    return (
        <div className="stachesepl-cutoff-time">
            <div className="stachesepl-cutoff-time-inputs">
                <div className="stachesepl-cutoff-time-field">
                    <input
                        title={__('DAYS')}
                        type="number"
                        min="0"
                        max="365"
                        value={days}
                        onChange={(e) => handleDaysChange(parseInt(e.target.value, 10) || 0)}
                    />
                    <span className="stachesepl-cutoff-time-unit">{__('DAYS_SHORT')}</span>
                </div>

                <div className="stachesepl-cutoff-time-field">
                    <input
                        title={__('HOURS')}
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => handleHoursChange(parseInt(e.target.value, 10) || 0)}
                    />
                    <span className="stachesepl-cutoff-time-unit">{__('HOURS_SHORT')}</span>
                </div>

                <div className="stachesepl-cutoff-time-field">
                    <input
                        title={__('MINUTES')}
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => handleMinutesChange(parseInt(e.target.value, 10) || 0)}
                    />
                    <span className="stachesepl-cutoff-time-unit">{__('MINUTES_SHORT')}</span>
                </div>
            </div>

            {getShowSummary() && (
                <Note>{getSummaryText()}</Note>
            )}
        </div>
    );
};

export default CutOffTime;
