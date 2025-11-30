import { QrCode, Warning } from '@mui/icons-material'
import { __ } from '@src/utils'
import { useState } from 'react'
import Loader from '../../features/Loader/Loader'
import Modal from '../../features/Modal/Modal'
import Scanner from '../../features/Scanner/Scanner'
import Toaster from '../../features/Toaster/Toaster'
import { useQrProductData } from '../../hooks'
import Button from '../../layouts/Button/Button'
import PageContainer from '../../layouts/PageContainer/PageContainer'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import './Home.scss'
import DisplayResult from './components/DisplayResult/DisplayResult'

const Home = () => {

    const [scannerOpen, setScannerOpen] = useState(false);
    const [qrStringData, setQrStringData] = useState<string | null>(null);
    const { data, ready, error } = useQrProductData(qrStringData);

    const handleScannerOpen = () => {
        setScannerOpen(true);
    }

    const handleScannerClose = () => {
        setScannerOpen(false);
    }

    const handleResetScan = () => {
        setQrStringData(null);
        setScannerOpen(true);
    }

    const renderContent = () => {
        if (error) {

            let errorMessage = __('GENERIC_ERROR_MESSAGE');

            if (data && 'error' in data) {
                errorMessage = data.error;
            }

            return (
                <div className='stachesepl-scan-home-content-start'>
                    <Warning />
                    <h2>{__('ERROR')}</h2>
                    <p>{errorMessage}</p>
                    <Button onClick={handleResetScan}>{__('TRY_AGAIN')}</Button>
                </div>
            );
        }

        if (!qrStringData) {
            return (
                <div className='stachesepl-scan-home-content-start'>
                    <QrCode />
                    <h2>{__('QR_CODE_SCANNER')}</h2>
                    <p>{__('SCAN_THE_QR_CODE_TO_GET_SEAT_DETAILS')}</p>
                    <Button onClick={handleScannerOpen}>{__('SCAN_NOW')}</Button>
                </div>
            );
        }

        if (!ready) {
            return <Loader />;
        }

        return (
            <>
                {<DisplayResult data={data} />}
                <Button onClick={handleResetScan}>{__('SCAN_NEW_TICKET')}</Button>
            </>
        );
    };

    return (
        <>
            <Modal open={scannerOpen} onClose={handleScannerClose}>
                <Scanner onScanComplete={text => {
                    setQrStringData(text);
                    handleScannerClose();
                }} />
            </Modal>

            <div className='stachesepl-scan-home'>

                <Toaster />

                <PageHeader title={__('SEAT_SCANNER')} />

                <PageContainer>
                    <div className='stachesepl-scan-home-content'>
                        {renderContent()}
                    </div>
                </PageContainer>

            </div>
        </>
    )
}

export default Home

