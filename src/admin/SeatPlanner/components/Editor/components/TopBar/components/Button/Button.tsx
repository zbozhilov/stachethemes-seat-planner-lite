import { SvgIcon } from "@mui/material";
import './Button.scss';
import { ButtonProps } from './types';

const Button = (props: ButtonProps) => {
    return (
        <div className='stachesepl-top-button' title={props?.title} onClick={props.onClick}>
            <SvgIcon component={props.icon} />
        </div>
    )
}

export default Button