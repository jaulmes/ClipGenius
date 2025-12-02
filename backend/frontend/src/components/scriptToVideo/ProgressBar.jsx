import useScriptVideoStore from '../../store/useScriptVideoStore';

export default function ProgressBar() {
    const progress = useScriptVideoStore(state => state.progress);
    const loadingStep = useScriptVideoStore(state => state.loadingStep);
    const isLoading = useScriptVideoStore(state => state.isLoading);

    if (!isLoading) return null;

    const percent = progress?.percent || 0;
    const currentStep = progress?.step || 'init';
    const message = progress?.message || loadingStep || 'Initializing...';

    const getStepIcon = (step) => {
        switch (step) {
            case 'init': return '⏳';
            case 'parsing': return '📝';
            case 'tts': return '🎙️';
            case 'downloading': return '🎬';
            case 'assembling': return '🔧';
            case 'audio': return '🎵';
            case 'complete': return '✅';
            case 'error': return '❌';
            default: return '⏳';
        }
    };

    const getStepLabel = (step) => {
        switch (step) {
            case 'init': return 'Initialisation';
            case 'parsing': return 'Analyse du script';
            case 'tts': return 'Génération voix-off';
            case 'downloading': return 'Téléchargement vidéos';
            case 'assembling': return 'Assemblage';
            case 'audio': return 'Mixage audio';
            case 'complete': return 'Terminé';
            case 'error': return 'Erreur';
            default: return 'En attente';
        }
    };

    const getStepOrder = (step) => {
        const order = {
            init: 1,
            parsing: 2,
            tts: 3,
            downloading: 4,
            assembling: 5,
            audio: 6,
            complete: 7
        };
        return order[step] || 0;
    };

    const steps = ['init', 'parsing', 'tts', 'downloading', 'assembling', 'audio'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">
                        {getStepIcon(currentStep)}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {getStepLabel(currentStep)}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">{message}</p>
                </div>

                {/* Barre de progression */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progression</span>
                        <span className="font-mono">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out relative"
                            style={{ width: `${percent}%` }}
                        >
                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Étapes */}
                <div className="space-y-3 bg-gray-900 p-4 rounded-lg">
                    {steps.map((step) => (
                        <div key={step} className="flex items-center gap-3">
                            <div
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentStep === step
                                        ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                        : getStepOrder(currentStep) > getStepOrder(step)
                                            ? 'bg-green-500'
                                            : 'bg-gray-600'
                                    }`}
                            ></div>
                            <span
                                className={`text-sm transition-colors duration-300 ${currentStep === step
                                        ? 'text-white font-bold'
                                        : getStepOrder(currentStep) > getStepOrder(step)
                                            ? 'text-green-400'
                                            : 'text-gray-500'
                                    }`}
                            >
                                {getStepLabel(step)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Message d'attente */}
                <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
                    <p className="flex items-center justify-center gap-1">
                        <span className="animate-spin">⏳</span>
                        Temps estimé : 5-15 minutes
                    </p>
                    <p className="mt-1 text-gray-600">
                        Ne fermez pas cette fenêtre pendant le traitement
                    </p>
                </div>

                {/* Success Message */}
                {currentStep === 'complete' && (
                    <div className="mt-6 p-4 bg-green-600/20 border border-green-500 rounded-lg text-center">
                        <p className="text-green-400 font-medium">
                            🎬 Votre vidéo est prête !
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {currentStep === 'error' && (
                    <div className="mt-6 p-4 bg-red-600/20 border border-red-500 rounded-lg text-center">
                        <p className="text-red-400 font-medium">
                            Veuillez réessayer ou contacter le support
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
