import { useState, useEffect, useRef } from 'react';
import useScriptVideoStore from '../../store/useScriptVideoStore';

export default function VoiceSelector() {
    const { language, voiceId, setLanguage, setVoiceId } = useScriptVideoStore();
    const [voices, setVoices] = useState([]);
    const [isPlaying, setIsPlaying] = useState(null);
    const audioRef = useRef(null);

    // Fetch available voices when language changes
    useEffect(() => {
        fetch(`http://localhost:3001/api/script-to-video/voices?language=${language}`)
            .then(res => res.json())
            .then(data => {
                setVoices(data);
                // Set first voice as default if current voiceId not in list
                if (data.length > 0 && !data.find(v => v.id === voiceId)) {
                    setVoiceId(data[0].id);
                }
            })
            .catch(err => console.error('Failed to load voices:', err));
    }, [language, voiceId, setVoiceId]);

    const handlePreview = async (selectedVoiceId, e) => {
        e?.stopPropagation();

        if (isPlaying === selectedVoiceId) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setIsPlaying(null);
            return;
        }

        try {
            setIsPlaying(selectedVoiceId);
            const response = await fetch('http://localhost:3001/api/script-to-video/preview-voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language,
                    voiceId: selectedVoiceId
                })
            });

            if (!response.ok) throw new Error('Preview failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.pause();
            }

            audioRef.current = new Audio(url);
            audioRef.current.onended = () => {
                setIsPlaying(null);
                audioRef.current = null;
            };
            await audioRef.current.play();

        } catch (error) {
            console.error('Preview error:', error);
            setIsPlaying(null);
        }
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Language Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    Langue / Language
                </label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setLanguage('en-US')}
                        className={`flex-1 py-3 px-4 rounded-lg border transition ${language === 'en-US'
                                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                            }`}
                    >
                        🇺🇸 English
                    </button>
                    <button
                        type="button"
                        onClick={() => setLanguage('fr-FR')}
                        className={`flex-1 py-3 px-4 rounded-lg border transition ${language === 'fr-FR'
                                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                            }`}
                    >
                        🇫🇷 Français
                    </button>
                </div>
            </div>

            {/* Voice Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    Voix / Voice
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {voices.map((v) => (
                        <div
                            key={v.id}
                            onClick={() => setVoiceId(v.id)}
                            className={`relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${voiceId === v.id
                                    ? 'bg-indigo-600/20 border-indigo-500'
                                    : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <div className={`font-medium text-lg ${voiceId === v.id ? 'text-white' : 'text-gray-300'}`}>
                                {v.name}
                            </div>

                            <button
                                type="button"
                                onClick={(e) => handlePreview(v.id, e)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isPlaying === v.id
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {isPlaying === v.id ? '⏸' : '▶'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info notice */}
            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-300">
                ✅ <strong>100% Gratuit!</strong> Voix homme & femme via Microsoft Edge TTS.
                <br />
                ✅ <strong>100% Free!</strong> Male & female voices via Microsoft Edge TTS.
            </div>
        </div>
    );
}
