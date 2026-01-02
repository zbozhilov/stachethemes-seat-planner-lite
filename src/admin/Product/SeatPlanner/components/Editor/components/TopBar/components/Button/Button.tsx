import { SvgIcon } from "@mui/material";
import './Button.scss';
import { ButtonProps } from './types';

const Button = (props: ButtonProps) => {

    const classNameArray = ['stachesepl-top-button'];
    if (props.disabled) {
        classNameArray.push('disabled');
    }

    const handleClick = () => {
        if (props.disabled) {
            return;
        }
        props.onClick();
    }

    return (
        <div className={classNameArray.join(' ')} title={props?.title} onClick={handleClick}>
            <SvgIcon component={props.icon} />
        </div>
    )
}

export default Button