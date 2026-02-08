import { createRoot } from '@wordpress/element';
import React from 'react';
import AddToCartProvider from './components/context/AddToCartProvider';
import SelectSeatsButton from './components/SelectSeatsButton/SelectSeatsButton-compat';
import './index.scss';
const buttonRoot = '.stachesepl-add-to-cart-button-root';

const roots = document.querySelectorAll(buttonRoot);

if (roots.length > 0) {

    for (const root of roots) {

        const productId = Number(root.getAttribute('data-product-id'))
        const hasDates = root.getAttribute('data-has-dates') === 'yes';
        const date = root.getAttribute('data-date') as string;
        const addToCartText = root.getAttribute('data-add-to-cart-text') as string;

        createRoot(root)
            .render(
                <React.StrictMode>
                    <AddToCartProvider
                        productId={productId}
                        hasDate={hasDates}
                        initialDate={date}
                        addToCartDefaultText={addToCartText}
                    >
                        <SelectSeatsButton />
                    </AddToCartProvider>
                </React.StrictMode>
            );
    }

}

