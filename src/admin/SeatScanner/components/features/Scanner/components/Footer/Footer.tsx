import Button from '@src/admin/SeatScanner/components/layouts/Button/Button'
import { __ } from '@src/utils'
import './Footer.scss';

const Footer = (props: {
    onClose: () => void;
}) => {
    return (
        <div className='stachesepl-scanner-footer'>
            <Button onClick={props.onClose}>{__('CLOSE')}</Button>
        </div>
    )
}

export default Footer