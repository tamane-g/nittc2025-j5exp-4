import '../css/app.css';
import './bootstrap';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
// resolvePageComponentは使わないので削除してもOK
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme();

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// まず、全ての可能性のあるページコンポーネントを一度だけ読み込みます
const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    
    // カスタムリゾルブ関数を定義します
    resolve: (name) => {
        // まず.jsxを探し、なければ.tsxを探します
        const path = pages[`./Pages/${name}.jsx`] || pages[`./Pages/${name}.tsx`];

        if (!path) {
            // どちらも見つからなかった場合に、分かりやすいエラーをスローします
            throw new Error(`Page not found: ${name}. Searched for ./Pages/${name}.jsx and ./Pages/${name}.tsx`);
        }
        
        // 見つかったコンポーネントを返します
        return path();
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider theme={theme}>
                <App {...props} />
            </MantineProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
