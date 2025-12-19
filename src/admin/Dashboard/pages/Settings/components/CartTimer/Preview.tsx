import { __ } from "@src/utils";
import { SettingsState } from "../../SettingsContext";
import './Preview.scss';

const Preview = (props: { settings: SettingsState }) => {

    const textString = window.stacheseplCartTimer.label || 'Time remaining';

    return (
        <>
            <p className='stachesepl-cart-timer-label-preview'>{__('CART_TIMER_PREVIEW')}</p>

            <div className='stachesepl-cart-timer-preview-wrap'>
                <div className='stachesepl-cart-timer'>
                    <div className="stachesepl-cart-timer-row" style={{ backgroundColor: props.settings.stachesepl_cart_timer_bg_color }}>
                        <span className="stachesepl-cart-timer-label" style={{ color: props.settings.stachesepl_cart_timer_text_color }}>{textString}:</span>
                        <span className="stachesepl-cart-timer" style={{ color: props.settings.stachesepl_cart_timer_time_color }}>15:00</span>
                    </div>
                </div>

                <div className='stachesepl-cart-timer'>
                    <div className="stachesepl-cart-timer-row" style={{ backgroundColor: props.settings.stachesepl_cart_timer_bg_color }}>
                        <span className="stachesepl-cart-timer-label" style={{ color: props.settings.stachesepl_cart_timer_text_color }}>{textString}:</span>
                        <span className="stachesepl-cart-timer" style={{ color: props.settings.stachesepl_cart_timer_time_color_critical }}>04:59</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Preview