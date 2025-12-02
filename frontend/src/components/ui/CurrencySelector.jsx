import { useState } from 'react';
import { getCurrencyFlag, getCurrencyName, currencyConfig } from '../../utils/currencyUtils';

export default function CurrencySelector({ currentCurrency, onCurrencyChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const currencies = Object.keys(currencyConfig);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition"
            >
                <span className="text-lg">{getCurrencyFlag(currentCurrency)}</span>
                <span className="text-white text-sm font-medium">{currentCurrency}</span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                        {currencies.map((curr) => (
                            <button
                                key={curr}
                                onClick={() => {
                                    onCurrencyChange(curr);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition ${curr === currentCurrency ? 'bg-indigo-600 hover:bg-indigo-700' : ''
                                    }`}
                            >
                                <span className="text-xl">{getCurrencyFlag(curr)}</span>
                                <div className="flex-1 text-left">
                                    <div className="text-white font-medium text-sm">{curr}</div>
                                    <div className="text-gray-400 text-xs">{getCurrencyName(curr)}</div>
                                </div>
                                {curr === currentCurrency && (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
