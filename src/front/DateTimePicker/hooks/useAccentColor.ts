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
        } as React.CSSProperties;

        setStyle(style);
   
    }, [accentColor]);

    return {
        style,
    }
}

export default useAccentColor;