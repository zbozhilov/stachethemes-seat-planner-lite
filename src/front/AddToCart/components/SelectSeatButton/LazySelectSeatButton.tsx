import React, { lazy, Suspense } from 'react';

const SelectSeatButton = lazy(() => import(/* webpackChunkName: "front/add_to_cart/chunks/lazy.select-seat-button" */ './SelectSeatButton'));

const LazySelectSeatButton = (props: {
    buttonAttribs: {
        Tag: string;
        attributes: { [key: string]: string };
        children: string;
    };
}) => {

    const ButtonComponent = () => {

        const { Tag, attributes, children } = props.buttonAttribs;

        return (
            React.createElement(Tag, {
                ...attributes,
                className: `${attributes.className || ''} loading st_select_seat_button_rendered`.trim(),
                onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                 },
                 dangerouslySetInnerHTML: { __html: children }
            })
        )
    }

    return (
        <Suspense fallback={<ButtonComponent />}>
            <SelectSeatButton buttonAttribs={props.buttonAttribs} />
        </Suspense>
    )
}

export default LazySelectSeatButton