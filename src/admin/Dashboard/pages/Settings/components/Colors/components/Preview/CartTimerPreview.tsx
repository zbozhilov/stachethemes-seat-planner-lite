import { hexToRgba } from "@src/utils";
import { useSettings } from "../../../../SettingsContext";
import './CartTimerPreview.scss';

const CartTimerPreview = () => {

    const { settings } = useSettings();
    const accentColor = settings.stachesepl_accent_color;

    return (
        <>
            <div className="stachesepl-cart-timer" style={{
                '--stachesepl-cart-timer-color': accentColor,
                '--stachesepl-cart-timer-text-color': accentColor,
                '--stachesepl-cart-timer-background-color': hexToRgba(accentColor, 0.08),
            } as React.CSSProperties}>
                <div className="stachesepl-cart-timer-row">
                    <span className="stachesepl-cart-timer-label">{window.stacheseplCartTimer.label}</span>
                    <span className="stachesepl-cart-timer">15:00</span>
                </div>
            </div>
        </>
    )
}

export default CartTimerPreview