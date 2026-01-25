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
    } = window.seat_planner_currency;

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
    } = window.seat_planner_currency;

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

export const formatDateWithPhpFormat = (date: Date, format: string): string => {
    const pad = (n: number): string => n.toString().padStart(2, '0');

    const monthsFull = [
        __('JANUARY'),
        __('FEBRUARY'),
        __('MARCH'),
        __('APRIL'),
        __('MAY'),
        __('JUNE'),
        __('JULY'),
        __('AUGUST'),
        __('SEPTEMBER'),
        __('OCTOBER'),
        __('NOVEMBER'),
        __('DECEMBER')
    ];

    const monthsShort = [
        __('JANUARY_SHORT'),
        __('FEBRUARY_SHORT'),
        __('MARCH_SHORT'),
        __('APRIL_SHORT'),
        __('MAY_SHORT'),
        __('JUNE_SHORT'),
        __('JULY_SHORT'),
        __('AUGUST_SHORT'),
        __('SEPTEMBER_SHORT'),
        __('OCTOBER_SHORT'),
        __('NOVEMBER_SHORT'),
        __('DECEMBER_SHORT')
    ];

    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;

    const tokens: Record<string, string> = {
        // months
        'F': monthsFull[date.getMonth()],
        'M': monthsShort[date.getMonth()],
        'm': pad(date.getMonth() + 1),
        'n': (date.getMonth() + 1).toString(),

        // days
        'd': pad(date.getDate()),
        'j': date.getDate().toString(),

        // years
        'Y': date.getFullYear().toString(),
        'y': date.getFullYear().toString().slice(-2),

        // hours
        'H': pad(hours24),
        'G': hours24.toString(),
        'h': pad(hours12),
        'g': hours12.toString(),

        // minutes/seconds
        'i': pad(date.getMinutes()),
        's': pad(date.getSeconds()),

        // am/pm
        'A': hours24 >= 12 ? 'PM' : 'AM',
        'a': hours24 >= 12 ? 'pm' : 'am'
    };

    return format.replace(/\\?([a-zA-Z])/g, (match, token) => {
        // keep escaped chars like \T or \.
        if (match.startsWith('\\')) return token;
        return tokens[token] ?? token;
    });
};

export const getFormattedDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return dateTime;

    const { date_format, time_format } = window.stachesepl_date_format;
    return `${formatDateWithPhpFormat(date, date_format)} ${formatDateWithPhpFormat(date, time_format)}`;
};

export const getFormatteDate = (date: string): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return formatDateWithPhpFormat(d, window.stachesepl_date_format.date_format);
};

export const getFormattedTime = (time: string): string => {
    const d = new Date(`1970-01-01T${time}`);

    if (isNaN(d.getTime())) return time;
    return formatDateWithPhpFormat(d, window.stachesepl_date_format.time_format);
};

export const hexToRgba = (hex: string, alpha: number) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const darken = (hex: string, percent: number) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amt);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amt);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amt);
    return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Checks if the current device supports touch input
 */
export const isTouchDevice = (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Useful if someone wants to increase the max rounded value for the Round component
export const MAX_ROUNDED_VALUE = typeof window.stacheseplMaxRoundedValue === 'number' ? window.stacheseplMaxRoundedValue : 100;

export const generateUniqueId = () => crypto.randomUUID();