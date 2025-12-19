import { useState, useEffect, useCallback } from 'react'
import { Portal } from 'react-portal'
import { QrCodeScanner, Error as ErrorIcon, Close } from '@mui/icons-material'
import PageHeader from '../../layout/PageHeader/PageHeader'
import Container from '../../layout/Container/Container'
import Button from '../../layout/Button/Button'
import QrReader from './components/QrReader/QrReader'
import ScanResult, { ScanResultData } from './components/ScanResult/ScanResult'
import './Scanner.scss'
import { __ } from '@src/utils'

type ScannerState = 'idle' | 'scanning' | 'loading' | 'result' | 'error'

const Scanner = () => {
    const [state, setState] = useState<ScannerState>('idle');
    const [scanData, setScanData] = useState<ScanResultData>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleOpenScanner = () => {
        setState('scanning');
        setErrorMessage('');
    }

    const handleCloseScanner = useCallback(() => {
        setState('idle');
    }, [])

    const handleScanSuccess = useCallback(async (qrString: string) => {
        // Validate QR string format
        if (!qrString.startsWith('wc_order_')) {
            setErrorMessage(__('QR_CODE_INVALID'));
            setState('error');
            return;
        }

        setState('loading');

        try {
            const response = await fetch(window.stachesepl_ajax.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'seatplanner',
                    task: 'get_qr_string_details',
                    qr_string: qrString,
                    _wpnonce: window.stachesepl_ajax.nonce,
                }),
            })

            if (!response.ok) {
                throw new Error(__('GENERIC_ERROR_MESSAGE'));
            }

            const result = await response.json()

            if (result.data?.error) {
                setErrorMessage(result.data.error);
                setState('error');
                return;
            }

            setScanData(result.data);
            setState('result');
        } catch {
            setErrorMessage(__('GENERIC_ERROR_MESSAGE'));
            setState('error');
        }
    }, [])

    const handleScanError = useCallback((error: { message: string; name?: string }) => {
        if (error.name === 'NotAllowedError') {
            setErrorMessage(__('CAMERA_ACCESS_DENIED'));
        } else if (error.name === 'NotReadableError') {
            setErrorMessage(__('CAMERA_IN_USE_OR_UNAVAILABLE'));
        } else if (error.name === 'NotFoundError') {
            setErrorMessage(__('NO_CAMERA_FOUND'));
        } else {
            setErrorMessage(error.message || __('QR_CODE_SCAN_FAILED'));
        }
        setState('error');
    }, []);

    const handleScanAnother = () => {
        setScanData(null);
        setState('scanning');
        setErrorMessage('');
    }

    const handleTryAgain = () => {
        setErrorMessage('');
        setState('scanning');
    }

    // Handle Escape key to close scanner modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && state === 'scanning') {
                handleCloseScanner();
            }
        }

        if (state === 'scanning') {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        }
    }, [state, handleCloseScanner]);

    const renderIdleContent = () => (
        <div className="stachesepl-scanner-empty">
            <div className="stachesepl-scanner-empty-icon">
                <QrCodeScanner sx={{ fontSize: 48 }} />
            </div>
            <h2 className="stachesepl-scanner-empty-title">{__('QR_CODE_SCANNER')}</h2>
            <p className="stachesepl-scanner-empty-description">
                {__('SCAN_THE_QR_CODE_TO_GET_SEAT_DETAILS')}
            </p>
            <Button onClick={handleOpenScanner}>{__('SCAN_NOW')}</Button>
        </div>
    );

    const renderLoadingContent = () => (
        <div className="stachesepl-scanner-loading">
            <div className="stachesepl-scanner-loading-spinner" />
            <span>{__('LOADING')}...</span>
        </div>
    );

    const renderErrorContent = () => (
        <div className="stachesepl-scanner-error">
            <div className="stachesepl-scanner-error-icon">
                <ErrorIcon sx={{ fontSize: 48 }} />
            </div>
            <h2 className="stachesepl-scanner-error-title">{__('ERROR')}</h2>
            <p className="stachesepl-scanner-error-message">{errorMessage}</p>
            <Button onClick={handleTryAgain}>{__('TRY_AGAIN')}</Button>
        </div>
    );

    const renderResultContent = () => (
        <div className="stachesepl-scanner-result-wrapper">
            <ScanResult data={scanData} />
            <div className="stachesepl-scanner-result-actions">
                <Button onClick={handleScanAnother}>{__('SCAN_NEW_TICKET')}</Button>
            </div>
        </div>
    );

    const renderScannerModal = () => (
        <Portal>
            <div className="stachesepl-scanner-modal-overlay" onClick={handleCloseScanner}>
                <div className="stachesepl-scanner-modal" onClick={e => e.stopPropagation()}>
                    <div className="stachesepl-scanner-modal-header">
                        <h3 className="stachesepl-scanner-modal-title">{__('SCAN_QR_CODE')}</h3>
                        <button 
                            className="stachesepl-scanner-modal-close"
                            onClick={handleCloseScanner}
                            type="button"
                        >
                            <Close sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                    <div className="stachesepl-scanner-modal-body">
                        <QrReader 
                            key="qr-reader-scanner"
                            onSuccess={handleScanSuccess}
                            onError={handleScanError}
                        />
                        <p className="stachesepl-scanner-modal-hint">
                            {__('POSITION_QR_CODE_IN_FRAME')}
                        </p>
                    </div>
                    <div className="stachesepl-scanner-modal-footer">
                        <Button variant="secondary" onClick={handleCloseScanner}>
                            {__('CANCEL')}
                        </Button>
                    </div>
                </div>
            </div>
        </Portal>
    );

    const renderContent = () => {
        switch (state) {
            case 'loading':
                return renderLoadingContent();
            case 'error':
                return renderErrorContent();
            case 'result':
                return renderResultContent();
            default:
                return renderIdleContent();
        }
    }

    return (
        <div className="stachesepl-page-scanner">
            <PageHeader
                title={__('SEAT_SCANNER')}
                description={__('SCAN_TICKETS_TO_VERIFY_AND_CHECK_IN')}
            />

            <Container>
                <div className="stachesepl-scanner-content">
                    {renderContent()}
                </div>
            </Container>

            {state === 'scanning' && renderScannerModal()}
        </div>
    )
}

export default Scanner;
