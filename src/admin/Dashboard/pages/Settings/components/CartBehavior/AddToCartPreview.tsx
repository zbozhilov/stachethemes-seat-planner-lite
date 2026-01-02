import { __ } from "@src/utils";
import { SettingsState } from '../../SettingsContext';
import { useEffect, useRef } from 'react';
import LabelPreview from "../LabelPreview/LabelPreview";
import { East as ArrowRight } from '@mui/icons-material';
import Button from "@src/front/AddToCart/components/SeatSelector/components/Header/components/Button/Button";
import FlexTwo from "@src/admin/Dashboard/layout/FlexTwo/FlexTwo";

const AddToCartPreview = ({ settings }: { settings: SettingsState }) => {

    const containerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {

        if (containerRef.current) {
            containerRef.current.style.setProperty('--stachesepl-add-to-cart-button-background-color', settings.stachesepl_add_to_cart_btn_bg_color);
            containerRef.current.style.setProperty('--stachesepl-add-to-cart-button-color', settings.stachesepl_add_to_cart_btn_text_color);
            containerRef.current.style.setProperty('--stachesepl-add-to-cart-button-hover-background-color', settings.stachesepl_add_to_cart_btn_bg_color_hover);
            containerRef.current.style.setProperty('--stachesepl-add-to-cart-button-hover-color', settings.stachesepl_add_to_cart_btn_text_color_hover);
        }

    }, [settings]);

    return (
        <FlexTwo>
            <LabelPreview text={__('ADD_TO_CART_BTN_PREVIEW_LABEL')} />

            <Button ref={containerRef} className='stachesepl-add-to-cart-button' onClick={() => { }}>
                {__('ADD_TO_CART')}
                <ArrowRight />
            </Button>
        </FlexTwo>
    )
}

export default AddToCartPreview;