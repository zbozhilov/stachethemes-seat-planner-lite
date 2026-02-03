import './FieldLabel.scss';

const FieldLabel = (props: {
    label: string;
    required: boolean;
    description?: string;
}) => {

    const { label, required, description } = props;

    return (
        <label
            className="stachesepl-option-label"
        >
            <span className="stachesepl-option-label-row">
                <span className="stachesepl-option-label-text">
                    {label}
                </span>
                {required && (
                    <span className="stachesepl-option-label-required-indicator">*</span>
                )}
            </span>
            {description && <span className="stachesepl-option-description">
                {description}
            </span>}
        </label>
    )
}

export default FieldLabel;