import { createRoot } from '@wordpress/element';
import React from 'react';
import './index.scss';
import ReservedSeats from './components/ReservedSeats/ReservedSeats';
const appInstance = document.getElementById('stachesepl-seat-planner-reserved-seats') as HTMLDivElement;
const inputData = document.getElementById('stachesepl-seat-planner-reserved-seats-data') as HTMLInputElement;
const reservedSeatsData: Record<string, string[]> = JSON.parse(inputData.value);

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <ReservedSeats reservedSeatsData={reservedSeatsData} /> 
    </React.StrictMode>
);