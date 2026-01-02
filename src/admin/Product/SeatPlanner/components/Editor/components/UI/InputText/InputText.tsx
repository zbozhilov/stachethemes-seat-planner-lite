import { Warning } from '@mui/icons-material';
import './InputText.scss';

const InputText = (props: {
    id?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    label?: string;
    labelFor?: string;
    error?: string;
    placeholder?: string;
    value: string | number;
    onChange: (value: string | number) => void;
}) => {

    const { id, inputProps, label, labelFor, error, placeholder, value, onChange } = props;

    const handleChange = (value: string | number) => {
        onChange(value);
    }

    return (
        <div className='stachesepl-input-text'>
            {label && <label htmlFor={labelFor}>{label}</label>}
            <input id={id} type="text" placeholder={placeholder} value={value} onChange={(e) => {
                handleChange(e.target.value)
            }} {...inputProps} />
            {!!error && <span className='stachesepl-input-error'>
                <Warning sx={{ fontSize: 14, color: 'var(--stachesepl-accent-danger)' }} />
                {error}
            </span>}
        </div>
    )
}

export default InputText;