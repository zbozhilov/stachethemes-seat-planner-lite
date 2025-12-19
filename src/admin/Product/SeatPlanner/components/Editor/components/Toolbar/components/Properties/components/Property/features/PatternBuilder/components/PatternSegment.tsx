import { __ } from '@src/utils';
import { PatternSegment as PatternSegmentType } from '../types';
import ModeSelect from './ModeSelect';

interface PatternSegmentProps {
    segment: PatternSegmentType;
    index: number;
    canRemove: boolean;
    onUpdate: (updates: Partial<PatternSegmentType>) => void;
    onRemove: () => void;
}

const PatternSegment = (props: PatternSegmentProps) => {
    const { segment, index, canRemove, onUpdate, onRemove } = props;

    const handleStartValueChange = (value: string) => {
        if (segment.valueType === 'letter') {
            value = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
        } else {
            value = value.replace(/[^0-9]/g, '');
        }
        onUpdate({ startValue: value });
    };

    const handleStartValueBlur = (value: string) => {
        if (segment.valueType === 'number' && !value) {
            onUpdate({ startValue: '1' });
        } else if (segment.valueType === 'letter' && !value) {
            onUpdate({ startValue: 'A' });
        }
    };

    const handleCountChange = (value: string) => {
        if (value === '' || /^\d+$/.test(value)) {
            const num = parseInt(value) || 0;
            onUpdate({ count: Math.min(100, num) });
        }
    };

    const handleCountBlur = (value: string) => {
        const num = parseInt(value) || 1;
        onUpdate({ count: Math.max(1, Math.min(100, num)) });
    };

    const handleTypeChange = (valueType: 'number' | 'letter') => {
        onUpdate({
            valueType,
            startValue: valueType === 'number' ? '1' : 'A'
        });
    };

    const handleModeChange = (type: PatternSegmentType['type']) => {
        onUpdate({
            type,
            count: type === 'linear' ? 1 : (segment.count || 3)
        });
    };

    return (
        <div className="stachesepl-pattern-builder-segment">
            <div className="stachesepl-pattern-builder-segment-header">
                <span className="segment-number">{__('SEGMENT')} {index + 1}</span>
                {canRemove && (
                    <button
                        className="segment-remove"
                        onClick={onRemove}
                        aria-label={__('REMOVE')}
                    >
                        {__('REMOVE')}
                    </button>
                )}
            </div>

            <div className="stachesepl-pattern-builder-segment-fields">
                {/* Separator (for segments after the first) */}
                {index > 0 && (
                    <div className="stachesepl-pattern-builder-field stachesepl-pattern-builder-field-separator">
                        <label>{__('SEPARATOR')}</label>
                        <input
                            type="text"
                            value={segment.separator}
                            onChange={(e) => onUpdate({ separator: e.target.value })}
                            placeholder="-"
                            maxLength={5}
                        />
                    </div>
                )}

                {/* Value Type */}
                <div className="stachesepl-pattern-builder-field stachesepl-pattern-builder-field-type">
                    <label>{__('TYPE')}</label>
                    <div className="stachesepl-pattern-builder-toggle">
                        <button
                            className={segment.valueType === 'number' ? 'active' : ''}
                            onClick={() => handleTypeChange('number')}
                        >
                            123
                        </button>
                        <button
                            className={segment.valueType === 'letter' ? 'active' : ''}
                            onClick={() => handleTypeChange('letter')}
                        >
                            ABC
                        </button>
                    </div>
                </div>

                {/* Start Value */}
                <div className="stachesepl-pattern-builder-field stachesepl-pattern-builder-field-start">
                    <label>{__('START')}</label>
                    <input
                        type="text"
                        inputMode={segment.valueType === 'number' ? 'numeric' : 'text'}
                        value={segment.startValue}
                        onChange={(e) => handleStartValueChange(e.target.value)}
                        onBlur={(e) => handleStartValueBlur(e.target.value)}
                        maxLength={segment.valueType === 'letter' ? 1 : 4}
                    />
                </div>

                {/* Pattern Mode */}
                <div className="stachesepl-pattern-builder-field stachesepl-pattern-builder-field-mode">
                    <label>{__('MODE')}</label>
                    <ModeSelect
                        value={segment.type}
                        segmentId={segment.id}
                        onChange={handleModeChange}
                    />
                </div>

                {/* Count (only for repeat/cyclic) */}
                {segment.type !== 'linear' && (
                    <div className="stachesepl-pattern-builder-field stachesepl-pattern-builder-field-count">
                        <label>{segment.type === 'cyclic' ? __('RANGE') : __('TIMES')}</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={segment.count}
                            onChange={(e) => handleCountChange(e.target.value)}
                            onBlur={(e) => handleCountBlur(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatternSegment;

