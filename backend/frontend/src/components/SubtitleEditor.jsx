// src/components/SubtitleEditor.jsx
import React, { useState, useEffect } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import Button from './ui/Button';

const SubtitleEditor = () => {
  const { selectedClip, updateSubtitleText } = useVideoStore(state => ({
    selectedClip: state.getSelectedClip(),
    updateSubtitleText: state.updateSubtitleText,
  }));
  
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (selectedClip) {
      // Convert the transcript object array to a simple string for the textarea
      const text = selectedClip.transcript.map(wordInfo => wordInfo.word).join(' ');
      setTranscript(text);
    }
  }, [selectedClip]);

  const handleTextChange = (e) => {
    setTranscript(e.target.value);
  };
  
  const handleSave = () => {
    // In a real app, you would parse the string back into a word-timed transcript object.
    // For this MVP, we'll just log the action to show it's working.
    console.log("Saving new transcript:", transcript);
    // Note: The store action is also simplified to just log.
    updateSubtitleText(selectedClip.id, transcript); 
    alert('Subtitles saved! (Check console for output)');
  };

  if (!selectedClip) {
    return (
      <aside className="w-full md:w-80 lg:w-96 bg-gray-800 p-4 flex items-center justify-center">
        <p className="text-gray-500">Select a clip to edit subtitles.</p>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-gray-800 p-4 flex flex-col">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Edit Subtitles</h2>
      <textarea
        value={transcript}
        onChange={handleTextChange}
        className="w-full flex-grow bg-gray-900 border border-gray-700 rounded-lg p-3 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <Button onClick={handleSave} className="mt-4 w-full">
        Save Subtitles
      </Button>
    </aside>
  );
};

export default SubtitleEditor;
