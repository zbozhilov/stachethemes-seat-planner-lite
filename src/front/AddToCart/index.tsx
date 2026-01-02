import { createRoot } from '@wordpress/element';
import React from 'react';
import AddToCartProvider from './components/context/AddToCartProvider';
import LazySelectSeatButton from './components/SelectSeatsButton/LazySelectSeatsButton';
import './index.scss';
const buttonRoot = '.stachesepl-add-to-cart-button-root';

const roots = document.querySelectorAll(buttonRoot);

if (roots.length > 0) {

    for (const root of roots) {

        const productId = Number(root.getAttribute('data-product-id'))
        const hasDates = root.getAttribute('data-has-dates') === 'yes';
        const addToCartText = root.getAttribute('data-add-to-cart-text') as string;

        // Capture static HTML content for fallback before React takes over
        const fallbackHTML = root.innerHTML;

        const fallback = fallbackHTML ? (
            <div dangerouslySetInnerHTML={{ __html: fallbackHTML }} />
        ) : null;

        createRoot(root)
            .render(
                <React.StrictMode>
                    <AddToCartProvider productId={productId} hasDate={hasDates} addToCartDefaultText={addToCartText}>
                        <LazySelectSeatButton fallback={fallback ? fallback : ''} />
                    </AddToCartProvider>
                </React.StrictMode>
            );
    }

}