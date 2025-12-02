import { useState, useRef } from 'react';
import useScriptVideoStore from '../../store/useScriptVideoStore';

export default function VideoEditor({ videoUrl, scenes, onStartOver }) {
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedScene, setSelectedScene] = useState(null);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const { replaceScene } = useScriptVideoStore();

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleSceneClick = (scene, index) => {
        setSelectedScene({ ...scene, index });
    };

    const handleReplaceScene = async (file) => {
        if (selectedScene) {
            await replaceScene(selectedScene.index, file);
        }
    };

    const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

    return (
        <div className="space-y-6">
            {/* Video Preview */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Video Preview</h2>

                <div className="bg-black rounded-lg overflow-hidden mb-4">
                    <video
                        key={videoUrl} // Force re-render when URL changes
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        crossOrigin="anonymous"
                        className="w-full"
                        onTimeUpdate={handleTimeUpdate}
                    />
                </div>

                {/* Debug / Download Link */}
                <div className="flex justify-between items-center bg-gray-700 p-3 rounded text-sm">
                    <span className="text-gray-300 truncate mr-4">{videoUrl}</span>
                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                    >
                        Open / Download
                    </a>
                </div>

                {/* Scrollable Timeline */}
                <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-semibold text-white">
                            Timeline ({scenes.length} scenes)
                        </div>
                        <div className="text-xs text-gray-500">
                            ← Scroll horizontally to navigate →
                        </div>
                    </div>

                    {/* Scrollable Container */}
                    <div className="overflow-x-auto overflow-y-hidden pb-2">
                        <div
                            className="relative h-20 bg-gray-800 rounded"
                            style={{ minWidth: `${Math.max(800, scenes.length * 120)}px` }}
                        >
                            {/* Playhead */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                                style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                            >
                                <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 -mt-1"></div>
                            </div>

                            {/* Scene blocks */}
                            {scenes.map((scene, idx) => {
                                const start = scenes.slice(0, idx).reduce((s, sc) => s + sc.duration, 0);
                                const width = (scene.duration / totalDuration) * 100;

                                return (
                                    <div
                                        key={scene.id || idx}
                                        className={`absolute top-2 bottom-2 border-2 rounded cursor-pointer transition ${selectedScene?.index === idx
                                            ? 'bg-indigo-600 border-indigo-400'
                                            : 'bg-gray-700 border-gray-600 hover:border-indigo-500'
                                            }`}
                                        style={{
                                            left: `${(start / totalDuration) * 100}%`,
                                            width: `${width}%`,
                                            minWidth: '100px' // Ensure scenes are always visible
                                        }}
                                        onClick={() => handleSceneClick(scene, idx)}
                                        title={`Scene ${idx + 1}: ${scene.description}`}
                                    >
                                        <div className="text-xs text-white p-1 truncate font-medium">
                                            Scene {idx + 1}
                                        </div>
                                        <div className="text-[10px] text-gray-300 px-1">
                                            {scene.duration}s
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(totalDuration)}</span>
                    </div>
                </div>
            </div>

            {/* Scene Editor */}
            {selectedScene && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Edit Scene {selectedScene.index + 1}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Scene Info</h4>
                            <div className="bg-gray-900 rounded p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Duration:</span>
                                    <span className="text-white">{selectedScene.duration}s</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Description:</span>
                                    <p className="text-white mt-1">{selectedScene.description}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Replace Scene</h4>
                            <div className="bg-gray-900 rounded p-4">
                                <p className="text-gray-400 text-sm mb-4">
                                    Upload your own video or image to replace this scene
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*,image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            handleReplaceScene(e.target.files[0]);
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                                >
                                    Upload Media
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center">
                <button
                    onClick={onStartOver}
                    className="text-gray-400 hover:text-white"
                >
                    ← Start Over
                </button>

                <div className="flex gap-4">
                    <a
                        href={videoUrl}
                        download
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Download Video
                    </a>
                </div>
            </div>
        </div>
    );
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
