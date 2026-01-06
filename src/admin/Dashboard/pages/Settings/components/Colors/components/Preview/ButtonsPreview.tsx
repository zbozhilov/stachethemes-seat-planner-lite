import FlexTwo from '@src/admin/Dashboard/layout/FlexTwo/FlexTwo';
import Button from "@src/front/AddToCart/components/SeatSelector/components/Header/components/Button/Button";
import { __, darken, hexToRgba } from "@src/utils";
import { useSettings } from "../../../../SettingsContext";

const ButtonsPreview = () => {

    const { settings } = useSettings();

    const accentColor = settings.stachesepl_accent_color;

    const btnColorsStyle = {
        '--stachesepl-btn-primary-bg': accentColor,
        '--stachesepl-btn-primary-hover': darken(accentColor, 8),
        '--stachesepl-btn-secondary-bg': hexToRgba(accentColor, 0.08),
        '--stachesepl-btn-secondary-hover': hexToRgba(accentColor, 0.14),
        '--stachesepl-btn-secondary-text': accentColor,
        '--stachesepl-btn-secondary-text-hover': accentColor,
    } as React.CSSProperties;

    return (
        <div style={btnColorsStyle}>

            <FlexTwo>

                <Button onClick={() => { }}>
                    {__('BUTTON_PRIMARY')}
                </Button>

                <Button className="secondary" onClick={() => { }}>
                    {__('BUTTON_SECONDARY')}
                </Button>

            </FlexTwo>
        </div>
    )
}

export default ButtonsPreview