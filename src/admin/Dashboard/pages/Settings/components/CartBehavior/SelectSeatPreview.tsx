import FlexTwo from "@src/admin/Dashboard/layout/FlexTwo/FlexTwo";
import { __ } from "@src/utils";
import { useEffect, useRef } from 'react';
import { SettingsState } from '../../SettingsContext';
import LabelPreview from "../LabelPreview/LabelPreview";
import './SelectSeatPreview.scss';

const SelectSeatPreview = ({ settings }: { settings: SettingsState }) => {

    const containerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {

        if (containerRef.current) {
            containerRef.current.style.setProperty('--stachesepl-select-seat-button-background-color', settings.stachesepl_select_seat_btn_bg_color);
            containerRef.current.style.setProperty('--stachesepl-select-seat-button-color', settings.stachesepl_select_seat_btn_text_color);
            containerRef.current.style.setProperty('--stachesepl-select-seat-button-hover-background-color', settings.stachesepl_select_seat_btn_bg_color_hover);
            containerRef.current.style.setProperty('--stachesepl-select-seat-button-hover-color', settings.stachesepl_select_seat_btn_text_color_hover);
        }

    }, [settings]);

    return (
        <FlexTwo>
            <LabelPreview text={__('SELECT_SEAT_BTN_BTN_PREVIEW_LABEL')} />
            <button ref={containerRef} className="stachesepl-select-seats-button">{__('SELECT_SEAT')}</button>
        </FlexTwo>
    )
}

export default SelectSeatPreview;