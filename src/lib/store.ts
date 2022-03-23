import { browser } from '$app/env'
import { writable } from "svelte/store";

export const theme = _theme();
export const charStyle = _charStyle();

function _theme() {
    const { subscribe, set } = writable('');

    return {
        subscribe,
        set: (theme)  => {
            if (!browser) return;
            const currentTheme = document.documentElement.classList.item(0);
            set(theme);
            document.documentElement.classList.replace(currentTheme, theme);
            localStorage.setItem('theme', theme);
        },
        init: () => {
            if (!browser) return;
            if (localStorage.theme === 'dark') {
                set('dark');
                document.documentElement.classList.add('dark');
            } else if (localStorage.theme === 'light') {
                set('light');
                document.documentElement.classList.add('light');
            } else if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                set('dark');
                document.documentElement.classList.add('dark');
            } else {
                set('light');
                document.documentElement.classList.add('dark');
            }
        },
    };
}

function _charStyle() {
    const { subscribe, set } = writable('');

    return {
        subscribe,
        set: (style) => {
            if (!browser) return;
            set(style);
            localStorage.setItem('hzmeta_charstyle', style);
        },
        init: () => {
            if (!browser) return;
            if (localStorage.hzmeta_charstyle === 'kai') {
                set('kai');
            } else if (localStorage.hzmeta_charstyle === 'serif') {
                set('serif');
            } else if (localStorage.hzmeta_charstyle === 'sans') {
                set('sans');
            } else {
                set('kai');
            }
        },
    };
}