import { __ } from '@src/utils';
import { AutoAwesome } from '@mui/icons-material';

interface QuickPatternsProps {
    onSelect: (pattern: string) => void;
}

const QuickPatterns = (props: QuickPatternsProps) => {
    const { onSelect } = props;

    const quickPatterns = [
        { pattern: '[1]!', result: '1, 2, 3, 4…', title: '1, 2, 3, 4...' },
        { pattern: '[A]!', result: 'A, B, C, D…', title: 'A, B, C, D...' },
        { pattern: '[A]-[1]!', result: 'A-1, B-2, C-3…', title: 'A-1, B-2, C-3...' },
        { pattern: '[A*3]-[1~3]!', result: 'A-1, A-2, A-3, B-1…', title: 'A-1, A-2, A-3, B-1, B-2, B-3...' }
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
                        title={quickPattern.title}
                    >
                        <span className="pattern-code">{quickPattern.pattern}</span>
                        <span className="pattern-result">{quickPattern.result}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickPatterns;

