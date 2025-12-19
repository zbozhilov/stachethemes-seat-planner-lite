import './ScreenTooSmall.scss'
import { __ } from '@src/utils'
import { Smartphone } from "@mui/icons-material";

const ScreenTooSmall = () => {
    return (
        <div className='stachesepl-screen-too-small'>
            <span>
                <Smartphone sx={{ fontSize: 48, display: 'block', marginBottom: '16px' }} />
                {__('SCREEN_TOO_SMALL')}
            </span>
        </div>
    )
}

export default ScreenTooSmall