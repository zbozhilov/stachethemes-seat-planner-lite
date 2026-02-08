import { createRoot } from '@wordpress/element';
import React from 'react';
import './index.scss';
import Form from './components/Form/Form';
import Toaster from '../CommonUI/Toaster/Toaster';

const appInstance = document.getElementById('stachesepl-export-bookings') as HTMLDivElement;
const datesInput = document.getElementById('stachesepl-export-bookings-dates-data') as HTMLInputElement | null;
const datesData: string[] = datesInput?.value ? JSON.parse(datesInput.value) : [];

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Toaster />
        <Form datesData={datesData} />
    </React.StrictMode>
);