// src/components/VideoEditor.jsx
import React from 'react';
import ClipSelector from './ClipSelector';
import SubtitleEditor from './SubtitleEditor';
import VideoPlayer from './VideoPlayer';
import Button from './ui/Button';
import { useVideoStore } from '../store/useVideoStore';

const VideoEditor = () => {
    const { title } = useVideoStore(state => ({
        title: state.getCurrentProject()?.title,
    }));

  const handleBackToDashboard = () => {
      // For this MVP, a simple page reload is the most robust way to "go back"
      // as it completely resets the application and store state.
      window.location.reload();
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-bold truncate">Editing: {title || 'Untitled Project'}</h1>
        <div>
          <Button onClick={handleBackToDashboard} className="mr-2 bg-gray-600 hover:bg-gray-700">
            Back
          </Button>
          <Button>Export Video</Button>
        </div>
      </header>
      
      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <ClipSelector />
        
        {/* Main Player */}
        <main className="flex-1 flex items-center justify-center p-2 md:p-4 overflow-auto">
          <VideoPlayer />
        </main>
        
        {/* Right Sidebar */}
        <SubtitleEditor />
      </div>
    </div>
  );
};
export default VideoEditor;
