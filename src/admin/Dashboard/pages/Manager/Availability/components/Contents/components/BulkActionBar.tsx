import { __ } from '@src/utils';
import type { SeatStatus } from '../../../../types';
import './BulkActionBar.scss';

type BulkActionBarProps = {
    selectedCount: number;
    onStatusChange: (status: SeatStatus | 'default') => void;
    onCancel: () => void;
    loading?: boolean;
};

const statusOptions: { value: SeatStatus | 'default'; label: string }[] = [
    { value: 'available', label: 'STATUS_AVAILABLE' },
    { value: 'unavailable', label: 'STATUS_UNAVAILABLE' },
    { value: 'sold-out', label: 'STATUS_SOLD_OUT' },
    { value: 'on-site', label: 'STATUS_ON_SITE' },
    { value: 'default', label: 'RESET_TO_DEFAULT' },
];

const BulkActionBar = ({
    selectedCount,
    onStatusChange,
    onCancel,
    loading = false,
}: BulkActionBarProps) => {

    if (loading) {
        return null;
    }

    return (
        <div className="stachesepl-manager-bulk-action-bar">
            <div className="stachesepl-manager-bulk-action-bar-content">
                <span className="stachesepl-manager-bulk-action-bar-count">
                    {__('SEATS_SELECTED')?.replace('%d', selectedCount.toString())}
                </span>

                <div className="stachesepl-manager-bulk-action-bar-divider" />

                <div className="stachesepl-manager-bulk-action-bar-actions">
                    <span className="stachesepl-manager-bulk-action-bar-label">
                        {__('BULK_UPDATE_STATUS')}
                    </span>
                    <div className="stachesepl-manager-bulk-action-bar-buttons">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                className={`stachesepl-manager-bulk-action-bar-btn stachesepl-manager-bulk-action-bar-btn--${option.value}`}
                                onClick={() => onStatusChange(option.value)}
                                disabled={loading}
                            >
                                {__(option.label) || option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="stachesepl-manager-bulk-action-bar-divider" />

                <button
                    className="stachesepl-manager-bulk-action-bar-cancel"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {__('CANCEL')}
                </button>
            </div>

        </div>
    );
};

export default BulkActionBar;
