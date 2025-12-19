import { createRoot } from '@wordpress/element';
import React from 'react';
import './index.scss';
import Form from './components/Form/Form';

const appInstance = document.getElementById('stachesepl-booking-integrity') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Form />
    </React.StrictMode>
);

