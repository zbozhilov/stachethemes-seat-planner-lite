import { __ } from '@src/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../layout/Button/Button';
import PageHeader from '../../layout/PageHeader/PageHeader';
import TabbedMenu from '../../layout/TabbedMenu/TabbedMenu';
import Attachments from './components/Attachments/Attachments';
import CartBehavior from './components/CartBehavior/CartBehavior';
import CartTimer from './components/CartTimer/CartTimer';
import DatePicker from './components/DatePIcker/DatePicker';
import General from './components/General/General';
import MobileApp from './components/MobileApp/MobileApp';
import './Settings.scss';
import { SettingsProvider, useSettings } from './SettingsContext';
import Pro from './components/Pro/Pro';

type SupportedTabs = 'general' | 'cart_behavior' | 'cart_timer' | 'datepicker' | 'attachments' | 'mobile_app' | 'pro';

const SettingsContent = () => {
    const [activeTab, setActiveTab] = useState<SupportedTabs>('general');
    const { saveSettings, isSaving, hasChanges } = useSettings();

    const getActiveComponent = () => {
        switch (activeTab) {

            case 'general': {
                return <General />;
            }
            case 'cart_behavior': {
                return <CartBehavior />;
            }
            case 'cart_timer': {
                return <CartTimer />;
            }
            case 'datepicker': {
                return <DatePicker />;
            }
            case 'attachments': {
                return <Attachments />;
            }
            case 'mobile_app': {
                return <MobileApp />;
            }

            case 'pro': {
                return <Pro />;
            }

            default: {
                return null;
            }
        }
    }

    const handleSave = async () => {
        const toastId = toast.loading(__('SAVING_SETTINGS'));

        try {
            await saveSettings();
            toast.success(__('SETTINGS_SAVED_SUCCESSFULLY'), { id: toastId });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : __('FAILED_TO_SAVE_SETTINGS');
            toast.error(errorMessage, { id: toastId });
        }
    }

    return (
        <div className='stachesepl-page-settings'>
            <PageHeader
                title={__('SETTINGS_TITLE')}
                description={__('SETTINGS_DESCRIPTION')}
            />

            <TabbedMenu
                activeTab={activeTab}
                setActiveTab={(tab) => setActiveTab(tab as SupportedTabs)}
                tabs={[
                    {
                        id: 'general',
                        label: __('TAB_GENERAL'),
                    },
                    {
                        id: 'cart_behavior',
                        label: __('TAB_CART_BEHAVIOR'),
                    },
                    {
                        id: 'cart_timer',
                        label: __('TAB_CART_TIMER'),
                    },
                    {
                        id: 'datepicker',
                        label: __('TAB_DATEPICKER'),
                    },
                    {
                        id: 'attachments',
                        label: __('TAB_ATTACHMENTS'),
                    },
                    {
                        id: 'mobile_app',
                        label: __('TAB_MOBILE_APP'),
                    },
                    {
                        id: 'pro',
                        label: __('TAB_PRO'),
                    }
                ]} />

            <div className="stachesepl-page-settings-content">
                {getActiveComponent()}
            </div>

            <div className="stachesepl-page-settings-footer">
                <Button
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                >
                    {isSaving ? __('SAVING', 0) : __('SAVE_SETTINGS')}
                </Button>
            </div>
        </div>
    )
}

const Settings = () => {
    return (
        <SettingsProvider>
            <SettingsContent />
        </SettingsProvider>
    )
}

export default Settings
