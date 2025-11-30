import { QrCode } from '@mui/icons-material';
import { __ } from '@src/utils';
import toast from 'react-hot-toast';
import QrScan from '../features/QrScan/QrScan';
import './Body.scss';

const Body = (props: {
    onScanComplete: (data: string) => void;
}) => {

    return (
        <div className='stachesepl-scanner-body-wrapper'>
            <div className='stachesepl-scanner-body'>
                <div className='stachesepl-scanner-body-overlay'>
                    <QrCode />
                </div>
                <QrScan
                    id='stachesepl-scanner-qr-seats'
                    onSuccess={(data: string) => {

                        if (data.startsWith('wc_order_')) {
                            props.onScanComplete(data);
                        } else {
                            toast.error(__('QR_CODE_INVALID'));
                        }

                    }}
                    onError={error => {
                        
                        if (error?.name === 'NotAllowedError') {
                            toast.error(__('CAMERA_ACCESS_DENIED'));
                        } else if (error?.message) {
                            toast.error(error.message);
                        } else {
                            toast.error(__('QR_CODE_SCAN_FAILED'));
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default Body