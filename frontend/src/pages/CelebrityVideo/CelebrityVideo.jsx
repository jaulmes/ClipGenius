import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCelebrityStore from '../../store/useCelebrityStore';

export default function CelebrityVideo() {
    const navigate = useNavigate();
    const {
        script,
        setScript,
        analysis,
        analyzeScript,
        generateVideo,
        progress,
        videoUrl,
        loading,
        error,
        reset
    } = useCelebrityStore();

    const [step, setStep] = useState('input'); // input, preview, generating, done

    useEffect(() => {
        if (progress.step === 'complete' && videoUrl) {
            setStep('done');
        }
    }, [progress, videoUrl]);

    const handleAnalyze = async () => {
        await analyzeScript();
        if (!error) {
            setStep('preview');
        }
    };

    const handleGenerate = async () => {
        setStep('generating');
        await generateVideo('en-US');
    };

    const handleReset = () => {
        reset();
        setStep('input');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        ⭐ Celebrity Video Generator
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition backdrop-blur"
                    >
                        ← Accueil
                    </button>
                </div>

                {/* Step: Input */}
                {step === 'input' && (
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">📝 Collez votre script</h2>
                        <p className="text-gray-600 mb-4 text-sm">
                            Écrivez un script qui mentionne des artistes/célébrités que vous avez ajoutés via le backoffice.
                        </p>
                        <textarea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder={`Exemple:\n\nMichael Jackson was the king of pop. He revolutionized music with his incredible dance moves and unforgettable hits like Thriller and Billie Jean.\n\nHis legacy continues to inspire millions around the world...`}
                            className="w-full h-64 border-2 border-gray-300 rounded-lg p-4 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                ❌ {error}
                            </div>
                        )}
                        <button
                            onClick={handleAnalyze}
                            disabled={!script || loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 transition shadow-lg"
                        >
                            {loading ? '🔄 Analyse en cours...' : '🔍 Analyser le Script'}
                        </button>
                    </div>
                )}

                {/* Step: Preview */}
                {step === 'preview' && analysis && (
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">👀 Aperçu des Scènes</h2>

                        {/* Artistes détectés */}
                        <div className="mb-6">
                            <p className="font-bold text-gray-700 mb-2">Artistes détectés:</p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.artists?.map((artist, i) => (
                                    <span key={i} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                        ⭐ {artist}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Scènes */}
                        <div className="mb-6">
                            <p className="font-bold text-gray-700 mb-3">
                                {analysis.scenes?.length || 0} scènes détectées:
                            </p>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {analysis.scenes?.map((scene, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="font-bold text-gray-800">Scène {i + 1}</span>
                                            <span className="text-sm text-gray-600">{scene.duration}s</span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{scene.narration}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>👤 {scene.artist}</span>
                                            <span>•</span>
                                            <span>{scene.preferredMediaType === 'image' ? '📷 Image (Ken Burns)' : '🎥 Vidéo'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                ❌ {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleGenerate}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                            >
                                🎬 Générer la Vidéo
                            </button>
                            <button
                                onClick={() => setStep('input')}
                                className="px-8 bg-gray-300 py-3 rounded-lg hover:bg-gray-400 transition"
                            >
                                ← Retour
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Generating */}
                {step === 'generating' && (
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">⚙️ Génération en cours...</h2>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
                                    style={{ width: `${progress.percent}%` }}
                                >
                                    {progress.percent > 10 && `${progress.percent}%`}
                                </div>
                            </div>
                            <p className="text-center mt-3 text-gray-600 font-medium">{progress.message}</p>
                        </div>

                        {/* Loading Animation */}
                        <div className="flex justify-center mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                ❌ {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Step: Done */}
                {step === 'done' && videoUrl && (
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎉 Vidéo Générée avec Succès !</h2>

                        {/* Video Player */}
                        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                            <video
                                src={`http://localhost:3001${videoUrl}`}
                                controls
                                className="w-full"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <a
                                href={`http://localhost:3001${videoUrl}`}
                                download
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-3 rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg"
                            >
                                📥 Télécharger la Vidéo
                            </a>
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                            >
                                ➕ Créer une Nouvelle Vidéo
                            </button>
                        </div>
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-8 bg-white bg-opacity-10 backdrop-blur rounded-lg p-6 text-white">
                    <h3 className="font-bold mb-2">💡 Comment ça marche ?</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Écrivez un script mentionnant des artistes (ex: Michael Jackson)</li>
                        <li>L'IA analyse et découpe votre script en scènes</li>
                        <li>L'application choisit automatiquement les médias appropriés</li>
                        <li>Génère une vidéo avec voice-over et effet Ken Burns</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
