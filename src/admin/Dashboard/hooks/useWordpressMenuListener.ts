import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export const useWordpressMenuListener = () => {

    const { pathname } = useLocation();

    const updateActiveMenuItem = (route: string) => {

        const menuId = 'toplevel_page_stachesepl';
        const menu = document.getElementById(menuId)?.querySelector('.wp-submenu') as HTMLDivElement;

        const adminMenu = document.getElementById('adminmenu') as HTMLDivElement;
        adminMenu?.querySelectorAll('.current').forEach(item => item.classList.remove('current'));

        const item = menu.querySelector(`a[href*="#${route}"]`) as HTMLAnchorElement;
        const itemLi = item?.closest('li') as HTMLLIElement;

        if (itemLi) {
            itemLi.classList.add('current');
            item.classList.add('current');
        }
    };

    useEffect(() => {
        updateActiveMenuItem(pathname.replace('/', ''));
    }, [pathname]);

}