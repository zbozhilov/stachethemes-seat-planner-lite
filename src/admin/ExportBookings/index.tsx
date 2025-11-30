import { createRoot } from '@wordpress/element';
import React from 'react';
import './index.scss';
import Form from './components/Form/Form';
import Toaster from './components/Toaster/Toaster';

const appInstance = document.getElementById('stachesepl-export-bookings') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Toaster />
        <Form />
    </React.StrictMode>
);