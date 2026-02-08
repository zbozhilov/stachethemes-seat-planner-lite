import { createRoot } from '@wordpress/element';
import React from 'react';
import CustomFields from './components/CustomFields/CustomFields';
import Toaster from '../CommonUI/Toaster/Toaster';
import './index.scss';

const appInstance = document.getElementById('stachesepl-seat-planner-custom-fields') as HTMLDivElement;
const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Toaster />
        <CustomFields />
    </React.StrictMode>
);