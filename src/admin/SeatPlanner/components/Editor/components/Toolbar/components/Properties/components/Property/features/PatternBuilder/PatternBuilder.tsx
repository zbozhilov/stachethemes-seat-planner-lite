import { useState, useMemo, useCallback } from 'react';
import { __ } from '@src/utils';
import { Add } from '@mui/icons-material';
import { getIncrementValueByRegex } from '../utils';
import Dialog from '@src/admin/SeatPlanner/components/Editor/components/Dialog/Dialog';
import { PatternSegment } from './types';
import { generateUniqueId } from './utils';
import QuickPatterns from './components/QuickPatterns';
import PrefixSuffixFields from './components/PrefixSuffixFields';
import PatternSegmentComponent from './components/PatternSegment';
import PatternPreview from './components/PatternPreview';
import './PatternBuilder.scss';

interface PatternBuilderProps {
    onApply: (pattern: string) => void;
    onClose: () => void;
    numItems: number;
}

const PatternBuilder = (props: PatternBuilderProps) => {
    const { onApply, onClose, numItems } = props;

    const [segments, setSegments] = useState<PatternSegment[]>([
        {
            id: generateUniqueId(),
            type: 'linear',
            valueType: 'number',
            startValue: '1',
            count: 1,
            separator: ''
        }
    ]);

    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');

    // Build pattern string from segments
    const buildPattern = useCallback(() => {
        const segmentStrings = segments.map((segment, index) => {
            const { type, valueType, startValue, count, separator } = segment;

            let start = startValue;
            if (valueType === 'number') {
                start = startValue || '1';
            } else {
                start = startValue?.toUpperCase() || 'A';
            }

            let patternPart = '';

            switch (type) {
                case 'linear':
                    patternPart = `[${start}]`;
                    break;
                case 'linear-repeat':
                    patternPart = `[${start}*${count}]`;
                    break;
                case 'cyclic':
                    patternPart = `[${start}~${count}]`;
                    break;
            }

            // Add separator before this segment (except for the first one)
            if (index > 0 && separator) {
                return separator + patternPart;
            }

            return patternPart;
        });

        return prefix + segmentStrings.join('') + suffix + '!';
    }, [segments, prefix, suffix]);

    const pattern = buildPattern();

    // Generate preview values
    const previewValues = useMemo(() => {
        const count = Math.min(numItems, 10);
        const values: string[] = [];
        for (let i = 0; i < count; i++) {
            values.push(getIncrementValueByRegex(pattern, i));
        }
        return values;
    }, [pattern, numItems]);

    const handleAddSegment = () => {
        setSegments(prev => [
            ...prev,
            {
                id: generateUniqueId(),
                type: 'linear',
                valueType: 'number',
                startValue: '1',
                count: 3,
                separator: '-'
            }
        ]);
    };

    const handleRemoveSegment = (id: string) => {
        if (segments.length > 1) {
            setSegments(prev => prev.filter(s => s.id !== id));
        }
    };

    const updateSegment = (id: string, updates: Partial<PatternSegment>) => {
        setSegments(prev =>
            prev.map(s => (s.id === id ? { ...s, ...updates } : s))
        );
    };

    const handleApply = () => {
        onApply(pattern);
        onClose();
    };

    const handleQuickPattern = (quickPattern: string) => {
        onApply(quickPattern);
        onClose();
    };

    const dialogActions = [
        {
            text: __('CANCEL'),
            onClick: onClose
        },
        {
            text: __('APPLY_PATTERN'),
            onClick: handleApply
        }
    ];

    return (
        <Dialog
            open={true}
            onClose={onClose}
            title={__('PATTERN_BUILDER')}
            maxWidth={600}
            overrideActions={dialogActions}
        >
            <div className="stachesepl-pattern-builder">
                <QuickPatterns onSelect={handleQuickPattern} />

                {/* Custom Pattern Builder */}
                <div className="stachesepl-pattern-builder-section">
                    <div className="stachesepl-pattern-builder-section-title">
                        {__('CUSTOM_PATTERN')}
                    </div>

                    <PrefixSuffixFields
                        prefix={prefix}
                        suffix={suffix}
                        onPrefixChange={setPrefix}
                        onSuffixChange={setSuffix}
                    />

                    {/* Segments */}
                    <div className="stachesepl-pattern-builder-segments">
                        {segments.map((segment, index) => (
                            <PatternSegmentComponent
                                key={segment.id}
                                segment={segment}
                                index={index}
                                canRemove={segments.length > 1}
                                onUpdate={(updates) => updateSegment(segment.id, updates)}
                                onRemove={() => handleRemoveSegment(segment.id)}
                            />
                        ))}

                        <button
                            className="stachesepl-pattern-builder-add-segment"
                            onClick={handleAddSegment}
                        >
                            <Add sx={{ fontSize: 18 }} />
                            {__('ADD_SEGMENT')}
                        </button>
                    </div>
                </div>

                <PatternPreview
                    pattern={pattern}
                    previewValues={previewValues}
                    numItems={numItems}
                />
            </div>
        </Dialog>
    );
};

export default PatternBuilder;
