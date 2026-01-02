import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { __ } from '@src/utils';

export type SettingsState = {
    stachesepl_compat_mode: 'yes' | 'no'
    stachesepl_reserve_time: number
    stachesepl_cart_redirect: 'disabled' | 'cart' | 'checkout'
    stachesepl_cart_redirect_message: 'yes' | 'no'
    stachesepl_cart_redirect_message_text: string
    stachesepl_cart_timer_enabled: 'yes' | 'no'
    stachesepl_cart_timer_bg_color: string
    stachesepl_cart_timer_text_color: string
    stachesepl_cart_timer_time_color: string
    stachesepl_cart_timer_time_color_critical: string
    stachesepl_pdf_attachments: 'yes' | 'no'
    stachesepl_pdf_attachment_name: string
    stachesepl_auto_confirm_paid_orders: 'yes' | 'no'
    stachesepl_app_enabled: 'yes' | 'no'
    stachesepl_app_secret_key: string

    // DATEPICKER
    stachesepl_datepicker_accent_color: string

    // SELECT SEAT BUTTON
    stachesepl_select_seat_btn_bg_color: string
    stachesepl_select_seat_btn_bg_color_hover: string
    stachesepl_select_seat_btn_text_color: string
    stachesepl_select_seat_btn_text_color_hover: string

    // ADD TO CART BUTTON
    stachesepl_add_to_cart_btn_bg_color: string
    stachesepl_add_to_cart_btn_bg_color_hover: string
    stachesepl_add_to_cart_btn_text_color: string
    stachesepl_add_to_cart_btn_text_color_hover: string

    // VIEW CART BUTTON
    stachesepl_view_cart_button_bg_color: string
    stachesepl_view_cart_button_bg_color_hover: string
    stachesepl_view_cart_button_text_color: string
    stachesepl_view_cart_button_text_color_hover: string
}

type SettingsContextType = {
    settings: SettingsState
    updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
    saveSettings: () => Promise<void>
    isSaving: boolean
    hasChanges: boolean
}

const defaultSettings: SettingsState = {
    stachesepl_compat_mode: 'yes',
    stachesepl_reserve_time: 15,
    stachesepl_cart_redirect: 'checkout',
    stachesepl_cart_redirect_message: 'yes',
    stachesepl_cart_redirect_message_text: '',
    stachesepl_cart_timer_enabled: 'yes',
    stachesepl_cart_timer_bg_color: '#f1f5f9',
    stachesepl_cart_timer_text_color: '#475569',
    stachesepl_cart_timer_time_color: '#0f172a',
    stachesepl_cart_timer_time_color_critical: '#ef4444',

    // DATEPICKER
    stachesepl_datepicker_accent_color: '#873eff',

    stachesepl_pdf_attachments: 'yes',
    stachesepl_pdf_attachment_name: '',
    stachesepl_auto_confirm_paid_orders: 'no',
    stachesepl_app_enabled: 'yes',
    stachesepl_app_secret_key: '',

    // SELECT SEAT BUTTON
    stachesepl_select_seat_btn_bg_color: '#873eff',
    stachesepl_select_seat_btn_bg_color_hover: '#722ed1',
    stachesepl_select_seat_btn_text_color: '#fff',
    stachesepl_select_seat_btn_text_color_hover: '#fff',

    // ADD TO CART BUTTON
    stachesepl_add_to_cart_btn_bg_color: '#2c9f45',
    stachesepl_add_to_cart_btn_bg_color_hover: '#0abf53',
    stachesepl_add_to_cart_btn_text_color: '#fff',
    stachesepl_add_to_cart_btn_text_color_hover: '#fff',

    // VIEW CART BUTTON
    stachesepl_view_cart_button_bg_color: '#202020',
    stachesepl_view_cart_button_bg_color_hover: '#000',
    stachesepl_view_cart_button_text_color: '#fff',
    stachesepl_view_cart_button_text_color_hover: '#fff'
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
