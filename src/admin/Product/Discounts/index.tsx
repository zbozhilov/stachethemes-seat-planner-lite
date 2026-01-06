import { createRoot } from '@wordpress/element';
import React from 'react';
import Discounts from './components/Discounts/Discounts';
import Toaster from '../CommonUI/Toaster/Toaster';
import './index.scss';

const appInstance = document.getElementById('stachesepl-seat-planner-discounts') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Toaster />
        <Discounts />
    </React.StrictMode>
);