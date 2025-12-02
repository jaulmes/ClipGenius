import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PaymentBadges from '../components/ui/PaymentBadges';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Landing() {
    const { currency, format } = useCurrency();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <Navbar />

            {/* Hero Section - Dual Features */}
            <section className="container mx-auto px-6 py-20 md:py-32">
                <div className="text-center max-w-6xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Create Viral Videos
                        <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                            Two Powerful Ways
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                        Transform content into viral clips or turn scripts into professional videos with AI
                    </p>
                </div>

                {/* Two Feature Cards Side by Side */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                    {/* YouTube to Clips */}
                    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500/50 rounded-2xl p-8 hover:border-indigo-400 transition group relative">
                        <div className="text-6xl mb-4">🎬</div>
                        <h2 className="text-3xl font-bold text-white mb-4">YouTube to Clips</h2>
                        <p className="text-gray-300 mb-6 text-lg">
                            Turn long YouTube videos into viral TikTok/Reels clips automatically
                        </p>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">AI finds viral moments automatically</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">Perfect 9:16 format for mobile</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">TikTok-style yellow subtitles</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">Virality score for each clip</span>
                            </li>
                        </ul>

                        {/* Copyright Warning */}
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                            <p className="text-yellow-300 text-sm flex items-start gap-2">
                                <span className="text-lg">⚠️</span>
                                <span><strong>Note:</strong> Use only your own videos or with permission. Clips can be monetized on TikTok, Instagram Reels, and other platforms, but may not be monetizable on YouTube due to copyright restrictions.</span>
                            </p>
                        </div>

                        <Link to="/app"
                            className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition transform hover:scale-105">
                            Start Creating Clips →
                        </Link>
                    </div>

                    {/* Script to Video */}
                    <div className="bg-gradient-to-br from-pink-600/20 to-orange-600/20 border-2 border-pink-500/50 rounded-2xl p-8 hover:border-pink-400 transition group relative">
                        {/* Monetizable Badge */}
                        <div className="absolute -top-3 -right-3 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                            <span>💰</span> Monetizable
                        </div>
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-3xl font-bold text-white mb-4">Script to Video</h2>
                        <p className="text-gray-300 mb-6 text-lg">
                            Transform any script into professional videos with AI-selected footage
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">AI selects perfect stock footage</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">Natural voice-over generation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">9:16 or 16:9 format support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">Professional scene analysis</span>
                            </li>
                        </ul>
                        <Link to="/script-to-video"
                            className="block w-full text-center bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition transform hover:scale-105">
                            Créer depuis un Script →
                        </Link>
                    </div>

                    {/* Celebrity Video */}
                    <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-2 border-yellow-500/50 rounded-2xl p-8 hover:border-yellow-400 transition group relative md:col-span-2">
                        <div className="text-6xl mb-4">⭐</div>
                        <h2 className="text-3xl font-bold text-white mb-4">Celebrity Video</h2>
                        <p className="text-gray-300 mb-6 text-lg">
                            Create professional videos from scripts using your own celebrity media
                        </p>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">Upload & manage celebrity photos/videos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">AI matches media to your script</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">Ken Burns effect on images</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">✓</span>
                                <span className="text-gray-300">Voice-over synchronized automatically</span>
                            </li>
                        </ul>
                        <Link to="/celebrity-video"
                            className="block w-full text-center bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition transform hover:scale-105">
                            Create Celebrity Video →
                        </Link>
                    </div>
                </div>

                {/* Pricing Preview */}
                <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
                        💰 Tarifs Accessibles - Paiement Mobile Money
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                        <div>
                            <div className="text-white text-sm mb-1">Gratuit</div>
                            <div className="text-2xl font-bold text-green-400">0 FCFA</div>
                            <div className="text-xs text-gray-400">3 clips/mois</div>
                        </div>
                        <div>
                            <div className="text-white text-sm mb-1">Basique</div>
                            <div className="text-2xl font-bold text-yellow-400">1 500 FCFA</div>
                            <div className="text-xs text-gray-400">20 clips/mois</div>
                        </div>
                        <div>
                            <div className="text-white text-sm mb-1">Pro</div>
                            <div className="text-2xl font-bold text-indigo-400">7 000 FCFA</div>
                            <div className="text-xs text-gray-400">100 clips/mois</div>
                        </div>
                        <div>
                            <div className="text-white text-sm mb-1">À l'usage</div>
                            <div className="text-2xl font-bold text-pink-400">100 FCFA</div>
                            <div className="text-xs text-gray-400">par clip</div>
                        </div>
                    </div>
                    <PaymentBadges className="mb-4" />
                    <div className="text-center mt-6">
                        <Link to="/pricing" className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                            Voir Tous les Forfaits →
                        </Link>
                    </div>
                </div>
            </section>

            {/* All Features Combined */}
            <section className="container mx-auto px-6 py-20 bg-gray-800/30">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                    Powerful Features for Both Tools
                </h2>
                <p className="text-xl text-gray-400 text-center mb-16">
                    Everything you need to create engaging content
                </p>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard
                        icon="🤖"
                        title="AI-Powered"
                        description="Advanced AI for content analysis, moment detection, and footage selection"
                    />
                    <FeatureCard
                        icon="📱"
                        title="Multi-Format Support"
                        description="Create videos in 9:16 (TikTok/Reels) or 16:9 (YouTube) format"
                    />
                    <FeatureCard
                        icon="🎙️"
                        title="Voice Generation"
                        description="Natural text-to-speech in multiple languages and voices"
                    />
                    <FeatureCard
                        icon="⚡"
                        title="Lightning Fast"
                        description="Process videos and generate clips in minutes with parallel processing"
                    />
                    <FeatureCard
                        icon="🎯"
                        title="High Quality"
                        description="1080p HD export with professional encoding and optimization"
                    />
                    <FeatureCard
                        icon="🎬"
                        title="Smart Editing"
                        description="Automatic scene detection, transitions, and professional assembly"
                    />
                </div>
            </section>

            {/* How Each Tool Works */}
            <section className="container mx-auto px-6 py-20">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                    How It Works
                </h2>

                <div className="max-w-6xl mx-auto space-y-16">
                    {/* YouTube to Clips Process */}
                    <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8">
                        <h3 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center gap-3">
                            <span>🎬</span> YouTube to Clips
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <ProcessStep
                                number="1"
                                title="Paste URL"
                                description="Copy any YouTube link"
                                color="indigo"
                            />
                            <ProcessStep
                                number="2"
                                title="AI Analyzes"
                                description="Finds viral moments"
                                color="indigo"
                            />
                            <ProcessStep
                                number="3"
                                title="Get Clips"
                                description="Download ready clips"
                                color="indigo"
                            />
                        </div>
                    </div>

                    {/* Script to Video Process */}
                    <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8">
                        <h3 className="text-3xl font-bold text-pink-400 mb-8 flex items-center gap-3">
                            <span>📝</span> Script to Video
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <ProcessStep
                                number="1"
                                title="Write Script"
                                description="Paste your content"
                                color="pink"
                            />
                            <ProcessStep
                                number="2"
                                title="AI Creates"
                                description="Selects footage + voice"
                                color="pink"
                            />
                            <ProcessStep
                                number="3"
                                title="Export Video"
                                description="Professional video ready"
                                color="pink"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-12 text-center">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-5xl font-bold text-white mb-2">20K+</div>
                            <div className="text-gray-400">Vidéos Créées</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white mb-2">75K+</div>
                            <div className="text-gray-400">Clips Générés</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white mb-2">5M+</div>
                            <div className="text-gray-400">Vues Totales</div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-indigo-500/30">
                        <p className="text-white/80 mb-4">🇨🇲 Populaire au Cameroun et en Afrique</p>
                        <PaymentBadges />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 md:p-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Ready to Create Viral Content?
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 mb-8">
                        Choose your preferred method and start creating today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/app"
                            className="inline-block bg-white text-indigo-600 px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl">
                            YouTube to Clips
                        </Link>
                        <Link to="/script-to-video"
                            className="inline-block bg-pink-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-pink-700 transition transform hover:scale-105 shadow-2xl">
                            Script to Video
                        </Link>
                    </div>
                </div>
            </section>

            <AdminLink />
            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-xl border border-gray-700 hover:border-indigo-500 transition group hover:transform hover:scale-105">
            <div className="text-6xl mb-4 group-hover:scale-110 transition">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}

function ProcessStep({ number, title, description, color }) {
    const colorClasses = {
        indigo: 'from-indigo-600 to-purple-600',
        pink: 'from-pink-600 to-orange-600'
    };

    return (
        <div className="text-center">
            <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${colorClasses[color]} rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg`}>
                {number}
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

function AdminLink() {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Link
                to="/admin"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg shadow-lg transition text-sm"
            >
                🔐 Admin Panel
            </Link>
        </div>
    );
}
