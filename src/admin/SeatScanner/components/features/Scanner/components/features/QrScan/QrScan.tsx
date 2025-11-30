import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useEffect, useRef } from 'react';
import './QrScan.scss';

const QrScan = (props: {
    id?: string;
    onSuccess?: (decodedText: string) => void;
    onError?: (error: { message: string; name?: string }) => void;
    className?: string;
}) => {

    const elementId = props.id || 'qrscan-id-' + new Date().getTime();
    const { onSuccess, onError } = props;
    const scanContainer = useRef<HTMLDivElement | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const lastScanString = useRef<string | null>(null);

    useEffect(() => {

        let t = setInterval(() => {

            lastScanString.current = null;

        }, 3000);

        return () => {
            clearInterval(t);
        }

    }, []);

    useEffect(() => {

        if (!scanContainer.current) {
            return;
        }

        let html5QrCode: Html5Qrcode | null = null;

        const initCamera = async (currentInstance: Html5Qrcode | null) => {
            if (currentInstance) {
                html5QrCode = currentInstance;
                return;
            }

            html5QrCode = new Html5Qrcode(elementId, {
                verbose: false,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            });

            try {
                const devices = await Html5Qrcode.getCameras();

                // Try to find back camera by label
                const backCamera = devices.find(
                    cam => /back|rear|environment/i.test(cam.label)
                ) || devices[0]; // fallback to first

                await html5QrCode.start(
                    { deviceId: { exact: backCamera.id } },
                    {
                        aspectRatio: 1,
                        fps: 10,
                    },
                    (decodedText) => {
                        if (typeof onSuccess === "function") {
                            if (lastScanString.current === decodedText) return;
                            lastScanString.current = decodedText;
                            onSuccess(decodedText);
                        }
                    },
                    (errorMessage) => {
                        if (errorMessage.includes("QR code parse error")) return;

                        if (errorMessage.includes("CanvasRenderingContext2D")) {
                            html5QrCode?.clear();
                            return;
                        }

                        if (typeof onError === "function") {
                            onError({ message: errorMessage });
                        }
                    }
                );

                html5QrCodeRef.current = html5QrCode;
            } catch (errorMessage: any) {
                const wasNotAllowedError = errorMessage.includes("NotAllowedError");
                const errorName = wasNotAllowedError ? "NotAllowedError" : "";

                if (typeof onError === "function") {
                    onError({ message: errorMessage, name: errorName });
                }
            }
        };

        initCamera(html5QrCodeRef.current)

        return () => {
            if (html5QrCode) {
                if (html5QrCode.isScanning) {
                    html5QrCode
                        .stop()
                        .then(() => {
                            html5QrCode?.clear();
                        })
                        .catch((err) => {
                            console.error('Error stopping QR scanner:', err);
                        });
                } else {
                    html5QrCode.clear();
                }
            }
        };
    }, [elementId, onError, onSuccess]);

    return (
        <div
            className='stachesepl-qrscan'
            ref={scanContainer}
            id={elementId}
        />
    );
};

export default QrScan;