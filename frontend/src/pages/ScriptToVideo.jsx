import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useScriptVideoStore from '../store/useScriptVideoStore';
import ScriptInput from '../components/scriptToVideo/ScriptInput';
import SceneList from '../components/scriptToVideo/SceneList';
import FormatSelector from '../components/scriptToVideo/FormatSelector';
import VideoEditor from '../components/scriptToVideo/VideoEditor';
import ProgressBar from '../components/scriptToVideo/ProgressBar';

export default function ScriptToVideo() {
    const navigate = useNavigate();
    const [step, setStep] = useState('input'); // 'input', 'scenes', 'format', 'generating', 'preview'

    const {
        script,
        parsedData,
        scenes,
        isLoading,
        videoUrl,
        parseScript,
        generateVideo,
        reset
    } = useScriptVideoStore();

    const handleScriptSubmit = async (scriptText) => {
        try {
            await parseScript(scriptText);
            setStep('scenes');
        } catch (error) {
            console.error('Parse error:', error);
        }
    };

    const handleScenesConfirmed = () => {
        setStep('format');
    };

    const handleGenerateVideo = async () => {
        setStep('generating');
        try {
            await generateVideo(scenes, parsedData?.title || 'My Video');
            setStep('preview');
        } catch (error) {
            console.error('Generation error:', error);
            setStep('format');
        }
    };

    const handleStartOver = () => {
        reset();
        setStep('input');
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Script to Video
                    </h1>
                    <p className="text-xl text-gray-400">
                        Transform your script into a professional video with AI-powered stock footage
                    </p>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <StepIndicator number={1} label="Paste Script" active={step === 'input'} completed={step !== 'input'} />
                    <div className="w-12 h-0.5 bg-gray-700"></div>
                    <StepIndicator number={2} label="Review Scenes" active={step === 'scenes'} completed={['format', 'generating', 'preview'].includes(step)} />
                    <div className="w-12 h-0.5 bg-gray-700"></div>
                    <StepIndicator number={3} label="Choose Format" active={step === 'format'} completed={['generating', 'preview'].includes(step)} />
                    <div className="w-12 h-0.5 bg-gray-700"></div>
                    <StepIndicator number={4} label="Generate" active={step === 'generating'} completed={step === 'preview'} />
                    <div className="w-12 h-0.5 bg-gray-700"></div>
                    <StepIndicator number={5} label="Edit & Export" active={step === 'preview'} completed={false} />
                </div>

                {/* Content based on step */}
                <div className="max-w-6xl mx-auto">
                    {step === 'input' && (
                        <ScriptInput
                            onSubmit={handleScriptSubmit}
                            isLoading={isLoading}
                        />
                    )}

                    {step === 'scenes' && (
                        <SceneList
                            scenes={scenes}
                            totalDuration={parsedData?.totalDuration}
                            onGenerate={handleScenesConfirmed}
                            onBack={() => setStep('input')}
                        />
                    )}

                    {step === 'format' && (
                        <div className="space-y-6">
                            <FormatSelector />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep('scenes')}
                                    className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition"
                                >
                                    ← Back to Scenes
                                </button>
                                <button
                                    onClick={handleGenerateVideo}
                                    className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                                >
                                    Generate Video →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && videoUrl && (
                        <VideoEditor
                            videoUrl={videoUrl}
                            scenes={scenes}
                            onStartOver={handleStartOver}
                        />
                    )}
                </div>
            </div>

            {/* Progress Bar Modal - Always rendered, shows/hides based on isLoading */}
            <ProgressBar />

            <Footer />
        </div>
    );
}

function StepIndicator({ number, label, active, completed }) {
    return (
        <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${completed ? 'bg-green-500 text-white' :
                active ? 'bg-indigo-600 text-white' :
                    'bg-gray-700 text-gray-400'
                }`}>
                {completed ? '✓' : number}
            </div>
            <span className={`text-sm ${active ? 'text-white font-semibold' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    );
}
