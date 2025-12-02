import React from 'react';
import { useVideoStore } from '../store/useVideoStore';

const ProgressDisplay = () => {
    const progress = useVideoStore(state => state.processingProgress);
    const isLoading = useVideoStore(state => state.isLoading);

    if (!isLoading) return null;

    const getStepIcon = (step) => {
        switch (step) {
            case 'downloading': return '📥';
            case 'transcribing': return '🎤';
            case 'analyzing': return '🔍';
            case 'generating': return '✂️';
            case 'complete': return '✅';
            case 'error': return '❌';
            default: return '⏳';
        }
    };

    const getStepLabel = (step) => {
        switch (step) {
            case 'downloading': return 'Téléchargement';
            case 'transcribing': return 'Transcription';
            case 'analyzing': return 'Analyse';
            case 'generating': return 'Génération des clips';
            case 'complete': return 'Terminé';
            case 'error': return 'Erreur';
            default: return 'En attente';
        }
    };

    const getStepOrder = (step) => {
        const order = { downloading: 1, transcribing: 2, analyzing: 3, generating: 4, complete: 5 };
        return order[step] || 0;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">{getStepIcon(progress.step)}</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {getStepLabel(progress.step)}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">{progress.message}</p>
                </div>

                {/* Barre de progression */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progression</span>
                        <span className="font-mono">{progress.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out relative"
                            style={{ width: `${progress.percent}%` }}
                        >
                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Étapes */}
                <div className="space-y-3 bg-gray-900 p-4 rounded-lg">
                    {['downloading', 'transcribing', 'analyzing', 'generating'].map((step) => (
                        <div key={step} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${progress.step === step ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                                    getStepOrder(progress.step) > getStepOrder(step) ? 'bg-green-500' :
                                        'bg-gray-600'
                                }`}></div>
                            <span className={`text-sm transition-colors duration-300 ${progress.step === step ? 'text-white font-bold' :
                                    getStepOrder(progress.step) > getStepOrder(step) ? 'text-green-400' :
                                        'text-gray-500'
                                }`}>
                                {getStepLabel(step)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Message d'attente */}
                <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
                    <p className="flex items-center justify-center gap-1">
                        <span className="animate-spin">⏳</span> Temps estimé : 10-20 minutes
                    </p>
                    <p className="mt-1 text-gray-600">Ne fermez pas cette fenêtre pendant le traitement</p>
                </div>
            </div>
        </div>
    );
};

export default ProgressDisplay;
