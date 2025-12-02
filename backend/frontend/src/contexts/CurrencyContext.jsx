import { createContext, useContext, useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchExchangeRates, convertPrice, formatPrice } from '../utils/currencyUtils';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const { currency: detectedCurrency, loading: geoLoading } = useGeolocation();
    const [currency, setCurrency] = useState('XOF');
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved currency preference
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        } else if (detectedCurrency && !geoLoading) {
            setCurrency(detectedCurrency);
        }
    }, [detectedCurrency, geoLoading]);

    useEffect(() => {
        loadExchangeRates();
    }, []);

    async function loadExchangeRates() {
        setLoading(true);
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
        setLoading(false);
    }

    function changeCurrency(newCurrency) {
        setCurrency(newCurrency);
        localStorage.setItem('selectedCurrency', newCurrency);
    }

    function convert(amountInXOF) {
        if (!exchangeRates || loading) {
            return amountInXOF;
        }
        return convertPrice(amountInXOF, currency, exchangeRates);
    }

    function format(amountInXOF) {
        const converted = convert(amountInXOF);
        return formatPrice(converted, currency);
    }

    const value = {
        currency,
        changeCurrency,
        convert,
        format,
        loading: loading || geoLoading,
        exchangeRates
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
}
