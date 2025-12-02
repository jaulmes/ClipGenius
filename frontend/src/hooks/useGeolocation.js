import { useState, useEffect } from 'react';

// Map country codes to currencies
const countryCurrencyMap = {
    // West Africa (FCFA)
    CM: 'XOF', // Cameroun
    SN: 'XOF', // Sénégal
    CI: 'XOF', // Côte d'Ivoire
    BJ: 'XOF', // Bénin
    BF: 'XOF', // Burkina Faso
    GW: 'XOF', // Guinée-Bissau
    ML: 'XOF', // Mali
    NE: 'XOF', // Niger
    TG: 'XOF', // Togo

    // Europe (EUR)
    FR: 'EUR', // France
    DE: 'EUR', // Germany
    BE: 'EUR', // Belgium
    ES: 'EUR', // Spain
    IT: 'EUR', // Italy
    NL: 'EUR', // Netherlands
    PT: 'EUR', // Portugal

    // USA
    US: 'USD',

    // UK
    GB: 'GBP',

    // Canada
    CA: 'CAD',
};

export function useGeolocation() {
    const [country, setCountry] = useState(null);
    const [currency, setCurrency] = useState('XOF'); // Default to FCFA
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        detectLocation();
    }, []);

    async function detectLocation() {
        try {
            // Check localStorage first
            const saved = localStorage.getItem('userCountry');
            if (saved) {
                setCountry(saved);
                setCurrency(countryCurrencyMap[saved] || 'XOF');
                setLoading(false);
                return;
            }

            // Try browser language as first guess
            const browserLang = navigator.language || navigator.userLanguage;
            const langCountry = browserLang.split('-')[1]?.toUpperCase();

            if (langCountry && countryCurrencyMap[langCountry]) {
                setCountry(langCountry);
                setCurrency(countryCurrencyMap[langCountry]);
                localStorage.setItem('userCountry', langCountry);
                setLoading(false);
                return;
            }

            // Fallback to IP-based geolocation
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.country_code) {
                setCountry(data.country_code);
                setCurrency(countryCurrencyMap[data.country_code] || 'XOF');
                localStorage.setItem('userCountry', data.country_code);
            }
        } catch (error) {
            console.error('Geolocation detection failed:', error);
            // Default to Cameroun/FCFA
            setCountry('CM');
            setCurrency('XOF');
        } finally {
            setLoading(false);
        }
    }

    return { country, currency, loading };
}
