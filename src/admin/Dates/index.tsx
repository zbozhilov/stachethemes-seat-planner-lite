import { createRoot } from '@wordpress/element';
import React from 'react';
import Dates from './components/Dates/Dates';
import { dateData } from './components/Dates/types';
import './index.scss';
import Toaster from './components/Toaster/Toaster';

const appInstance = document.getElementById('stachesepl-seat-planner-dates') as HTMLDivElement;
const inputData = document.getElementById('stachesepl-seat-planner-dates-data') as HTMLInputElement;
const datesData: dateData[] = JSON.parse(inputData.value);

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Toaster />
        <Dates datesData={datesData} />
    </React.StrictMode>
);