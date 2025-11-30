import { createRoot } from '@wordpress/element';
import React from 'react';
import AddToCartProvider from './components/context/AddToCartProvider';
import LazySelectSeatButton from './components/SelectSeatButton/LazySelectSeatButton';

document.addEventListener('click', (event: MouseEvent) => {

    let target = event.target as HTMLElement;

    // If case the user clicked on the span inside the anchor tag that is the button
    // ( block buttons use a span inside the anchor tag )
    if (target.tagName === 'SPAN' && target.parentElement) {

        target = target.parentElement;

        if (target.tagName !== 'A') {
            return;
        }
    }

    // Expect the target to have .product_type_auditorium and .add_to_cart_button classes
    // but not .st_select_seat_button_rendered

    const lookFor = ['product_type_auditorium', 'add_to_cart_button'];

    if (
        !lookFor.every(className => target.classList.contains(className)) ||
        target.classList.contains('st_select_seat_button_rendered')
    ) {
        return;
    }

    event.preventDefault();

    const productId = parseInt(target.getAttribute('data-product_id') || '', 10);

    if (isNaN(productId)) {
        console.error('Invalid product ID in', target);
        return;
    }

    const getButtonAttribs = () => {
        const Tag = target.tagName.toLowerCase();

        const getAllAttributes = (element: HTMLElement) => {
            const attributes = element.attributes;
            return Array.from(attributes).reduce((acc, attribute) => {
                let name = attribute.name === 'class' ? 'className' : attribute.name;

                if (name === 'style') {
                    // Convert the inline style string into an object mapping
                    acc[name] = attribute.value.split(';').reduce((styleAcc, styleProperty) => {
                        const [prop, value] = styleProperty.split(':');
                        if (prop && value) {
                            // Convert CSS property name to camelCase for JSX
                            const jsProp = prop.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                            styleAcc[jsProp] = value.trim();
                        }
                        return styleAcc;
                    }, {} as { [key: string]: string });
                } else {
                    acc[name] = attribute.value;
                }

                return acc;
            }, {} as { [key: string]: any });
        };

        const attributes = getAllAttributes(target);

        const children = target.innerHTML;

        return {
            Tag,
            attributes,
            children
        }

    }

    const getDateSelector = (): HTMLSelectElement | HTMLInputElement | null => {

        const dateSelector = target.closest('.stachesepl-product-actions')
            ?.querySelector('.stachesepl-date-selector-input');

        if (!dateSelector) {
            return null;
        }

        return dateSelector as HTMLSelectElement | HTMLInputElement;

    }

    const app = createRoot(target.parentElement as HTMLElement);

    app.render(
        <React.StrictMode>
            <AddToCartProvider productId={productId} dateSelector={getDateSelector()}>
                <LazySelectSeatButton buttonAttribs={getButtonAttribs()} />
            </AddToCartProvider>
        </React.StrictMode>
    );

}, true);
