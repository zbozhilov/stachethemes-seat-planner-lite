import { createRoot } from '@wordpress/element';
import React from 'react';
import ReservedSeats from './components/ReservedSeats/ReservedSeats';
import './index.scss';
const appInstance = document.getElementById('stachesepl-seat-planner-reserved-seats') as HTMLDivElement;
const inputData = document.getElementById('stachesepl-seat-planner-reserved-seats-data') as HTMLInputElement;
const reservedSeatsData: Record<string, string[]> = JSON.parse(inputData.value);

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <ReservedSeats reservedSeatsData={reservedSeatsData} /> 
    </React.StrictMode>
);