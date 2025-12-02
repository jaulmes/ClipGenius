import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Features() {
    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Two Powerful Tools,
                        <span className="block bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                            Unlimited Possibilities
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto">
                        Everything you need to create engaging video content
                    </p>
                </div>

                {/* YouTube to Clips Features */}
                <div className="mb-24">
                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-12 mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-6xl">🎬</span>
                            <h2 className="text-4xl font-bold text-white">YouTube to Clips</h2>
                        </div>
                        <p className="text-xl text-gray-300 mb-8">
                            Transform long-form YouTube content into viral short-form clips automatically
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <ToolFeatureCard
                            icon="📥"
                            title="YouTube Download"
                            description="Paste any YouTube URL and download in optimized 1080p quality"
                            color="indigo"
                        />
                        <ToolFeatureCard
                            icon="🎤"
                            title="AI Transcription"
                            description="Powered by OpenAI Whisper for accurate word-level timestamps"
                            color="indigo"
                        />
                        <ToolFeatureCard
                            icon="🔍"
                            title="Viral Moment Detection"
                            description="AI identifies the most engaging segments automatically"
                            color="indigo"
                        />
                        <ToolFeatureCard
                            icon="✂️"
                            title="Smart Cropping"
                            description="Auto-crop to perfect 9:16 format (1080x1920) for mobile"
                            color="indigo"
                        />
                        <ToolFeatureCard
                            icon="🟡"
                            title="TikTok-Style Subtitles"
                            description="Bold yellow subtitles with thick outlines - viral style"
                            color="indigo"
                        />
                        <ToolFeatureCard
                            icon="📊"
                            title="Virality Score"
                            description="Each clip gets an engagement potential score"
                            color="indigo"
                        />
                    </div>
                </div>

                {/* Script to Video Features */}
                <div className="mb-24">
                    <div className="bg-gradient-to-r from-pink-600/20 to-orange-600/20 border border-pink-500/30 rounded-2xl p-12 mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-6xl">📝</span>
                            <h2 className="text-4xl font-bold text-white">Script to Video</h2>
                        </div>
                        <p className="text-xl text-gray-300 mb-8">
                            Turn any script into a professional video with AI-selected stock footage and voice-over
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <ToolFeatureCard
                            icon="🤖"
                            title="AI Scene Analysis"
                            description="Automatically breaks scripts into optimized scenes"
                            color="pink"
                        />
                        <ToolFeatureCard
                            icon="🎬"
                            title="Stock Footage"
                            description="AI selects perfect videos from Pexels and Pixabay"
                            color="pink"
                        />
                        <ToolFeatureCard
                            icon="🎙️"
                            title="Natural Voice-Over"
                            description="Professional text-to-speech in multiple languages"
                            color="pink"
                        />
                        <ToolFeatureCard
                            icon="📐"
                            title="Format Selection"
                            description="Choose 9:16 (TikTok/Reels) or 16:9 (YouTube)"
                            color="pink"
                        />
                        <ToolFeatureCard
                            icon="⚡"
                            title="Fast Generation"
                            description="Create videos in minutes with parallel processing"
                            color="pink"
                        />
                        <ToolFeatureCard
                            icon="🎨"
                            title="Professional Assembly"
                            description="Smooth transitions and timing optimization"
                            color="pink"
                        />
                    </div>
                </div>

                {/* Shared Features */}
                <div className="mb-24">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        Shared Capabilities
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <SharedFeatureCard
                            icon="🎯"
                            title="HD Quality"
                            description="1080p export with optimized encoding"
                        />
                        <SharedFeatureCard
                            icon="⚡"
                            title="Lightning Fast"
                            description="Parallel processing for maximum speed"
                        />
                        <SharedFeatureCard
                            icon="🎨"
                            title="Professional Output"
                            description="H.264 encoding, AAC audio, optimized for social"
                        />
                    </div>
                </div>

                {/* Technical Details */}
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-12 mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Technical Excellence</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-semibold text-indigo-400 mb-4 flex items-center gap-3">
                                <span>🎬</span> YouTube to Clips Tech
                            </h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    <span>OpenAI Whisper for transcription</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    <span>Custom viral moment detection algorithm</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    <span>FFmpeg with H.264 high profile</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    <span>Parallel clip generation (2x faster)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400">•</span>
                                    <span>Real-time progress tracking</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-pink-400 mb-4 flex items-center gap-3">
                                <span>📝</span> Script to Video Tech
                            </h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-pink-400">•</span>
                                    <span>GPT-powered scene parsing</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-pink-400">•</span>
                                    <span>Pexels & Pixabay API integration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-pink-400">•</span>
                                    <span>Google TTS with natural voices</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-pink-400">•</span>
                                    <span>Dynamic resolution (1080x1920 or 1920x1080)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-pink-400">•</span>
                                    <span>Intelligent video scene matching</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Dual CTA */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">YouTube to Clips</h3>
                        <p className="text-white/90 mb-6">
                            Extract viral moments from existing content
                        </p>
                        <Link to="/app"
                            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                            Start Extracting →
                        </Link>
                    </div>
                    <div className="bg-gradient-to-br from-pink-600 to-orange-600 rounded-2xl p-8 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">Script to Video</h3>
                        <p className="text-white/90 mb-6">
                            Create videos from scratch with your script
                        </p>
                        <Link to="/script-to-video"
                            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                            Start Creating →
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function ToolFeatureCard({ icon, title, description, color }) {
    const borderColors = {
        indigo: 'hover:border-indigo-500',
        pink: 'hover:border-pink-500'
    };

    return (
        <div className={`bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 ${borderColors[color]} transition group`}>
            <div className="text-5xl mb-4 group-hover:scale-110 transition">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}

function SharedFeatureCard({ icon, title, description }) {
    return (
        <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}
