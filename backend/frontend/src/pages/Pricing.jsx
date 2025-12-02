import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PaymentBadges from '../components/ui/PaymentBadges';
import CurrencySelector from '../components/ui/CurrencySelector';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Pricing() {
    const { currency, changeCurrency, format, loading } = useCurrency();

    // Base prices in FCFA
    const basePrices = {
        free: 0,
        basic: 1500,
        pro: 7000,
        perClip: 100
    };

    const plans = [
        {
            name: "Gratuit",
            price: basePrices.free,
            period: currency === 'XOF' ? '/toujours' : '/forever',
            description: "Parfait pour découvrir ClipGenius",
            features: [
                "3 clips par mois",
                "Qualité 1080p",
                "Sous-titres style TikTok",
                "Transcription IA",
                "Support de base"
            ],
            cta: "Commencer Gratuitement",
            highlight: false,
            popular: false
        },
        {
            name: "Basique",
            price: basePrices.basic,
            period: currency === 'XOF' ? '/mois' : '/month',
            description: "Pour les créateurs réguliers",
            features: [
                "20 clips par mois",
                "Qualité 1080p HD",
                "Traitement prioritaire",
                "Sans filigrane",
                "Support par email",
                "Accès aux nouvelles fonctionnalités"
            ],
            cta: "Choisir Basique",
            highlight: false,
            popular: true
        },
        {
            name: "Pro",
            price: basePrices.pro,
            period: currency === 'XOF' ? '/mois' : '/month',
            description: "Pour les créateurs sérieux",
            features: [
                "100 clips par mois",
                "Qualité 4K (bientôt)",
                "Traitement ultra-rapide",
                "Fonctionnalités IA avancées",
                "Sans filigrane",
                "Branding personnalisé",
                "Support prioritaire 24/7",
                "Accès anticipé aux nouveautés"
            ],
            cta: "Devenir Pro",
            highlight: true,
            popular: false
        },
        {
            name: "Pay-per-use",
            price: basePrices.perClip,
            period: currency === 'XOF' ? '/clip' : '/clip',
            description: "Payez uniquement ce que vous utilisez",
            features: [
                "Aucun abonnement",
                "Paiement à l'usage",
                "Qualité 1080p",
                "Toutes les fonctionnalités de base",
                "Sans engagement",
                "Idéal pour tester"
            ],
            cta: "Acheter des Clips",
            highlight: false,
            popular: false
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Chargement des prix...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <CurrencySelector
                            currentCurrency={currency}
                            onCurrencyChange={changeCurrency}
                        />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Tarification Simple et Transparente
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mb-8">
                        Choisissez le forfait qui correspond à vos besoins
                    </p>
                    <PaymentBadges className="mb-4" />
                    <p className="text-sm text-gray-500 mt-4">
                        💳 Paiements sécurisés | 🇨🇲 Populaire au Cameroun
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
                    {plans.map((plan, idx) => (
                        <div key={idx}
                            className={`rounded-2xl p-6 ${plan.highlight
                                ? 'bg-gradient-to-b from-indigo-600 to-purple-600 transform lg:scale-105 shadow-2xl border-2 border-indigo-400'
                                : 'bg-gray-800 border-2 border-gray-700 hover:border-indigo-500'
                                } transition relative`}>

                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-bold">
                                        LE PLUS POPULAIRE
                                    </span>
                                </div>
                            )}

                            {plan.popular && !plan.highlight && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                                        POPULAIRE 🇨🇲
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mb-4 ${plan.highlight ? 'text-white/80' : 'text-gray-400'}`}>
                                    {plan.description}
                                </p>
                                <div className="flex items-baseline justify-center gap-1 flex-wrap">
                                    <span className="text-3xl md:text-4xl font-bold text-white">
                                        {plan.price === 0 ? '0' : format(plan.price).split(plan.period)[0]}
                                    </span>
                                    {plan.period && (
                                        <span className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6 min-h-[200px]">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-400 text-lg flex-shrink-0">✓</span>
                                        <span className={plan.highlight ? 'text-white' : 'text-gray-300'}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/app"
                                className={`block w-full py-3 rounded-xl font-bold text-center transition text-sm ${plan.highlight
                                    ? 'bg-white text-indigo-600 hover:bg-gray-100 shadow-lg'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Questions Fréquentes
                    </h2>
                    <div className="space-y-6">
                        <FAQ
                            question="Comment payer avec Orange Money ou MTN ?"
                            answer="Sélectionnez votre forfait et choisissez Orange Money ou MTN Mobile Money comme méthode de paiement. Vous recevrez un code de paiement à composer sur votre téléphone."
                        />
                        <FAQ
                            question="Puis-je changer de forfait à tout moment ?"
                            answer="Oui ! Vous pouvez changer de forfait à tout moment. Les modifications prennent effet immédiatement."
                        />
                        <FAQ
                            question="Que se passe-t-il si je dépasse ma limite de clips ?"
                            answer="Sur le forfait Gratuit, vous êtes limité à 3 clips par mois. Passez au forfait Basique ou Pro pour plus de clips, ou utilisez le Pay-per-use."
                        />
                        <FAQ
                            question="Offrez-vous des remboursements ?"
                            answer="Oui, nous offrons une garantie satisfait ou remboursé de 14 jours sur tous les forfaits payants."
                        />
                        <FAQ
                            question="Puis-je annuler mon abonnement ?"
                            answer="Absolument. Annulez à tout moment sans frais. Vous conserverez l'accès jusqu'à la fin de votre période de facturation."
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function FAQ({ question, answer }) {
    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
            <p className="text-gray-400">{answer}</p>
        </div>
    );
}
