const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { parseScript, validateScenes } = require('../services/scriptParser');
const pexelsService = require('../services/pexelsService');
const pixabayService = require('../services/pixabayService');
const videoAssembler = require('../services/videoAssembler');
const ttsService = require('../services/ttsService');

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Store for ongoing processes and sessions
const sessions = new Map();
const progressClients = new Map();

function sendProgress(sessionId, data) {
    const client = progressClients.get(sessionId);
    if (client) {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
    if (sessions.has(sessionId)) {
        sessions.get(sessionId).progress = data;
    }
}

router.post('/parse', async (req, res) => {
    try {
        const { script } = req.body;
        if (!script || script.trim().length === 0) {
            return res.status(400).json({ error: 'Script is required' });
        }
        console.log(`[API] Parsing script (${script.length} chars)...`);
        const parsed = await parseScript(script);
        const validated = validateScenes(parsed);
        res.json(validated);
    } catch (error) {
        console.error('[API] Parse error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/voices', (req, res) => {
    try {
        const { language = 'en-US' } = req.query;
        const voices = ttsService.getVoices(language);
        res.json(voices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/preview-voice', async (req, res) => {
    try {
        const { language, voiceId } = req.body;
        if (!language || !voiceId) {
            return res.status(400).json({ error: 'Language and voiceId required' });
        }

        const audioPath = await ttsService.previewVoice(language, voiceId);
        res.sendFile(audioPath);
    } catch (error) {
        console.error('[API] Preview error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/generate', async (req, res) => {
    const { scenes, title, language, voiceId, format } = req.body;
    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
        return res.status(400).json({ error: 'Scenes required' });
    }

    const sessionId = Date.now().toString();
    sessions.set(sessionId, {
        scenes,
        title: title || 'Untitled Video',
        status: 'processing',
        progress: { step: 'init', percent: 0 }
    });

    // Pass language, voiceId, and format to the async generator
    generateVideoAsync(sessionId, scenes, { title, language, voiceId, format });
    res.json({ sessionId });
});

router.get('/progress/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    progressClients.set(sessionId, res);
    const session = sessions.get(sessionId);
    if (session) {
        sendProgress(sessionId, session.progress);
    }
    req.on('close', () => {
        progressClients.delete(sessionId);
    });
});

router.post('/replace-scene', upload.single('file'), async (req, res) => {
    try {
        const { sessionId, sceneIndex } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'File required' });

        const session = sessions.get(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        console.log(`[API] Replacing scene ${sceneIndex} for session ${sessionId}`);

        const outputPath = path.join(__dirname, '../outputs', `video_${sessionId}_updated.mp4`);
        await videoAssembler.replaceScene(
            session.scenePaths,
            parseInt(sceneIndex),
            file.path,
            outputPath
        );

        session.videoUrl = `/outputs/video_${sessionId}_updated.mp4`;
        res.json({ success: true, videoUrl: session.videoUrl });
    } catch (error) {
        console.error('[API] Replace scene error:', error);
        res.status(500).json({ error: error.message });
    }
});

async function generateVideoAsync(sessionId, scenes, options = {}) {
    const tempDir = path.join(__dirname, '../temp');
    const outputsDir = path.join(__dirname, '../outputs');
    [tempDir, outputsDir].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    try {
        // STEP 1: Initialization (0-5%)
        sendProgress(sessionId, {
            step: 'init',
            percent: 2,
            message: '🚀 Initializing video generation pipeline...'
        });

        // STEP 2: Parsing Script (5-15%)
        sendProgress(sessionId, {
            step: 'parsing',
            percent: 10,
            message: `📝 Analyzing script: ${scenes.length} scenes detected`
        });

        // STEP 3: TTS - Generate Voice-Over (15-25%)
        sendProgress(sessionId, {
            step: 'tts',
            percent: 16,
            message: '🎙️ Creating continuous voice-over narration...'
        });

        // Pass language and voiceId options
        const narrationPath = await ttsService.generateContinuousNarration(scenes, sessionId, {
            language: options.language,
            voiceId: options.voiceId
        });

        sendProgress(sessionId, {
            step: 'tts',
            percent: 24,
            message: '✅ Voice-over generated successfully!'
        });

        // STEP 4: Downloading Stock Footage (25-70%)
        sendProgress(sessionId, {
            step: 'downloading',
            percent: 26,
            message: '🔍 Searching for background music...'
        });

        let musicPath = null;
        try {
            const musicTracks = await pixabayService.searchMusic('cinematic ambient');
            if (musicTracks.length > 0) {
                const track = musicTracks[0];
                if (track.url) {
                    musicPath = path.join(tempDir, `music_${sessionId}.mp3`);
                    await pixabayService.downloadMusic(track.url, musicPath);
                    sendProgress(sessionId, {
                        step: 'downloading',
                        percent: 30,
                        message: '🎵 Background music downloaded'
                    });
                }
            }
        } catch (e) {
            console.log('[Generator] Music search/download failed:', e.message);
            musicPath = null;
        }

        const scenePaths = [];
        const totalScenes = scenes.length;

        // Download and process each scene (30-70%)
        for (let i = 0; i < totalScenes; i++) {
            const scene = scenes[i];
            const scenePercent = 30 + Math.floor((i / totalScenes) * 40);

            sendProgress(sessionId, {
                step: 'downloading',
                percent: scenePercent,
                message: `🎬 Scene ${i + 1}/${totalScenes}: Searching "${scene.description.substring(0, 40)}..."`
            });

            // Search for video with orientation based on format
            const orientation = (options.format === '9:16') ? 'portrait' : 'landscape';
            let videos = await pexelsService.searchVideos(scene.keywords || [scene.description], scene.duration, 5, orientation);
            if (videos.length === 0) {
                videos = await pixabayService.searchVideos(scene.keywords || [scene.description], scene.duration, 5, orientation);
            }
            if (videos.length === 0) throw new Error(`No videos found for scene: ${scene.description}`);

            sendProgress(sessionId, {
                step: 'downloading',
                percent: scenePercent + 1,
                message: `⬇️ Downloading scene ${i + 1}/${totalScenes}...`
            });

            const videoPath = path.join(tempDir, `scene_${sessionId}_${i}_raw.mp4`);
            await pexelsService.downloadVideo(videos[0].url, videoPath);

            // Trim video with correct format
            const trimmedVideoPath = path.join(tempDir, `scene_${sessionId}_${i}_trimmed.mp4`);
            await videoAssembler.trimVideo(videoPath, scene.duration, trimmedVideoPath, options.format);

            scenePaths.push(trimmedVideoPath);

            // Cleanup
            try { fs.unlinkSync(videoPath); } catch (e) { }
        }

        sendProgress(sessionId, {
            step: 'downloading',
            percent: 70,
            message: `✅ All ${totalScenes} video clips downloaded successfully!`
        });

        // STEP 5: Assembling Video (70-85%)
        sendProgress(sessionId, {
            step: 'assembling',
            percent: 72,
            message: '🔧 Combining video clips into timeline...'
        });

        const assembledVideoPath = path.join(tempDir, `assembled_video_${sessionId}.mp4`);
        await videoAssembler.assembleScenes(scenePaths, assembledVideoPath, options.format);

        sendProgress(sessionId, {
            step: 'assembling',
            percent: 84,
            message: '✅ Video timeline assembled!'
        });

        // STEP 6: Adding Audio (85-95%)
        sendProgress(sessionId, {
            step: 'audio',
            percent: 86,
            message: '🎙️ Syncing continuous voice-over to video...'
        });

        const videoWithNarrationPath = path.join(tempDir, `video_narration_${sessionId}.mp4`);
        await videoAssembler.addAudioToVideo(assembledVideoPath, narrationPath, videoWithNarrationPath);

        sendProgress(sessionId, {
            step: 'audio',
            percent: 90,
            message: '✅ Voice-over added successfully!'
        });

        // Add background music if available
        const finalVideoPath = path.join(outputsDir, `video_${sessionId}.mp4`);

        if (musicPath) {
            sendProgress(sessionId, {
                step: 'audio',
                percent: 92,
                message: '🎵 Mixing background music...'
            });

            try {
                await videoAssembler.addBackgroundMusic(videoWithNarrationPath, musicPath, finalVideoPath);
                sendProgress(sessionId, {
                    step: 'audio',
                    percent: 94,
                    message: '✅ Background music added!'
                });
            } catch (e) {
                console.error('[Generator] Failed to add music:', e);
                fs.copyFileSync(videoWithNarrationPath, finalVideoPath);
            }
        } else {
            fs.copyFileSync(videoWithNarrationPath, finalVideoPath);
        }

        // Cleanup temporary files (but keep scene files for replacement feature)
        try {
            fs.unlinkSync(assembledVideoPath);
            fs.unlinkSync(videoWithNarrationPath);
            if (musicPath) fs.unlinkSync(musicPath);
            if (narrationPath) fs.unlinkSync(narrationPath);

            // Move scene files to outputs directory for scene replacement
            const persistentScenePaths = [];
            for (let i = 0; i < scenePaths.length; i++) {
                const scenePath = scenePaths[i];
                const sceneFilename = `scene_${sessionId}_${i}.mp4`;
                const newPath = path.join(outputsDir, sceneFilename);

                try {
                    fs.copyFileSync(scenePath, newPath);
                    persistentScenePaths.push(newPath);
                    fs.unlinkSync(scenePath); // Delete temp
                } catch (e) {
                    console.error(`[Generator] Failed to move scene ${i}:`, e);
                    persistentScenePaths.push(scenePath); // Keep original if copy fails
                }
            }

            // Update scenePaths to persistent versions
            scenePaths = persistentScenePaths;
        } catch (e) { }

        // STEP 7: Finalizing (95-99%)
        sendProgress(sessionId, {
            step: 'finalizing',
            percent: 98,
            message: '🎉 Finalizing your video...'
        });

        const session = sessions.get(sessionId);
        session.status = 'completed';
        session.videoUrl = `/outputs/video_${sessionId}.mp4`;
        session.scenePaths = scenePaths;

        sendProgress(sessionId, {
            step: 'complete',
            percent: 100,
            message: '🎬 Video generation complete! Ready for preview.',
            videoUrl: session.videoUrl
        });

    } catch (error) {
        console.error(`[Generator] Error for session ${sessionId}:`, error);
        const session = sessions.get(sessionId);
        if (session) {
            session.status = 'error';
            session.error = error.message;
        }
        sendProgress(sessionId, {
            step: 'error',
            percent: 0,
            message: `❌ Error: ${error.message}`
        });
    }
}

module.exports = router;
