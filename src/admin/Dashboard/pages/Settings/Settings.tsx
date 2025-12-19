import { useState } from 'react';
import toast from 'react-hot-toast';
import './Settings.scss'
import TabbedMenu from '../../layout/TabbedMenu/TabbedMenu';
import SlotReservation from './components/SlotReservation/SlotReservation';
import CartTimer from './components/CartTimer/CartTimer';
import CartBehavior from './components/CartBehavior/CartBehavior';
import Attachments from './components/Attachments/Attachments';
import OrderStatus from './components/OrderStatus/OrderStatus';
import Button from '../../layout/Button/Button';
import PageHeader from '../../layout/PageHeader/PageHeader';
import MobileApp from './components/MobileApp/MobileApp';
import { SettingsProvider, useSettings } from './SettingsContext';
import { __ } from '@src/utils';

type SupportedTabs = 'slot_reservation' | 'cart_behavior' | 'cart_timer' | 'attachments' | 'order_status' | 'mobile_app';

const SettingsContent = () => {
    const [activeTab, setActiveTab] = useState<SupportedTabs>('slot_reservation');
    const { saveSettings, isSaving, hasChanges } = useSettings();

    const getActiveComponent = () => {
        switch (activeTab) {
            case 'slot_reservation': {
                return <SlotReservation />;
            }
            case 'cart_behavior': {
                return <CartBehavior />;
            }
            case 'cart_timer': {
                return <CartTimer />;
            }
            case 'attachments': {
                return <Attachments />;
            }
            case 'order_status': {
                return <OrderStatus />;
            }
            case 'mobile_app': {
                return <MobileApp />;
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
                        id: 'slot_reservation',
                        label: __('TAB_SLOT_RESERVATION'),
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
                        id: 'attachments',
                        label: __('TAB_ATTACHMENTS'),
                    },
                    {
                        id: 'order_status',
                        label: __('TAB_ORDER_STATUS'),
                    },
                    {
                        id: 'mobile_app',
                        label: __('TAB_MOBILE_APP'),
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
