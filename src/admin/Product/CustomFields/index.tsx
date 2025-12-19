import { createRoot } from '@wordpress/element';
import React from 'react';
import './index.scss';
import CustomFields from './components/CustomFields/CustomFields';
import Toaster from '../CommonUI/Toaster/Toaster';
const appInstance = document.getElementById('stachesepl-seat-planner-custom-fields') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Toaster />
        <CustomFields />
    </React.StrictMode>
);