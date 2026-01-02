import { createRoot } from '@wordpress/element';
import React from 'react';
import Toaster from './Toaster';

// Initialize a single Toaster instance for all roots
const TOASTER_CONTAINER_ID = 'stachesepl-toaster-root';
let toasterRoot: ReturnType<typeof createRoot> | null = null;

const initToaster = () => {
    if (!toasterRoot) {
        let toasterContainer = document.getElementById(TOASTER_CONTAINER_ID);
        if (!toasterContainer) {
            toasterContainer = document.createElement('div');
            toasterContainer.id = TOASTER_CONTAINER_ID;
            document.body.appendChild(toasterContainer);
        }
        toasterRoot = createRoot(toasterContainer);
        toasterRoot.render(
            <React.StrictMode>
                <Toaster />
            </React.StrictMode>
        );
    }
};

export default initToaster;