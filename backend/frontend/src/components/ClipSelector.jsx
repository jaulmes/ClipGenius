// src/components/ClipSelector.jsx
import React from 'react';
import { useVideoStore } from '../store/useVideoStore';
import Card from './ui/Card';

const ClipSelector = () => {
  const { clips, selectedClipId, selectClip } = useVideoStore(state => ({
    clips: state.getCurrentProject()?.clips || [],
    selectedClipId: state.selectedClipId,
    selectClip: state.selectClip,
  }));

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-gray-800 p-4 space-y-4 overflow-y-auto">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2">Generated Clips</h2>
      {clips.map(clip => (
        <Card
          key={clip.id}
          onClick={() => selectClip(clip.id)}
          className={`cursor-pointer transition-all ${
            selectedClipId === clip.id 
              ? 'bg-indigo-900 border-indigo-500 ring-2 ring-indigo-500' 
              : 'hover:bg-gray-700'
          }`}
        >
          <h3 className="font-semibold truncate">{clip.title}</h3>
          <p className="text-sm text-gray-400">
            Virality Score: <span className="font-bold text-green-400">{clip.virality_score}</span>
          </p>
          <p className="text-sm text-gray-400">Duration: {clip.duration.toFixed(1)}s</p>
        </Card>
      ))}
    </aside>
  );
};

export default ClipSelector;
