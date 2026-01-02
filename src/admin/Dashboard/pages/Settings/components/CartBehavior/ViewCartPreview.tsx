import FlexTwo from "@src/admin/Dashboard/layout/FlexTwo/FlexTwo";
import { __ } from "@src/utils";
import { useEffect, useRef } from 'react';
import { SettingsState } from '../../SettingsContext';
import LabelPreview from "../LabelPreview/LabelPreview";
import { East as ArrowRight } from '@mui/icons-material';
import './ViewCartPreview.scss';

const ViewCartPreview = ({ settings }: { settings: SettingsState }) => {

    const containerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {

        if (containerRef.current) {
            containerRef.current.style.setProperty('--stachesepl-view-cart-button-background-color', settings.stachesepl_view_cart_button_bg_color);
            containerRef.current.style.setProperty('--stachesepl-view-cart-button-color', settings.stachesepl_view_cart_button_text_color);
            containerRef.current.style.setProperty('--stachesepl-view-cart-button-hover-background-color', settings.stachesepl_view_cart_button_bg_color_hover);
            containerRef.current.style.setProperty('--stachesepl-view-cart-button-hover-color', settings.stachesepl_view_cart_button_text_color_hover);
        }

    }, [settings]);

    return (
        <FlexTwo>
            <LabelPreview text={__('VIEW_CART_BTN_PREVIEW_LABEL')} />
            <button ref={containerRef} className="stachesepl-view-cart-button">
                {__('VIEW_CART')}
                <ArrowRight />
            </button>
        </FlexTwo>
    )
}

export default ViewCartPreview;