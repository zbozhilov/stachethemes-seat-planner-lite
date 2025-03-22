type Stachesepli18nItem = {
    [key: string]: string;
};

declare global {
    interface Window {
        stachesepli18n: Stachesepli18nItem;
    }
}

export const __ = (text: string): string => {

    if (!window.stachesepli18n) {
        return text;
    }

    return window.stachesepli18n[text] || text;

};

declare global {
    interface Window {
        stacheseplGetFormattedPrice: (price: number) => string;
    }
}


export const getFormattedPrice = (price: number): string => {

    const {
        currency_symbol,
        currency_format,
        currency_decimals,
        decimals_separator,
        thousand_separator,
    } = window.seat_planner_add_to_cart;

    // Round the price to the correct number of decimals
    const roundedPrice = Number(price.toFixed(currency_decimals));

    // Split the price into whole and fractional parts
    const [wholePart, fractionalPart = ''] = roundedPrice.toString().split('.');

    // Add thousand separators to the whole part
    let formattedWholePart = wholePart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        thousand_separator
    );

    // Combine the whole and fractional parts with the decimal separator
    const formattedPrice = fractionalPart
        ? `${formattedWholePart}${decimals_separator}${fractionalPart}`
        : `${formattedWholePart}${decimals_separator}${'0'.repeat(currency_decimals)}`;

    // Apply the currency format
    return currency_format
        .replace('%1$s', currency_symbol)
        .replace('%2$s', formattedPrice);
};

export const getPriceWithSymbol = (price: number): string => {

    const {
        currency_symbol,
        symbol_position
    } = window.seat_planner_add_to_cart;

    const decodeHtmlEntities = (text: string): string => {
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.documentElement.textContent || "";
    };

    const symbol = decodeHtmlEntities(currency_symbol);

    switch (symbol_position) {
        case 'left':
            return `${symbol}${price}`;
        case 'right':
            return `${price}${symbol}`;
        case 'left_space':
            return `${symbol} ${price}`;
        case 'right_space':
            return `${price} ${symbol}`;
        default:
            return price.toString();

    }

}
