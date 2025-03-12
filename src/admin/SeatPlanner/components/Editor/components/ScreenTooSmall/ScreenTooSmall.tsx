import './ScreenTooSmall.scss'
import { __ } from '@src/utils'

const ScreenTooSmall = () => {
    return (
        <div className='stsp-screen-too-small'>
            <span>{__('SCREEN_TOO_SMALL')}</span>
        </div>
    )
}

export default ScreenTooSmall