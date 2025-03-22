import { createRoot } from '@wordpress/element';
import './index.scss';
import Home from './components/pages/Home/Home';
import React from 'react';

const appInstance = document.getElementById('stachesepl-scanner') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>
);