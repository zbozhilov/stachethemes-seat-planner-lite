import { CheckCircle, Warning } from '@mui/icons-material';
import { __ } from '@src/utils';
import Button from '@src/admin/Dashboard/layout/Button';
import Select from '@src/admin/Dashboard/layout/Select';
import type { SeatStatus } from '../../../types';
import './StatusOverrideForm.scss';

type StatusOption = {
    value: 'default' | SeatStatus;
    label: string;
};

const STATUS_OPTIONS: StatusOption[] = [
    { value: 'default', label: 'Default' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'sold-out', label: 'Sold Out' },
    { value: 'on-site', label: 'On-Site Only' },
];

type StatusOverrideFormProps = {
    selectedStatus: SeatStatus;
    hasChanges: boolean;
    isSaving: boolean;
    saveError: string | null;
    successMessage: string | null;
    onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSave: () => void;
    onCancel: () => void;
};

const StatusOverrideForm = ({
    selectedStatus,
    hasChanges,
    isSaving,
    saveError,
    successMessage,
    onStatusChange,
    onSave,
    onCancel,
}: StatusOverrideFormProps) => {
    return (
        <div className="stachesepl-manager-edit-seat-form">
            <h4 className="stachesepl-manager-edit-seat-form-title">
                {__('SEAT_STATUS_OVERRIDE')}
            </h4>
            <p className="stachesepl-manager-edit-seat-form-description">
                {__('SEAT_STATUS_OVERRIDE_DESC')}
            </p>

            <div className="stachesepl-manager-edit-seat-form-field">
                <Select
                    label={__('STATUS')}
                    value={selectedStatus}
                    onChange={onStatusChange}
                    options={STATUS_OPTIONS.map((opt) => ({
                        value: opt.value,
                        label: opt.label,
                    }))}
                    disabled={isSaving}
                />
            </div>

            {saveError && (
                <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--error">
                    <Warning className="stachesepl-manager-edit-seat-message-icon" />
                    {saveError}
                </div>
            )}

            {successMessage && (
                <div className="stachesepl-manager-edit-seat-message stachesepl-manager-edit-seat-message--success">
                    <CheckCircle className="stachesepl-manager-edit-seat-message-icon" />
                    {successMessage}
                </div>
            )}

            <div className="stachesepl-manager-edit-seat-actions">
                <Button onClick={onSave} disabled={isSaving || !hasChanges}>
                    {isSaving ? <>{__('SAVING')}</> : <>{__('SAVE_CHANGES')}</>}
                </Button>
                <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
                    {__('CANCEL')}
                </Button>
            </div>
        </div>
    );
};

export default StatusOverrideForm;
