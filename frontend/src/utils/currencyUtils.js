// Currency conversion utilities with real-time exchange rates

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/XOF';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Currency symbols and formatting
export const currencyConfig = {
    XOF: {
        symbol: 'FCFA',
        name: 'Franc CFA',
        locale: 'fr-CM',
        position: 'after',
        flag: '🇨🇲'
    },
    EUR: {
        symbol: '€',
        name: 'Euro',
        locale: 'fr-FR',
        position: 'after',
        flag: '🇪🇺'
    },
    USD: {
        symbol: '$',
        name: 'US Dollar',
        locale: 'en-US',
        position: 'before',
        flag: '🇺🇸'
    },
    GBP: {
        symbol: '£',
        name: 'British Pound',
        locale: 'en-GB',
        position: 'before',
        flag: '🇬🇧'
    },
    CAD: {
        symbol: 'C$',
        name: 'Canadian Dollar',
        locale: 'en-CA',
        position: 'before',
        flag: '🇨🇦'
    }
};

// Fetch exchange rates from API
export async function fetchExchangeRates() {
    try {
        const cached = localStorage.getItem('exchangeRates');
        const cacheTime = localStorage.getItem('exchangeRatesTime');

        // Use cached rates if less than 1 hour old
        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION) {
            return JSON.parse(cached);
        }

        const response = await fetch(EXCHANGE_RATE_API);
        const data = await response.json();

        // Cache the rates
        localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
        localStorage.setItem('exchangeRatesTime', Date.now().toString());

        return data.rates;
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);

        // Fallback to cached rates even if expired
        const cached = localStorage.getItem('exchangeRates');
        if (cached) {
            return JSON.parse(cached);
        }

        // Ultimate fallback: approximate rates
        return {
            XOF: 1,
            EUR: 0.001526,
            USD: 0.001667,
            GBP: 0.001274,
            CAD: 0.002273
        };
    }
}

// Convert amount from XOF to target currency
export function convertPrice(amountInXOF, targetCurrency, rates) {
    if (targetCurrency === 'XOF') {
        return amountInXOF;
    }

    const rate = rates[targetCurrency];
    if (!rate) {
        console.warn(`No exchange rate for ${targetCurrency}, using XOF`);
        return amountInXOF;
    }

    return amountInXOF * rate;
}

// Format price with proper currency symbol and locale
export function formatPrice(amount, currency) {
    const config = currencyConfig[currency];
    if (!config) {
        return `${amount} ${currency}`;
    }

    // Round to 2 decimal places
    const rounded = Math.round(amount * 100) / 100;

    // Format with locale
    const formatted = new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: currency === 'XOF' ? 0 : 2,
        maximumFractionDigits: currency === 'XOF' ? 0 : 2,
    }).format(rounded);

    // Add currency symbol
    if (config.position === 'before') {
        return `${config.symbol}${formatted}`;
    } else {
        return `${formatted} ${config.symbol}`;
    }
}

// Get currency symbol
export function getCurrencySymbol(currency) {
    return currencyConfig[currency]?.symbol || currency;
}

// Get currency name
export function getCurrencyName(currency) {
    return currencyConfig[currency]?.name || currency;
}

// Get currency flag
export function getCurrencyFlag(currency) {
    return currencyConfig[currency]?.flag || '🌍';
}
