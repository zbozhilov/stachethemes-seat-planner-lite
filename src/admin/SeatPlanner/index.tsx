import { createRoot } from '@wordpress/element';
import React from 'react';
import OpenEditorButton from './components/OpenEditorButton/OpenEditorButton';
import './index.scss';

const appInstance = document.getElementById('stachesepl--planner-editor') as HTMLDivElement;

const app = createRoot(appInstance);

app.render(
    <React.StrictMode>
        <OpenEditorButton />
    </React.StrictMode>
);