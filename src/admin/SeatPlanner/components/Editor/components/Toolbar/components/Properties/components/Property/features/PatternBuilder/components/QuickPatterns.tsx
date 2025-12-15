import { __ } from '@src/utils';
import { AutoAwesome } from '@mui/icons-material';

interface QuickPatternsProps {
    onSelect: (pattern: string) => void;
}

const QuickPatterns = (props: QuickPatternsProps) => {
    const { onSelect } = props;

    const quickPatterns = [
        { pattern: '[1]!', result: '1, 2, 3, 4…', title: 'Numbers' },
        { pattern: '[A]!', result: 'A, B, C, D…', title: 'Letters' },
    ];

    return (
        <div className="stachesepl-pattern-builder-section">
            <div className="stachesepl-pattern-builder-section-title">
                <AutoAwesome sx={{ fontSize: 16 }} />
                {__('QUICK_PATTERNS')}
            </div>
            <div className="stachesepl-pattern-builder-quick-patterns">
                {quickPatterns.map((quickPattern) => (
                    <button
                        key={quickPattern.pattern}
                        className="stachesepl-pattern-builder-quick-btn"
                        onClick={() => onSelect(quickPattern.pattern)}
                        title={`${quickPattern.title}`}
                    >
                        <span className="pattern-code">{quickPattern.title}</span>
                        <span className="pattern-result">{quickPattern.result}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickPatterns;

