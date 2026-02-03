import type { ReactNode } from 'react';
import './NumberStepperField.scss';
import Badge from '../Badge/Badge';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';

export type NumberStepperFieldProps = {
    id?: string;
    value: number | null;
    onChange: (value: number | null) => void;
    label?: string;
    required?: boolean;
    description?: string;
    helperText?: ReactNode;
    error?: boolean;
    errorMessage?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    allowEmpty?: boolean;
    className?: string;
    priceBadge?: ReactNode;
};

const NumberStepperField = ({
    id,
    value,
    onChange,
    label,
    required,
    description,
    error,
    errorMessage,
    min,
    max,
    step = 1,
    disabled,
    className,
    priceBadge,
}: NumberStepperFieldProps) => {

    const safeStep = Number.isFinite(step) && step > 0 ? step : 1;

    const rootClassName = [
        'stachesepl-number-stepper-field',
        required ? 'stachesepl-number-stepper-field-required' : '',
        error ? 'stachesepl-number-stepper-field-error' : '',
        disabled ? 'stachesepl-number-stepper-field-disabled' : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    const displayErrorMessage = error && errorMessage ? errorMessage : '';

    /**
     * When the value is unset (null), pressing "+" should feel natural:
     * - If a positive min is defined, start at min
     * - Otherwise start at step (e.g. 1)
     */
    const getInitialIncreaseValue = () => {
        const base = min !== undefined && min > 0 ? min : safeStep;
        if (max !== undefined) return Math.min(base, max);
        return base;
    };

    const canIncrease = (() => {
        if (disabled) return false;
        if (value === null) {
            const initial = getInitialIncreaseValue();
            return max === undefined ? true : initial <= max;
        }
        if (max === undefined) return true;
        return value + safeStep <= max;
    })();

    const floor = min ?? 0;

    // For this UX, "0" is the empty state. We don't support decrementing below the floor,
    // and we don't "clear" to null via the - button (avoids the "0 twice" confusion).
    const canDecrease = (() => {
        if (disabled) return false;
        const current = value ?? floor;
        return current - safeStep >= floor;
    })();

    const handleIncrease = () => {
        if (!canIncrease) return;

        if (value === null) {
            onChange(getInitialIncreaseValue());
            return;
        }

        let next = value + safeStep;
        if (max !== undefined) next = Math.min(next, max);
        onChange(next);
    };

    const handleDecrease = () => {
        if (!canDecrease) return;
        const current = value ?? floor;
        let next = current - safeStep;
        next = Math.max(next, floor);
        onChange(next);
    };

    const displayCount = value ?? floor;

    const renderPriceBadge = () => {
        if (!priceBadge) return null;
        if (typeof priceBadge === 'string') {
            return <Badge html={priceBadge} tone="success" />;
        }
        return (
            <Badge tone="success">
                {priceBadge}
            </Badge>
        );
    };

    return (
        <div className={rootClassName} data-field-id={id || undefined}>
            <div className="stachesepl-number-stepper-field-main">
                {label && (
                    <div className="stachesepl-number-stepper-field-main-left">
                        <div className="stachesepl-option-label">
                            <div className="stachesepl-number-stepper-field-label-top">
                                <span className="stachesepl-option-label-row">
                                    <span className="stachesepl-option-label-text">
                                        {label}
                                    </span>
                                    {required && (
                                        <span className="stachesepl-option-label-required-indicator">*</span>
                                    )}
                                </span>
                                {renderPriceBadge()}
                            </div>
                            {description && (
                                <span className="stachesepl-option-description">
                                    {description}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="stachesepl-number-stepper-field-main-right">
                    <div className="stachesepl-number-stepper-field-row">
                        <div className="stachesepl-number-stepper-field-control" aria-disabled={disabled || undefined}>
                            <button
                                type="button"
                                className="stachesepl-number-stepper-field-btn stachesepl-number-stepper-field-btn-decrease"
                                onClick={handleDecrease}
                                disabled={!canDecrease}
                                aria-label="Decrease"
                            >
                                −
                            </button>

                            <div
                                className="stachesepl-number-stepper-field-count"
                                aria-live="polite"
                                aria-label={label || 'Count'}
                            >
                                {displayCount}
                            </div>

                            <button
                                type="button"
                                className="stachesepl-number-stepper-field-btn stachesepl-number-stepper-field-btn-increase"
                                onClick={handleIncrease}
                                disabled={!canIncrease}
                                aria-label="Increase"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {displayErrorMessage && (
                <FieldErrorMessage message={displayErrorMessage} />
            )}
        </div>
    );
};

export default NumberStepperField;


