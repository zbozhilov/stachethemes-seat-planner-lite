import { createRoot } from '@wordpress/element';
import React from 'react';
import Discounts from './components/Discounts/Discounts';
import { discountData } from './components/Discounts/types';
import './index.scss';

const appInstance = document.getElementById('stachesepl-seat-planner-discounts') as HTMLDivElement;
const inputData = document.getElementById('stachesepl-seat-planner-discounts-data') as HTMLInputElement;
const discountsData: discountData[] | null = JSON.parse(inputData.value);

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <Discounts discountsData={discountsData ?? []} />
    </React.StrictMode>
);