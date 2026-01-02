import './ToggleButton.scss';

const ToggleButton = (props: {
    id?: string;
    label?: string;
    labelFor?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) => {

    const { id, label, labelFor, value, onChange } = props;

    return (

        <div className='stachesepl-switch-button'>
            <label htmlFor={labelFor}>{label}</label>

            <button
                type="button"
                role="switch"
                id={id}
                aria-checked={value}
                className={`stachesepl-toggle ${value ? 'is-checked' : ''}`}
                onClick={() => onChange(!value)}
            >
                <span className="stachesepl-toggle-track">
                    <span className="stachesepl-toggle-thumb">
                        {value && (
                            <svg
                                className="stachesepl-toggle-icon"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </span>
                </span>
            </button>
        </div>
    )
}

export default ToggleButton;