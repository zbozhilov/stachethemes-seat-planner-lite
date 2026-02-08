import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Toggle from '@src/admin/Dashboard/layout/Toggle'
import Container from '../../../../layout/Container/Container'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import Input from '@src/admin/Dashboard/layout/Input'
import { useSettings } from '../../SettingsContext'
import './MobileApp.scss'
import { __ } from '@src/utils'

const generateSecretKey = (length: number = 32): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    let result = ''

    if (window.crypto && window.crypto.getRandomValues) {
        const bytes = new Uint8Array(length)
        window.crypto.getRandomValues(bytes)
        for (let i = 0; i < length; i++) {
            result += charset[bytes[i] % charset.length]
        }
    } else {
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length))
        }
    }

    return result
}

const MobileApp = () => {
    const restBaseUrl = window.stachesepl_rest_url.rest_url;

    const { settings, updateSetting } = useSettings()
    const [copyButtonText, setCopyButtonText] = useState('Copy')
    const restUrlInputRef = useRef<HTMLInputElement>(null)

    const handleGenerateKey = () => {
        updateSetting('stachesepl_app_secret_key', generateSecretKey(32))
    }

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.preventDefault()
        toast.error(__('MOBILE_APP_NOT_SUPPORTED_IN_LITE'))
    }

    const handleCopyRestUrl = async () => {
        try {
            await navigator.clipboard.writeText(restBaseUrl)
            setCopyButtonText(__('COPIED'))
            setTimeout(() => setCopyButtonText(__('COPY')), 1500)
        } catch {
            // Clipboard API not available or permission denied
        }
    }

    const handleAppToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            toast.error(__('MOBILE_APP_NOT_SUPPORTED_IN_LITE'))
        } else {
            updateSetting('stachesepl_app_enabled', 'no')
        }
    }

    const secretKeyLength = settings.stachesepl_app_secret_key.length

    return (
        <Container>
            <div className="stachesepl-mobile-app-section">
                <h3 className="stachesepl-mobile-app-section-title">{__('ANDROID_APP')}</h3>
                <p className="stachesepl-mobile-app-section-description">
                    {__('ANDROID_APP_DESC')}
                </p>
                <a
                    href="#"
                    className="stachesepl-mobile-app-download-link"
                    onClick={handleDownloadClick}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {__('DOWNLOAD_ANDROID_APK')}
                </a>
            </div>

            <Divider />

            <Toggle
                label={__('ENABLE_APP_ACCESS')}
                description={__('ENABLE_APP_ACCESS_DESC')}
                checked={settings.stachesepl_app_enabled === 'yes'}
                onChange={handleAppToggleChange}
            />

            {settings.stachesepl_app_enabled === 'yes' && <>

                <Divider />

                <div className="stachesepl-mobile-app-rest-url">
                    <Input
                        ref={restUrlInputRef}
                        label={__('REST_API_BASE_URL')}
                        description={__('REST_API_BASE_URL_DESC')}
                        value={restBaseUrl}
                        readOnly
                        suffix={
                            <button
                                type="button"
                                className="stachesepl-mobile-app-copy-button"
                                onClick={handleCopyRestUrl}
                            >
                                {copyButtonText}
                            </button>
                        }
                    />
                </div>

                <Divider />

                <div className="stachesepl-mobile-app-secret-key">
                    <Input
                        label={__('APP_SECRET_KEY')}
                        description={__('APP_SECRET_KEY_DESC')}
                        placeholder={__('APP_SECRET_KEY_PLACEHOLDER')}
                        value={settings.stachesepl_app_secret_key}
                        onChange={(e) => updateSetting('stachesepl_app_secret_key', e.target.value)}
                        suffix={
                            <button
                                type="button"
                                className="stachesepl-mobile-app-generate-button"
                                onClick={handleGenerateKey}
                            >
                                {__('GENERATE')}
                            </button>
                        }
                    />
                    {secretKeyLength > 0 && secretKeyLength < 8 && (
                        <p className="stachesepl-mobile-app-error">
                            {__('SECRET_KEY_MIN_LENGTH_ERROR')}
                        </p>
                    )}
                </div>
            </>}
        </Container>
    )
}

export default MobileApp
