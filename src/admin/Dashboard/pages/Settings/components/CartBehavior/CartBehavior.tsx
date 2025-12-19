import Container from '../../../../layout/Container/Container'
import { useSettings } from '../../SettingsContext'
import { __ } from '@src/utils'
import Select from '@src/admin/Dashboard/layout/Select'
import Input from '@src/admin/Dashboard/layout/Input'
import Toggle from '@src/admin/Dashboard/layout/Toggle'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'

const CartBehavior = () => {
    const { settings, updateSetting } = useSettings()

    return (
        <Container>

            <Select
                label={__('REDIRECT_CUSTOMERS_AFTER_SUCCESSFUL_ADDITION')}
                options={[
                    { label: __('DISABLE_REDIRECT'), value: 'disabled' },
                    { label: __('REDIRECT_TO_CART_PAGE'), value: 'cart' },
                    { label: __('REDIRECT_TO_CHECKOUT_PAGE'), value: 'checkout' },
                ]}
                value={settings.stachesepl_cart_redirect}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateSetting('stachesepl_cart_redirect', e.target.value as 'disabled' | 'cart' | 'checkout')
                }
            />

            <Divider />

            <Toggle
                label={__('SHOW_REDIRECT_MESSAGE')}
                description={__('SHOW_REDIRECT_MESSAGE_DESCRIPTION')}
                checked={settings.stachesepl_cart_redirect_message === 'yes'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSetting('stachesepl_cart_redirect_message', e.target.checked ? 'yes' : 'no')
                }
            />

            <Divider />

            <Input
                label={__('REDIRECT_MESSAGE')}
                description={__('REDIRECT_MESSAGE_DESCRIPTION')}
                value={settings.stachesepl_cart_redirect_message_text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSetting('stachesepl_cart_redirect_message_text', e.target.value)
                }
            />
        </Container>
    )
}

export default CartBehavior
