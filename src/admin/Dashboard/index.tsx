import { createRoot } from '@wordpress/element';
import React from 'react';
import Toaster from './layout/Toaster/Toaster';
import AdminRouter from './router/AdminRouter';
import './index.scss';

const appInstance = document.getElementById('stachesepl-dashboard') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Toaster />
        <AdminRouter />
    </React.StrictMode>
);