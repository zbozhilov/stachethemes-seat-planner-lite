import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { useEffect, useRef } from 'react'
import './QrReader.scss'

type QrReaderProps = {
    onSuccess: (decodedText: string) => void
    onError?: (error: { message: string; name?: string }) => void
}

const QrReader = ({ onSuccess, onError }: QrReaderProps) => {
    const elementId = 'stachesepl-dashboard-qr-reader';
    const scanContainer = useRef<HTMLDivElement | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const lastScanString = useRef<string | null>(null);

    // Reset last scan string every 3 seconds to allow re-scanning
    useEffect(() => {
        const interval = setInterval(() => {
            lastScanString.current = null;
        }, 3000)

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (!scanContainer.current) return;

        let isMounted = true;
        let currentInstance: Html5Qrcode | null = null;

        const stopCamera = async (instance: Html5Qrcode | null) => {
            if (!instance) return;
            
            try {
                if (instance.isScanning) {
                    await instance.stop();
                }
            } catch (err) {
                // Ignore errors when stopping - camera might already be stopped
                console.warn('Error stopping camera:', err);
            } finally {
                try {
                    instance.clear();
                } catch (err) {
                    // Ignore clear errors
                    console.warn('Error clearing QR scanner:', err);
                }
            }
        };

        const initCamera = async () => {
            // If we already have a running instance, stop it first
            if (html5QrCodeRef.current) {
                await stopCamera(html5QrCodeRef.current);
                html5QrCodeRef.current = null;
            }

            currentInstance = new Html5Qrcode(elementId, {
                verbose: false,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            });

            try {
                const devices = await Html5Qrcode.getCameras();

                if (devices.length === 0) {
                    throw new Error('No cameras found');
                }

                // Try cameras in order: back camera, front camera, then any available
                const backCamera = devices.find(
                    cam => /back|rear|environment/i.test(cam.label)
                );

                const frontCamera = devices.find(
                    cam => /front|user|facing/i.test(cam.label)
                );

                const camerasToTry = [
                    backCamera,
                    frontCamera,
                    ...devices.filter(cam => cam !== backCamera && cam !== frontCamera)
                ].filter(Boolean) as typeof devices;

                let lastError: unknown = null;

                for (const camera of camerasToTry) {
                    if (!isMounted || !currentInstance) {
                        if (currentInstance) {
                            await stopCamera(currentInstance);
                        }
                        return;
                    }

                    try {
                        // Try with exact device ID first
                        await currentInstance.start(
                            { deviceId: { exact: camera.id } },
                            {
                                aspectRatio: 1,
                                fps: 10,
                            },
                            (decodedText) => {
                                if (!isMounted) return;
                                if (lastScanString.current === decodedText) return;
                                lastScanString.current = decodedText;
                                onSuccess(decodedText);
                            },
                            (errorMessage) => {
                                if (!isMounted) return;
                                if (errorMessage.includes('QR code parse error')) return;
                                if (errorMessage.includes('CanvasRenderingContext2D')) {
                                    currentInstance?.clear();
                                    return;
                                }
                                onError?.({ message: errorMessage });
                            }
                        );

                        html5QrCodeRef.current = currentInstance;
                        return; // Success, exit the loop
                    } catch (error) {
                        lastError = error;
                        // If this camera failed, try to stop and clear before trying next
                        if (currentInstance) {
                            await stopCamera(currentInstance);
                        }
                        // Continue to next camera
                    }
                }

                // If we get here, all cameras failed
                if (currentInstance) {
                    await stopCamera(currentInstance);
                }
                throw lastError || new Error('Could not start any camera');
            } catch (errorMessage: unknown) {
                if (!isMounted) return;

                if (currentInstance) {
                    await stopCamera(currentInstance);
                    currentInstance = null;
                }

                const errorString = String(errorMessage);
                let errorName = '';

                if (errorString.includes('NotAllowedError') || errorString.includes('Permission denied')) {
                    errorName = 'NotAllowedError';
                } else if (errorString.includes('NotReadableError') || errorString.includes('Could not start video source')) {
                    errorName = 'NotReadableError';
                } else if (errorString.includes('NotFoundError') || errorString.includes('No cameras found')) {
                    errorName = 'NotFoundError';
                }

                onError?.({
                    message: errorString,
                    name: errorName,
                });
            }
        };

        initCamera();

        return () => {
            isMounted = false;
            // Use the ref for cleanup to ensure we get the latest instance
            const instanceToCleanup = html5QrCodeRef.current || currentInstance;
            if (instanceToCleanup) {
                stopCamera(instanceToCleanup);
                html5QrCodeRef.current = null;
            }
        };
    }, [onSuccess, onError])

    return (
        <div className="stachesepl-qr-reader-wrapper">
            <div className="stachesepl-qr-reader-container">
                <div className="stachesepl-qr-reader-scanner" ref={scanContainer} id={elementId} />
                <div className="stachesepl-qr-reader-overlay">
                    <div className="stachesepl-qr-reader-frame">
                        <div className="stachesepl-qr-reader-corner stachesepl-qr-reader-corner--tl" />
                        <div className="stachesepl-qr-reader-corner stachesepl-qr-reader-corner--tr" />
                        <div className="stachesepl-qr-reader-corner stachesepl-qr-reader-corner--bl" />
                        <div className="stachesepl-qr-reader-corner stachesepl-qr-reader-corner--br" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrReader;    
