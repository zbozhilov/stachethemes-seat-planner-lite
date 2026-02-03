import { createRoot } from '@wordpress/element';
import React from 'react';
import './index.scss';
import CustomFields from './components/CustomFields/CustomFields';
import { fieldsData } from './components/CustomFields/types';

const appInstance = document.getElementById('stachesepl-seat-planner-custom-fields') as HTMLDivElement;
const inputData = document.getElementById('stachesepl-seat-planner-custom-fields-data') as HTMLInputElement;
const fieldsDataValue: unknown = inputData.value ? JSON.parse(inputData.value) : [];

const initialFieldsData: fieldsData[] = Array.isArray(fieldsDataValue)
    ? fieldsDataValue as fieldsData[]
    : [];

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <CustomFields fieldsData={initialFieldsData} />
    </React.StrictMode>
);