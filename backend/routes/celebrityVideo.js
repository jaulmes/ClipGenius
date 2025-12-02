const express = require('express');
const router = express.Router();
const celebrityVideoGen = require('../services/celebrityVideoGen');
const groqService = require('../services/groqService');

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

// POST /api/celebrity-video/analyze - Analyser un script
router.post('/analyze', async (req, res) => {
    try {
        const { script } = req.body;
        if (!script || script.trim().length === 0) {
            return res.status(400).json({ error: 'Script requis' });
        }

        const analysis = await groqService.analyzeForCelebrityVideo(script);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/celebrity-video/generate - Générer une vidéo
router.post('/generate', async (req, res) => {
    try {
        const { script, language, voiceId } = req.body;
        if (!script) {
            return res.status(400).json({ error: 'Script requis' });
        }

        const sessionId = Date.now().toString();
        sessions.set(sessionId, {
            status: 'processing',
            progress: { step: 'init', percent: 0 }
        });

        // Start async
        generateAsync(sessionId, script, { language, voiceId });

        res.json({ sessionId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function generateAsync(sessionId, script, options) {
    try {
        sendProgress(sessionId, { step: 'analyzing', percent: 10, message: 'Analyse du script...' });

        sendProgress(sessionId, { step: 'generating', percent: 30, message: 'Génération de la vidéo...' });
        const videoUrl = await celebrityVideoGen.generateCelebrityVideo(sessionId, script, options);

        const session = sessions.get(sessionId);
        session.status = 'completed';
        session.videoUrl = videoUrl;

        sendProgress(sessionId, {
            step: 'complete',
            percent: 100,
            message: 'Vidéo générée avec succès!',
            videoUrl
        });
    } catch (error) {
        console.error(`[CelebrityVideo] Error for session ${sessionId}:`, error);
        const session = sessions.get(sessionId);
        if (session) {
            session.status = 'error';
            session.error = error.message;
        }
        sendProgress(sessionId, {
            step: 'error',
            percent: 0,
            message: `Erreur: ${error.message}`
        });
    }
}

// GET /api/celebrity-video/progress/:sessionId - SSE Progress
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

module.exports = router;
