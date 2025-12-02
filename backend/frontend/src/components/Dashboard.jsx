// frontend/src/components/Dashboard.jsx
import React, { useRef, useState } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import Input from './ui/Input';
import Button from './ui/Button';
import ProjectItem from './ProjectItem';
import Card from './ui/Card';
import ProgressDisplay from './ProgressDisplay';

const Dashboard = () => {
  const urlRef = useRef(null);
  const [transcriptionMethod, setTranscriptionMethod] = useState('whisper'); // 'whisper' par défaut
  const { projects, isLoading, startNewProject } = useVideoStore(state => ({
    projects: state.projects,
    isLoading: state.isLoading,
    startNewProject: state.startNewProject,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = urlRef.current.value;
    if (url) {
      startNewProject(url, transcriptionMethod);
      // urlRef.current.value = ''; // On le garde pour le débogage
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <ProgressDisplay />

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">AI Video Clipper</h1>
        <p className="text-lg text-gray-400">Turn long YouTube videos into viral short clips.</p>
      </header>

      <Card className="mb-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <Input
              ref={urlRef}
              type="url"
              placeholder="Enter YouTube URL..."
              className="flex-grow"
              required
              disabled={isLoading}
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Clips'}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 text-gray-300">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="transcriptionMethod"
                value="whisper"
                checked={transcriptionMethod === 'whisper'}
                onChange={() => setTranscriptionMethod('whisper')}
                className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <span className="ml-2">Local (Whisper)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="transcriptionMethod"
                value="assemblyai"
                checked={transcriptionMethod === 'assemblyai'}
                onChange={() => setTranscriptionMethod('assemblyai')}
                className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <span className="ml-2">Cloud (AssemblyAI)</span>
            </label>
          </div>
        </form>
      </Card>

      {/* Copyright Warning */}
      <div className="mb-10 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Copyright Notice</h3>
            <p className="text-gray-300 mb-3">
              <strong>Important:</strong> Only use videos you own or have permission to use.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
              <p className="text-gray-300 text-sm mb-2">
                <span className="text-green-400 font-semibold">✓ Monetizable on:</span> TikTok, Instagram Reels, Facebook, Snapchat, and other platforms
              </p>
              <p className="text-gray-300 text-sm">
                <span className="text-red-400 font-semibold">✗ Not monetizable on:</span> YouTube (due to copyright restrictions)
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              💰 For YouTube monetization, use our <a href="/script-to-video" className="text-green-400 hover:underline font-semibold">Script to Video</a> tool with 100% royalty-free stock footage
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">My Projects</h2>
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectItem key={project.id} project={project} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            You have no projects yet. Paste a YouTube URL above to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
