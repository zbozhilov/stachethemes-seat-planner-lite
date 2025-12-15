export const __ = (text: string, ...args: any[]): string => {

    if (!window.stachesepl_i18n) {
        return text;
    }

    return window.stachesepl_i18n[text] || text;

};

export const sprintf = (format: string, ...args: any[]): string => {
    return format.replace(/%(\d+)\$d/g, (match, number) => {
        return typeof args[number - 1] !== 'undefined' ? args[number - 1] : match;
    }).replace(/%d/g, (match) => {
        return typeof args[0] !== 'undefined' ? args.shift() : match;
    });
};


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

const phpToMoment = (format: string): string => {
    const map: Record<string, string> = {
        // months
        'F': 'MMMM',
        'M': 'MMM',
        'm': 'MM',
        'n': 'M',

        // days
        'd': 'DD',
        'j': 'D',

        // years
        'Y': 'YYYY',
        'y': 'YY',

        // hours
        'H': 'HH',
        'G': 'H',
        'h': 'hh',
        'g': 'h',

        // minutes/seconds
        'i': 'mm',
        's': 'ss',

        // am/pm
        'A': 'A',
        'a': 'a'
    };

    return format.replace(/\\?([a-zA-Z])/g, (match, token) => {
        // keep escaped chars like \t or \.
        if (match.startsWith('\\')) return token;

        return map[token] || token;
    });
};


export const getFormattedDateTime = (dateTime: string): string => {

    const dateFormat = phpToMoment(window.stachesepl_date_format.date_format);
    const timeFormat = phpToMoment(window.stachesepl_date_format.time_format);

    if (typeof window.moment === 'undefined') {
        return dateTime;
    }

    return window.moment(dateTime).format(`${dateFormat} ${timeFormat}`);

}