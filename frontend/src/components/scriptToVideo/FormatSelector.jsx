import useScriptVideoStore from '../../store/useScriptVideoStore';

export default function FormatSelector() {
    const { format, setFormat } = useScriptVideoStore();

    const formats = [
        {
            id: '9:16',
            name: 'TikTok / Reels / Shorts',
            icon: '📱',
            description: 'Vertical (9:16)',
            aspect: 'portrait'
        },
        {
            id: '16:9',
            name: 'YouTube',
            icon: '🖥️',
            description: 'Horizontal (16:9)',
            aspect: 'landscape'
        }
    ];

    return (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">
                Choose Video Format
            </h2>
            <p className="text-gray-400 mb-6">
                Select the format for your video. This will determine which stock footage is used.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formats.map((f) => (
                    <div
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${format === f.id
                                ? 'border-indigo-500 bg-indigo-600/20'
                                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{f.icon}</span>
                                <div>
                                    <h3 className={`font-semibold text-lg ${format === f.id ? 'text-white' : 'text-gray-300'
                                        }`}>
                                        {f.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{f.description}</p>
                                </div>
                            </div>
                            {format === f.id && (
                                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                            )}
                        </div>

                        {/* Visual aspect ratio representation */}
                        <div className="flex justify-center">
                            <div
                                className={`border-2 border-gray-600 bg-gray-800 transition-all ${f.aspect === 'portrait' ? 'w-16 h-28' : 'w-32 h-18'
                                    }`}
                                style={{
                                    aspectRatio: f.id
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
