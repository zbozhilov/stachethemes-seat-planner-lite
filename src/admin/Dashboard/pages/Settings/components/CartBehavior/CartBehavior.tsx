import Container from '../../../../layout/Container/Container'
import { useSettings } from '../../SettingsContext'
import { __ } from '@src/utils'
import Select from '@src/admin/Dashboard/layout/Select'
import Input from '@src/admin/Dashboard/layout/Input'
import Toggle from '@src/admin/Dashboard/layout/Toggle'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import ColorPicker from '@src/admin/Dashboard/layout/ColorPicker'
import AddToCartPreview from './AddToCartPreview'
import ViewCartPreview from './ViewCartPreview'
import SelectSeatPreview from './SelectSeatPreview'
import FlexTwo from '@src/admin/Dashboard/layout/FlexTwo/FlexTwo'

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

            <Divider />

            {/* SELECT SEAT BUTTON */}

            <FlexTwo>


                <ColorPicker
                    label={__('SELECT_SEAT_BTN_BG_COLOR')}
                    description={__('SELECT_SEAT_BTN_BG_COLOR_DESC')}
                    value={settings.stachesepl_select_seat_btn_bg_color}
                    onChange={(color) => updateSetting('stachesepl_select_seat_btn_bg_color', color)}
                />

                <ColorPicker
                    label={__('SELECT_SEAT_BTN_TEXT_COLOR')}
                    description={__('SELECT_SEAT_BTN_TEXT_COLOR_DESC')}
                    value={settings.stachesepl_select_seat_btn_text_color}
                    onChange={(color) => updateSetting('stachesepl_select_seat_btn_text_color', color)}
                />

            </FlexTwo>

            <Divider />

            <FlexTwo>

                <ColorPicker
                    label={__('SELECT_SEAT_BTN_BG_COLOR_HOVER')}
                    description={__('SELECT_SEAT_BTN_BG_COLOR_HOVER_DESC')}
                    value={settings.stachesepl_select_seat_btn_bg_color_hover}
                    onChange={(color) => updateSetting('stachesepl_select_seat_btn_bg_color_hover', color)}
                />

                <ColorPicker
                    label={__('SELECT_SEAT_BTN_TEXT_COLOR_HOVER')}
                    description={__('SELECT_SEAT_BTN_TEXT_COLOR_HOVER_DESC')}
                    value={settings.stachesepl_select_seat_btn_text_color_hover}
                    onChange={(color) => updateSetting('stachesepl_select_seat_btn_text_color_hover', color)}
                />

            </FlexTwo>

            <Divider />

            <SelectSeatPreview settings={settings} />

            <Divider />

            {/* ADD TO CART  */}

            <FlexTwo>
                <ColorPicker
                    label={__('ADD_TO_CART_BG_COLOR')}
                    description={__('ADD_TO_CART_BG_COLOR_DESC')}
                    value={settings.stachesepl_add_to_cart_btn_bg_color}
                    onChange={(color) => updateSetting('stachesepl_add_to_cart_btn_bg_color', color)}
                />

                <ColorPicker
                    label={__('ADD_TO_CART_TEXT_COLOR')}
                    description={__('ADD_TO_CART_TEXT_COLOR_DESC')}
                    value={settings.stachesepl_add_to_cart_btn_text_color}
                    onChange={(color) => updateSetting('stachesepl_add_to_cart_btn_text_color', color)}
                />



            </FlexTwo>

            <Divider />

            <FlexTwo>

                <ColorPicker
                    label={__('ADD_TO_CART_BG_COLOR_HOVER')}
                    description={__('ADD_TO_CART_BG_COLOR_HOVER_DESC')}
                    value={settings.stachesepl_add_to_cart_btn_bg_color_hover}
                    onChange={(color) => updateSetting('stachesepl_add_to_cart_btn_bg_color_hover', color)}
                />

                <ColorPicker
                    label={__('ADD_TO_CART_TEXT_COLOR_HOVER')}
                    description={__('ADD_TO_CART_TEXT_COLOR_HOVER_DESC')}
                    value={settings.stachesepl_add_to_cart_btn_text_color_hover}
                    onChange={(color) => updateSetting('stachesepl_add_to_cart_btn_text_color_hover', color)}
                />

            </FlexTwo>

            <Divider />

            <AddToCartPreview settings={settings} />

            <Divider />


            {/* VIEW CART */}

            <FlexTwo>

                <ColorPicker
                    label={__('VIEW_CART_BG_COLOR')}
                    description={__('VIEW_CART_BG_COLOR_DESC')}
                    value={settings.stachesepl_view_cart_button_bg_color}
                    onChange={(color) => updateSetting('stachesepl_view_cart_button_bg_color', color)}
                />

                <ColorPicker
                    label={__('VIEW_CART_TEXT_COLOR')}
                    description={__('VIEW_CART_TEXT_COLOR_DESC')}
                    value={settings.stachesepl_view_cart_button_text_color}
                    onChange={(color) => updateSetting('stachesepl_view_cart_button_text_color', color)}
                />

            </FlexTwo>

            <Divider />

            <FlexTwo>

                <ColorPicker
                    label={__('VIEW_CART_BG_COLOR_HOVER')}
                    description={__('VIEW_CART_BG_COLOR_HOVER_DESC')}
                    value={settings.stachesepl_view_cart_button_bg_color_hover}
                    onChange={(color) => updateSetting('stachesepl_view_cart_button_bg_color_hover', color)}
                />

                <ColorPicker
                    label={__('VIEW_CART_TEXT_COLOR_HOVER')}
                    description={__('VIEW_CART_TEXT_COLOR_HOVER_DESC')}
                    value={settings.stachesepl_view_cart_button_text_color_hover}
                    onChange={(color) => updateSetting('stachesepl_view_cart_button_text_color_hover', color)}
                />

            </FlexTwo>

            <Divider />

            <ViewCartPreview settings={settings} />


        </Container>
    )
}

export default CartBehavior
