import { useEffect, useState } from "react";
import { Brightness7, ModeNight } from '@mui/icons-material'
import { __ } from "@src/utils";

const ThemeSwitchButton = () => {

    // Initialize theme from localStorage or default to 'dark'
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        const savedTheme = localStorage.getItem('stachesepl-editor-theme');
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    });

    useEffect(() => {
        // Apply theme class to body
        if (theme === 'light') {
            document.body.classList.add('stachesepl-theme-light');
        } else {
            document.body.classList.remove('stachesepl-theme-light');
        }
    }, [theme]);

    const handleThemeSwitch = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        // Save the theme to the localStorage whenever it changes
        localStorage.setItem('stachesepl-editor-theme', theme);
    }, [theme]);

    const Icon = theme === 'light' ? ModeNight : Brightness7;

    return (
        <div className='stachesepl-top-button' title={__('TOGGLE_THEME')}>
            <Icon onClick={handleThemeSwitch} />
        </div>
    )
}

export default ThemeSwitchButton