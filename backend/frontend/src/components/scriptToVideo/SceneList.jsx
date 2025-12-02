export default function SceneList({ scenes, totalDuration, onGenerate, onBack }) {
    return (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Scenes Detected
                    </h2>
                    <p className="text-gray-400">
                        {scenes.length} scenes • Total duration: {totalDuration}s
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white"
                >
                    ← Edit Script
                </button>
            </div>

            {/* Scene Cards */}
            <div className="space-y-4 mb-8">
                {scenes.map((scene, idx) => (
                    <div
                        key={scene.id}
                        className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-indigo-500 transition"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    {idx + 1}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-white">
                                        Scene {idx + 1}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {scene.duration}s
                                    </span>
                                </div>

                                <p className="text-indigo-400 mb-2">
                                    🔍 {scene.description}
                                </p>

                                {scene.narration && (
                                    <p className="text-gray-400 text-sm italic">
                                        "{scene.narration}"
                                    </p>
                                )}

                                {scene.keywords && scene.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {scene.keywords.map((keyword, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Stock footage will be automatically selected for each scene
                </div>
                <button
                    onClick={onGenerate}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                    Generate Video →
                </button>
            </div>
        </div>
    );
}
