import { createRoot } from '@wordpress/element';
import React from 'react';
import TabContainer from './components/TabContainer/TabContainer';
import './index.scss';

const appInstance = document.getElementById('stachesepl-seat-planner-editor') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <TabContainer />
    </React.StrictMode>
);