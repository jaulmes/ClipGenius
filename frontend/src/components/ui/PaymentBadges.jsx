export default function PaymentBadges({ className = "" }) {
    return (
        <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
            {/* Orange Money */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition">
                <span className="text-2xl">📱</span>
                <span className="text-white font-bold text-sm">Orange Money</span>
            </div>

            {/* MTN Mobile Money */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition">
                <span className="text-2xl">📱</span>
                <span className="text-gray-900 font-bold text-sm">MTN Money</span>
            </div>

            {/* Card Payment */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition">
                <span className="text-2xl">💳</span>
                <span className="text-white font-bold text-sm">Visa / Mastercard</span>
            </div>

            {/* Secure Payment Badge */}
            <div className="bg-green-600 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span className="text-white font-bold text-sm">Paiement Sécurisé</span>
            </div>
        </div>
    );
}
