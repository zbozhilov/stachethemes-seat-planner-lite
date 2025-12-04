import { __ } from '@src/utils';

interface PrefixSuffixFieldsProps {
    prefix: string;
    suffix: string;
    onPrefixChange: (value: string) => void;
    onSuffixChange: (value: string) => void;
}

const PrefixSuffixFields = (props: PrefixSuffixFieldsProps) => {
    const { prefix, suffix, onPrefixChange, onSuffixChange } = props;

    return (
        <div className="stachesepl-pattern-builder-row">
            <div className="stachesepl-pattern-builder-field">
                <label>{__('PREFIX')}</label>
                <input
                    type="text"
                    value={prefix}
                    onChange={(e) => onPrefixChange(e.target.value)}
                    placeholder=""
                    maxLength={10}
                />
            </div>
            <div className="stachesepl-pattern-builder-field">
                <label>{__('SUFFIX')}</label>
                <input
                    type="text"
                    value={suffix}
                    onChange={(e) => onSuffixChange(e.target.value)}
                    placeholder=""
                    maxLength={10}
                />
            </div>
        </div>
    );
};

export default PrefixSuffixFields;

