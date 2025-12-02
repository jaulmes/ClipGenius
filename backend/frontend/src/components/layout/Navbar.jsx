import { Link } from 'react-router-dom';
import CurrencySelector from '../ui/CurrencySelector';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function Navbar() {
    const { currency, changeCurrency } = useCurrency();

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <span className="text-3xl">✂️</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            ClipGenius
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/features" className="text-gray-300 hover:text-white transition font-medium">
                            Features
                        </Link>
                        <Link to="/pricing" className="text-gray-300 hover:text-white transition font-medium">
                            Pricing
                        </Link>
                        <CurrencySelector
                            currentCurrency={currency}
                            onCurrencyChange={changeCurrency}
                        />
                        <Link to="/app"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-lg hover:shadow-indigo-500/50">
                            Launch App →
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
