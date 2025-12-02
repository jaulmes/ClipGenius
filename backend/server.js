require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { downloadAndExtractAudio, downloadFullVideo, generateSubtitleFile, createVerticalClip } = require('./videoService');
const { transcribeWithAssemblyAI, transcribeWithWhisper } = require('./transcriptionService');
const { findPotentialClips } = require('./clipperService');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Servir les clips vidéo générés
const clipsDir = path.join(__dirname, 'clips');
if (!fs.existsSync(clipsDir)) {
  fs.mkdirSync(clipsDir);
  console.log('[Server] Clips directory created');
}
app.use('/clips', express.static(clipsDir));

// Servir les uploads d'artistes (Celebrity Video)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Servir les outputs de vidéos
const outputsDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

// Set proper MIME type for video files
app.use('/outputs', (req, res, next) => {
  if (req.path.endsWith('.mp4')) {
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
  }
  next();
});
app.use('/outputs', express.static(outputsDir));

// --- SSE Setup ---
const progressClients = new Map();
const processingStatus = new Map();

function sendProgress(sessionId, data) {
  const client = progressClients.get(sessionId);
  if (client) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
  processingStatus.set(sessionId, data);
}

app.get('/api/progress/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  progressClients.set(sessionId, res);

  const status = processingStatus.get(sessionId) || { step: 'waiting', percent: 0, message: 'En attente...' };
  res.write(`data: ${JSON.stringify(status)}\n\n`);

  req.on('close', () => {
    progressClients.delete(sessionId);
  });
});

// --- Main Processing ---

async function processVideoAsync(sessionId, youtubeUrl, transcriptionMethod) {
  try {
    console.log(`[Server] Starting async processing for session ${sessionId}`);

    // 1. Téléchargement
    sendProgress(sessionId, { step: 'downloading', percent: 0, message: 'Démarrage du téléchargement audio...' });

    // Téléchargement Audio
    const audioFilePath = await downloadAndExtractAudio(youtubeUrl);
    sendProgress(sessionId, { step: 'downloading', percent: 20, message: 'Audio téléchargé. Téléchargement vidéo...' });

    // Téléchargement Vidéo
    const videoFilePath = await downloadFullVideo(youtubeUrl);
    sendProgress(sessionId, { step: 'downloading', percent: 40, message: 'Téléchargements terminés.' });

    console.log(`[Server] Audio: ${audioFilePath}`);
    console.log(`[Server] Video: ${videoFilePath}`);

    // 2. Transcription
    sendProgress(sessionId, { step: 'transcribing', percent: 40, message: 'Transcription de l\'audio en cours...' });

    let transcriptionResult;
    if (transcriptionMethod === 'assemblyai') {
      transcriptionResult = await transcribeWithAssemblyAI(audioFilePath);
    } else {
      transcriptionResult = await transcribeWithWhisper(audioFilePath);
    }
    sendProgress(sessionId, { step: 'transcribing', percent: 60, message: 'Transcription terminée.' });
    console.log('[Server] Transcription complete.');

    // 3. Identification des Clips
    sendProgress(sessionId, { step: 'analyzing', percent: 60, message: 'Analyse du contenu et recherche de clips...' });
    const potentialClips = findPotentialClips(transcriptionResult);
    sendProgress(sessionId, { step: 'analyzing', percent: 70, message: `${potentialClips.length} clips potentiels identifiés.` });
    console.log(`[Server] Found ${potentialClips.length} potential clips.`);

    // 4. Génération des vidéos (OPTIMISÉ : parallèle + limitation)
    const generatedClips = [];
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Limiter à 3 clips max pour optimiser le temps
    const MAX_CLIPS = 3;
    const CONCURRENT_CLIPS = 2; // Générer 2 clips en parallèle
    const limitedClips = potentialClips.slice(0, MAX_CLIPS);

    console.log(`[Server] Generating ${limitedClips.length} clips (parallel processing)...`);

    // Traitement par batch de 2 clips
    for (let i = 0; i < limitedClips.length; i += CONCURRENT_CLIPS) {
      const batch = limitedClips.slice(i, i + CONCURRENT_CLIPS);

      // Générer les clips du batch en parallèle
      await Promise.all(batch.map(async (clip, batchIdx) => {
        const clipIdx = i + batchIdx;
        const currentPercent = 70 + Math.floor((clipIdx / limitedClips.length) * 30);

        sendProgress(sessionId, {
          step: 'generating',
          percent: currentPercent,
          message: `Génération parallèle - Clip ${clipIdx + 1}/${limitedClips.length} : "${clip.title}"`
        });

        console.log(`[Server] Processing clip ${clipIdx + 1}/${limitedClips.length} (parallel)...`);

        const clipWords = transcriptionResult.words.filter(word =>
          (word.start >= clip.startTime * 1000) && (word.end <= clip.endTime * 1000)
        ).map(word => ({
          text: word.text,
          start: word.start - (clip.startTime * 1000),
          end: word.end - (clip.startTime * 1000)
        }));

        // Utiliser un ID unique pour éviter les conflits
        const srtPath = path.join(tempDir, `clip_${sessionId}_${clipIdx + 1}.srt`);
        const subtitlePath = generateSubtitleFile(clipWords, srtPath); // Retourne .ass

        const clipPath = path.join(clipsDir, `clip_${sessionId}_${clipIdx + 1}.mp4`);

        if (!fs.existsSync(clipPath)) {
          await createVerticalClip(videoFilePath, clip, subtitlePath, clipPath);
        }

        generatedClips.push({
          id: `clip_${sessionId}_${clipIdx + 1}`,
          title: clip.title,
          virality_score: clip.virality_score,
          duration: clip.duration,
          videoUrl: `/clips/clip_${sessionId}_${clipIdx + 1}.mp4`,
          transcript: clipWords.map(w => ({
            word: w.text,
            startTime: w.start / 1000,
            endTime: w.end / 1000
          }))
        });
      }));
    }

    console.log(`[Server] Video processing complete!`);

    sendProgress(sessionId, {
      step: 'complete',
      percent: 100,
      message: 'Traitement terminé avec succès !',
      clips: generatedClips,
      sourceUrl: youtubeUrl,
      title: 'Processed Video'
    });

  } catch (error) {
    console.error('[Server] Error:', error);
    sendProgress(sessionId, {
      step: 'error',
      percent: 0,
      message: `Erreur: ${error.message}`
    });
  } finally {
    // Cleanup session after delay
    setTimeout(() => {
      progressClients.delete(sessionId);
      processingStatus.delete(sessionId);
    }, 60000); // 1 minute retention
  }
}

app.post('/api/process-video', async (req, res) => {
  const { youtubeUrl, transcriptionMethod } = req.body;

  if (!youtubeUrl || !transcriptionMethod) {
    return res.status(400).json({ error: 'youtubeUrl and transcriptionMethod are required.' });
  }

  const sessionId = Date.now().toString();

  // Respond immediately
  res.status(200).json({
    message: 'Processing started',
    sessionId: sessionId
  });

  // Start async processing
  processVideoAsync(sessionId, youtubeUrl, transcriptionMethod);
});

// ============================================
// SCRIPT TO VIDEO ROUTES
// ============================================
const scriptToVideoRoutes = require('./routes/scriptToVideo');
app.use('/api/script-to-video', scriptToVideoRoutes);

// ============================================
// CELEBRITY VIDEO ROUTES
// ============================================
const adminRoutes = require('./routes/admin');
const celebrityVideoRoutes = require('./routes/celebrityVideo');
app.use('/api/admin', adminRoutes);
app.use('/api/celebrity-video', celebrityVideoRoutes);

// Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);

  // Keep process alive explicitly
  setInterval(() => {
    // Heartbeat
  }, 10000);
});
