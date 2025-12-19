import { __ } from '@src/utils';

interface PatternPreviewProps {
    pattern: string;
    previewValues: string[];
    numItems: number;
}

const PatternPreview = (props: PatternPreviewProps) => {
    const { pattern, previewValues, numItems } = props;

    return (
        <div className="stachesepl-pattern-builder-section stachesepl-pattern-builder-preview-section">
            <div className="stachesepl-pattern-builder-section-title">
                {__('PREVIEW')}
                <span className="stachesepl-pattern-builder-pattern-code">
                    {pattern}
                </span>
            </div>
            <div className="stachesepl-pattern-builder-preview">
                {previewValues.map((value, index) => (
                    <span key={index} className="stachesepl-pattern-builder-preview-item">
                        {value}
                    </span>
                ))}
                {numItems > 10 && (
                    <span className="stachesepl-pattern-builder-preview-more">
                        …+{numItems - 10} {__('MORE')}
                    </span>
                )}
            </div>
            <div className="stachesepl-pattern-builder-items-info">
                {numItems} {__('ITEMS_SELECTED')}
            </div>
        </div>
    );
};

export default PatternPreview;

