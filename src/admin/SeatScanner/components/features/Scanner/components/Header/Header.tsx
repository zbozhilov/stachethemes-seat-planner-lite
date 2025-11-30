import { __ } from '@src/utils';
import './Header.scss';

const Header = () => {
    return (
        <div className='stachesepl-scanner-header'>
            <h2>{__('QR_CODE_SCANNER')}</h2>
            <p>{__('SCAN_QR_CODE_TO_VALIDATE_TICKET')}</p>
        </div>
    )
}

export default Header