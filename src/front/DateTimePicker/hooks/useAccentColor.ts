import { darken, hexToRgba } from "@src/utils";
import { useEffect, useState } from "react";

const useAccentColor = (props: {
    accentColor: string | undefined;
}) => {

    const { accentColor } = props;
    const [style, setStyle] = useState<React.CSSProperties>({});
    useEffect(() => {

        if (!accentColor) {
            return;
        }

        const accent = accentColor;

        const style = {
            '--picker-accent': accent,
            '--picker-accent-shadow': hexToRgba(accent, 0.25),
            '--picker-accent-hover': darken(accent, 5),
            '--picker-accent-light': hexToRgba(accent, 0.08),
            '--picker-accent-border': hexToRgba(accent, 0.2),
            '--picker-btn-primary-bg': accent,
            '--picker-btn-primary-hover': darken(accent, 8),
            '--picker-btn-primary-text': '#ffffff',
            '--picker-btn-primary-text-hover': '#ffffff',
            '--picker-btn-secondary-bg': hexToRgba(accent, 0.08),
            '--picker-btn-secondary-hover': hexToRgba(accent, 0.14),
            '--picker-btn-secondary-text': accent,
            '--picker-btn-secondary-text-hover': accent,
            
        } as React.CSSProperties;

        setStyle(style);

    }, [accentColor]);

    return {
        style,
    }
}

export default useAccentColor;