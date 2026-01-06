import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { __ } from '@src/utils';

export type SettingsState = {
    stachesepl_enable_in_loop_button: 'yes' | 'no'
    stachesepl_compat_mode: 'yes' | 'no'
    stachesepl_reserve_time: number
    stachesepl_cart_redirect: 'disabled' | 'cart' | 'checkout'
    stachesepl_cart_redirect_message: 'yes' | 'no'
    stachesepl_cart_redirect_message_text: string
    stachesepl_cart_timer_enabled: 'yes' | 'no'
    stachesepl_pdf_attachments: 'yes' | 'no'
    stachesepl_pdf_attachment_name: string
    stachesepl_auto_confirm_paid_orders: 'yes' | 'no'
    stachesepl_app_enabled: 'yes' | 'no'
    stachesepl_app_secret_key: string

    // ACCENT COLOR
    stachesepl_accent_color: string

}

type SettingsContextType = {
    settings: SettingsState
    updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
    saveSettings: () => Promise<void>
    isSaving: boolean
    hasChanges: boolean
}

const defaultSettings: SettingsState = {
    stachesepl_enable_in_loop_button: 'yes',
    stachesepl_compat_mode: 'yes',
    stachesepl_reserve_time: 15,
    stachesepl_cart_redirect: 'checkout',
    stachesepl_cart_redirect_message: 'yes',
    stachesepl_cart_redirect_message_text: '',
    stachesepl_cart_timer_enabled: 'yes',

    // ACCENT COLOR
    stachesepl_accent_color: '#873eff',

    stachesepl_pdf_attachments: 'yes',
    stachesepl_pdf_attachment_name: '',
    stachesepl_auto_confirm_paid_orders: 'no',
    stachesepl_app_enabled: 'yes',
    stachesepl_app_secret_key: '',

}

const SettingsContext = createContext<SettingsContextType | null>(null)

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

type SettingsProviderProps = {
    children: ReactNode
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const initialSettings: SettingsState = {
        ...defaultSettings,
        ...window.stachesepl_settings
    };

    const [settings, setSettings] = useState<SettingsState>(initialSettings);
    const [savedSettings, setSavedSettings] = useState<SettingsState>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);

    const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

    const updateSetting = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }, []);

    const saveSettings = useCallback(async () => {
        setIsSaving(true);

        try {
            const formData = new FormData()
            formData.append('action', 'seatplanner');
            formData.append('task', 'save_dashboard_settings');
            formData.append('nonce', window.stachesepl_ajax.nonce);
            formData.append('settings', JSON.stringify(settings));

            const response = await fetch(window.stachesepl_ajax.ajax_url, {
                method: 'POST',
                body: formData
            }); 

            const result = await response.json();

            if (result.success) {
                const savedSettingsData = result.data.settings;
                setSavedSettings(savedSettingsData);
                setSettings(savedSettingsData);
                // Update window.stachesepl_settings so remounts will have the latest settings
                window.stachesepl_settings = savedSettingsData;
            } else {
                throw new Error(result.data?.error || __('FAILED_TO_SAVE_SETTINGS'));
            }
        } catch (error) {
            console.error(__('FAILED_TO_SAVE_SETTINGS'), error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, saveSettings, isSaving, hasChanges }}>
            {children}
        </SettingsContext.Provider>
    );
}
