import { useEffect, useState } from "react";
import { Brightness7, ModeNight } from '@mui/icons-material'
import { __ } from "@src/utils";

const ThemeSwitchButton = () => {

    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {

        if (theme === 'light') {
            document.body.classList.add('stachesepl-theme-light');
        } else {
            document.body.classList.remove('stachesepl-theme-light');
        }

    }, [theme]);

    const handleThemeSwitch = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    const Icon = theme === 'light' ? ModeNight : Brightness7;

    return (
        <div className='stachesepl-top-button' title={__('TOGGLE_THEME')}>
            <Icon onClick={handleThemeSwitch} />
        </div>
    )
}

export default ThemeSwitchButton