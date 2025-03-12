import { useEffect, useState } from "react";
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { __ } from "@src/utils";

const ThemeSwitchButton = () => {

    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {

        if (theme === 'light') {
            document.body.classList.add('stsp-theme-light');
        } else {
            document.body.classList.remove('stsp-theme-light');
        }

    }, [theme]);

    const handleThemeSwitch = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    const Icon = theme === 'light' ? Brightness4 : Brightness7;

    return (
        <div className='stsp-top-button' title={__('TOGGLE_THEME')}>
            <Icon onClick={handleThemeSwitch} />
        </div>
    )
}

export default ThemeSwitchButton