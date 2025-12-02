// src/components/VideoPlayer.jsx
import React, { useState, useRef } from 'react';
import { useVideoStore } from '../store/useVideoStore';

const VideoPlayer = () => {
  const selectedClip = useVideoStore(state => state.getSelectedClip());
  const videoRef = useRef(null);
  const [showReframeBox, setShowReframeBox] = useState(false);

  if (!selectedClip) {
    return (
      <div className="flex-grow flex items-center justify-center bg-black p-4">
        <p className="text-gray-500">Sélectionnez un clip pour le visualiser</p>
      </div>
    );
  }

  const handleDownload = () => {
    // Créer un lien temporaire pour télécharger la vidéo
    const link = document.createElement('a');
    link.href = `http://localhost:3001${selectedClip.videoUrl}`;
    link.download = `${selectedClip.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    const videoUrl = `http://localhost:3001${selectedClip.videoUrl}`;
    navigator.clipboard.writeText(videoUrl);
    alert('Lien copié dans le presse-papiers !');
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-[320px] aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
        {/* Vraie vidéo */}
        {selectedClip.videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            src={`http://localhost:3001${selectedClip.videoUrl}`}
            playsInline
          >
            Votre navigateur ne supporte pas la balise vidéo.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">Vidéo en cours de génération...</span>
          </div>
        )}

        {/* Reframe Box */}
        {showReframeBox && (
          <div className="absolute inset-0 border-2 border-dashed border-cyan-400 flex items-end justify-center pb-4 pointer-events-none">
            <span className="bg-cyan-400 text-black text-xs font-bold px-2 py-1 rounded">9:16 Format Vertical</span>
          </div>
        )}
      </div>

      {/* Informations du clip */}
      <div className="w-full max-w-[320px] mt-4 space-y-4">
        {/* Titre et score */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1">{selectedClip.title}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-400">Durée: {selectedClip.duration.toFixed(1)}s</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-yellow-400">Score: {selectedClip.virality_score}/100</span>
          </div>
        </div>

        {/* Boutons d'export */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger
          </button>

          <button
            onClick={handleCopyLink}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copier
          </button>
        </div>

        {/* Toggle Auto-Reframe */}
        <div className="text-center pt-2 border-t border-gray-700">
          <label className="flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={showReframeBox}
              onChange={() => setShowReframeBox(!showReframeBox)}
            />
            <div className={`w-10 h-5 rounded-full ${showReframeBox ? 'bg-indigo-600' : 'bg-gray-600'} relative transition-colors`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform ${showReframeBox ? 'transform translate-x-5' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-white">Afficher le cadre 9:16</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
